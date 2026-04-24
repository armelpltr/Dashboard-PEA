const zlib = require('zlib');
const fs   = require('fs');

const W = 180, H = 180;
const BG     = [18,  17,  31 ];  // #12111f
const PURPLE = [124, 109, 245];  // #7c6df5
const LILAC  = [167, 139, 250];  // #a78bfa

// RGBA pixel buffer
const buf = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  buf[i*4]   = BG[0];
  buf[i*4+1] = BG[1];
  buf[i*4+2] = BG[2];
  buf[i*4+3] = 255;
}

function setPixel(x, y, r, g, b, a = 255) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 4;
  buf[i] = r; buf[i+1] = g; buf[i+2] = b; buf[i+3] = a;
}

function blendPixel(x, y, r, g, b, alpha) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const i = (y * W + x) * 4;
  const a = alpha / 255;
  buf[i]   = Math.round(buf[i]   * (1-a) + r * a);
  buf[i+1] = Math.round(buf[i+1] * (1-a) + g * a);
  buf[i+2] = Math.round(buf[i+2] * (1-a) + b * a);
  buf[i+3] = 255;
}

function drawLine(x0, y0, x1, y1, col, thick) {
  const dx = Math.abs(x1-x0), dy = Math.abs(y1-y0);
  const sx = x0<x1?1:-1, sy = y0<y1?1:-1;
  let err = dx - dy, x = x0, y = y0;
  const h = Math.floor(thick/2);
  while (true) {
    for (let tx = -h; tx <= h; tx++)
      for (let ty = -h; ty <= h; ty++)
        if (tx*tx + ty*ty <= h*h + h)
          setPixel(x+tx, y+ty, col[0], col[1], col[2]);
    if (x===x1 && y===y1) break;
    const e2 = 2*err;
    if (e2 > -dy) { err -= dy; x += sx; }
    if (e2 <  dx) { err += dx; y += sy; }
  }
}

function drawCircle(cx, cy, rad, col) {
  for (let dy = -rad; dy <= rad; dy++)
    for (let dx = -rad; dx <= rad; dx++)
      if (dx*dx + dy*dy <= rad*rad)
        setPixel(cx+dx, cy+dy, col[0], col[1], col[2]);
}

// Chart waypoints
const pts = [[24,120],[56,96],[90,108],[124,62],[156,30]];

// Fill under chart line (gradient fade to bottom)
for (let xi = 24; xi <= 156; xi++) {
  let lineY = 140;
  for (let i = 0; i < pts.length-1; i++) {
    const [x0,y0] = pts[i], [x1,y1] = pts[i+1];
    if (xi >= x0 && xi <= x1) {
      const t = (xi-x0)/(x1-x0);
      lineY = Math.round(y0 + t*(y1-y0));
      break;
    }
  }
  const bottom = 148;
  for (let yi = lineY; yi <= bottom; yi++) {
    const f = 1 - (yi-lineY)/(bottom-lineY+1);
    const a = Math.round(f * f * 90);
    blendPixel(xi, yi, PURPLE[0], PURPLE[1], PURPLE[2], a);
  }
}

// Chart line
for (let i = 0; i < pts.length-1; i++)
  drawLine(pts[i][0], pts[i][1], pts[i+1][0], pts[i+1][1], PURPLE, 9);

// Glow dot at peak
drawCircle(156, 30, 11, [100, 85, 200]);
drawCircle(156, 30,  7, LILAC);

// ─── PNG encoding ─────────────────────────────────────────

function crc32(data) {
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < data.length; i++) crc = table[(crc ^ data[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const tb = Buffer.from(type, 'ascii');
  const lb = Buffer.allocUnsafe(4); lb.writeUInt32BE(data.length);
  const cb = Buffer.allocUnsafe(4); cb.writeUInt32BE(crc32(Buffer.concat([tb, data])));
  return Buffer.concat([lb, tb, data, cb]);
}

const ihdr = Buffer.allocUnsafe(13);
ihdr.writeUInt32BE(W,  0);
ihdr.writeUInt32BE(H,  4);
ihdr[8]=8; ihdr[9]=6; ihdr[10]=0; ihdr[11]=0; ihdr[12]=0; // RGBA

const scanlines = [];
for (let y = 0; y < H; y++) {
  scanlines.push(0);
  for (let x = 0; x < W; x++) {
    const i = (y*W+x)*4;
    scanlines.push(buf[i], buf[i+1], buf[i+2], buf[i+3]);
  }
}
const idat = zlib.deflateSync(Buffer.from(scanlines), { level: 9 });

const png = Buffer.concat([
  Buffer.from([137,80,78,71,13,10,26,10]),
  pngChunk('IHDR', ihdr),
  pngChunk('IDAT', idat),
  pngChunk('IEND', Buffer.alloc(0)),
]);

fs.writeFileSync('apple-touch-icon.png', png);
console.log('apple-touch-icon.png généré (' + png.length + ' bytes)');
