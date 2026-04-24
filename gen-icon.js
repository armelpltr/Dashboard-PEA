const zlib = require('zlib');
const fs   = require('fs');

const BG     = [18,  17,  31 ];
const PURPLE = [124, 109, 245];
const LILAC  = [167, 139, 250];

function generateIcon(W, H, pts, lineThick, dotRad, dotGlowRad, fillBottom) {
  const buf = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    buf[i*4]=BG[0]; buf[i*4+1]=BG[1]; buf[i*4+2]=BG[2]; buf[i*4+3]=255;
  }

  function setPixel(x, y, r, g, b) {
    if (x<0||x>=W||y<0||y>=H) return;
    const i=(y*W+x)*4; buf[i]=r; buf[i+1]=g; buf[i+2]=b; buf[i+3]=255;
  }
  function blendPixel(x, y, r, g, b, alpha) {
    if (x<0||x>=W||y<0||y>=H) return;
    const i=(y*W+x)*4, a=alpha/255;
    buf[i]=Math.round(buf[i]*(1-a)+r*a);
    buf[i+1]=Math.round(buf[i+1]*(1-a)+g*a);
    buf[i+2]=Math.round(buf[i+2]*(1-a)+b*a);
    buf[i+3]=255;
  }
  function drawLine(x0,y0,x1,y1,col,thick) {
    const dx=Math.abs(x1-x0),dy=Math.abs(y1-y0);
    const sx=x0<x1?1:-1,sy=y0<y1?1:-1;
    let err=dx-dy,x=x0,y=y0;
    const h=Math.floor(thick/2);
    while(true){
      for(let tx=-h;tx<=h;tx++) for(let ty=-h;ty<=h;ty++)
        if(tx*tx+ty*ty<=h*h+h) setPixel(x+tx,y+ty,col[0],col[1],col[2]);
      if(x===x1&&y===y1) break;
      const e2=2*err;
      if(e2>-dy){err-=dy;x+=sx;}
      if(e2<dx){err+=dx;y+=sy;}
    }
  }
  function drawCircle(cx,cy,rad,col){
    for(let dy=-rad;dy<=rad;dy++) for(let dx=-rad;dx<=rad;dx++)
      if(dx*dx+dy*dy<=rad*rad) setPixel(cx+dx,cy+dy,col[0],col[1],col[2]);
  }

  // Fill under chart
  const [xStart] = pts[0], [xEnd] = pts[pts.length-1];
  for(let xi=xStart[0];xi<=xEnd[0];xi++){
    let lineY=fillBottom;
    for(let i=0;i<pts.length-1;i++){
      const [x0,y0]=pts[i],[x1,y1]=pts[i+1];
      if(xi>=x0&&xi<=x1){ lineY=Math.round(y0+(xi-x0)/(x1-x0)*(y1-y0)); break; }
    }
    for(let yi=lineY;yi<=fillBottom;yi++){
      const f=1-(yi-lineY)/(fillBottom-lineY+1);
      blendPixel(xi,yi,PURPLE[0],PURPLE[1],PURPLE[2],Math.round(f*f*90));
    }
  }

  // Line
  for(let i=0;i<pts.length-1;i++)
    drawLine(pts[i][0],pts[i][1],pts[i+1][0],pts[i+1][1],PURPLE,lineThick);

  // Dot + glow
  const [px,py]=pts[pts.length-1];
  drawCircle(px,py,dotGlowRad,[100,85,200]);
  drawCircle(px,py,dotRad,LILAC);

  return buf;
}

function encodePng(buf, W, H) {
  function crc32(data){
    const t=[];
    for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=(c&1)?0xEDB88320^(c>>>1):c>>>1;t[n]=c;}
    let crc=0xFFFFFFFF;
    for(let i=0;i<data.length;i++) crc=t[(crc^data[i])&0xFF]^(crc>>>8);
    return(crc^0xFFFFFFFF)>>>0;
  }
  function chunk(type,data){
    const tb=Buffer.from(type,'ascii'),lb=Buffer.allocUnsafe(4),cb=Buffer.allocUnsafe(4);
    lb.writeUInt32BE(data.length); cb.writeUInt32BE(crc32(Buffer.concat([tb,data])));
    return Buffer.concat([lb,tb,data,cb]);
  }
  const ihdr=Buffer.allocUnsafe(13);
  ihdr.writeUInt32BE(W,0); ihdr.writeUInt32BE(H,4);
  ihdr[8]=8;ihdr[9]=6;ihdr[10]=0;ihdr[11]=0;ihdr[12]=0;
  const scanlines=[];
  for(let y=0;y<H;y++){
    scanlines.push(0);
    for(let x=0;x<W;x++){const i=(y*W+x)*4;scanlines.push(buf[i],buf[i+1],buf[i+2],buf[i+3]);}
  }
  const idat=zlib.deflateSync(Buffer.from(scanlines),{level:9});
  return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',ihdr),chunk('IDAT',idat),chunk('IEND',Buffer.alloc(0))]);
}

// ── 180×180 iPhone ────────────────────────────────────────
const pts180 = [[24,120],[56,96],[90,108],[124,62],[156,30]];
const png180 = encodePng(generateIcon(180,180,pts180,9,7,11,148), 180,180);
fs.writeFileSync('apple-touch-icon.png', png180);
console.log('apple-touch-icon.png (' + png180.length + ' bytes)');

// ── 32×32 favicon ─────────────────────────────────────────
const s = 32/180;
const pts32 = pts180.map(([x,y]) => [Math.round(x*s), Math.round(y*s)]);
const png32 = encodePng(generateIcon(32,32,pts32,2,1,2,Math.round(148*s)), 32,32);
fs.writeFileSync('favicon-32.png', png32);
console.log('favicon-32.png (' + png32.length + ' bytes)');
