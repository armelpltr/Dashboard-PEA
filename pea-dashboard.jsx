import { useState, useEffect, useRef, useCallback } from "react";
import {
  LineChart, Line, ResponsiveContainer, Tooltip, AreaChart, Area,
  XAxis, YAxis, CartesianGrid
} from "recharts";
import {
  TrendingUp, TrendingDown, LogOut, BarChart2, Activity,
  PlusCircle, Trash2, Search, Globe, Star, ChevronUp, ChevronDown,
  Wallet, ArrowUpRight, ArrowDownRight, RefreshCw, X, Check
} from "lucide-react";

// ─── MOCK DATA ───────────────────────────────────────────────────────────────

const USERS = {
  nolan: { password: "nolan", name: "Nolan" },
  armel: { password: "armel", name: "Armel" },
};

const TICKER_DB = {
  AAPL:  { name: "Apple Inc.",            sector: "Technologie",   price: 189.30 },
  MSFT:  { name: "Microsoft Corp.",       sector: "Technologie",   price: 415.20 },
  NVDA:  { name: "NVIDIA Corp.",          sector: "Semi-conducteurs", price: 875.40 },
  GOOGL: { name: "Alphabet Inc.",         sector: "Technologie",   price: 175.80 },
  AMZN:  { name: "Amazon.com Inc.",       sector: "E-commerce",    price: 192.50 },
  META:  { name: "Meta Platforms",        sector: "Réseaux sociaux", price: 508.60 },
  TSLA:  { name: "Tesla Inc.",            sector: "Automobile",    price: 245.10 },
  BRK:   { name: "Berkshire Hathaway",    sector: "Finance",       price: 408.00 },
  JPM:   { name: "JPMorgan Chase",        sector: "Finance",       price: 218.40 },
  V:     { name: "Visa Inc.",             sector: "Finance",       price: 278.90 },
  MC:    { name: "LVMH",                  sector: "Luxe",          price: 642.00 },
  OR:    { name: "L'Oréal",              sector: "Cosmétiques",   price: 388.50 },
  AIR:   { name: "Airbus SE",             sector: "Aéronautique",  price: 168.20 },
  TTE:   { name: "TotalEnergies",         sector: "Énergie",       price: 62.40 },
  SAN:   { name: "Sanofi",               sector: "Santé",         price: 89.70 },
  BNP:   { name: "BNP Paribas",          sector: "Finance",       price: 65.30 },
  "CW8": { name: "Amundi MSCI World ETF", sector: "ETF Monde",     price: 424.10 },
  "ESE": { name: "iShares Core S&P 500",  sector: "ETF US",        price: 38.20 },
  SP500: { name: "Lyxor S&P 500",         sector: "ETF US",        price: 52.80 },
};

const TOP_MARKET_CAP = [
  { ticker: "MSFT",  name: "Microsoft",     cap: "3 100 Md$", change: +1.2 },
  { ticker: "AAPL",  name: "Apple",         cap: "2 900 Md$", change: -0.4 },
  { ticker: "NVDA",  name: "NVIDIA",        cap: "2 150 Md$", change: +3.7 },
  { ticker: "GOOGL", name: "Alphabet",      cap: "2 200 Md$", change: +0.8 },
  { ticker: "AMZN",  name: "Amazon",        cap: "2 000 Md$", change: +1.5 },
  { ticker: "META",  name: "Meta",          cap: "1 300 Md$", change: +2.1 },
  { ticker: "TSLA",  name: "Tesla",         cap: "780 Md$",   change: -2.8 },
  { ticker: "BRK",   name: "Berkshire",     cap: "880 Md$",   change: +0.3 },
];

const TRENDING = [
  { ticker: "NVDA",  name: "NVIDIA",        change: +5.2,  volume: "142M" },
  { ticker: "TSLA",  name: "Tesla",         change: -3.8,  volume: "98M"  },
  { ticker: "META",  name: "Meta",          change: +4.1,  volume: "67M"  },
  { ticker: "AAPL",  name: "Apple",         change: -1.2,  volume: "83M"  },
  { ticker: "AMZN",  name: "Amazon",        change: +2.9,  volume: "55M"  },
  { ticker: "AIR",   name: "Airbus",        change: +3.4,  volume: "22M"  },
];

function generateSparkline(base, points = 20) {
  const data = [];
  let val = base;
  for (let i = 0; i < points; i++) {
    val = val * (1 + (Math.random() - 0.48) * 0.025);
    data.push({ v: parseFloat(val.toFixed(2)) });
  }
  return data;
}

function generatePriceHistory(base, days = 30) {
  const data = [];
  let val = base * 0.85;
  const labels = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    labels.push(d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }));
    val = val * (1 + (Math.random() - 0.47) * 0.03);
    data.push({ date: labels[labels.length - 1], price: parseFloat(val.toFixed(2)) });
  }
  data[data.length - 1].price = base;
  return data;
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0a0c10;
    --surface:   #111318;
    --surface2:  #191c24;
    --border:    #1e2230;
    --border2:   #252a38;
    --text:      #e8eaf0;
    --muted:     #5a6080;
    --accent:    #4f8ef7;
    --green:     #22d3a0;
    --red:       #f75555;
    --yellow:    #f7c948;
    --font:      'Syne', sans-serif;
    --mono:      'DM Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font); overflow-x: hidden; }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  .app { display: flex; min-height: 100vh; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 220px; min-height: 100vh; background: var(--surface);
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    padding: 24px 0; position: fixed; top: 0; left: 0; z-index: 100;
  }
  .sidebar-logo {
    padding: 0 20px 28px; font-size: 18px; font-weight: 800; letter-spacing: -0.5px;
    color: var(--text); display: flex; align-items: center; gap: 8px;
  }
  .sidebar-logo span { color: var(--accent); }
  .sidebar-nav { display: flex; flex-direction: column; gap: 2px; padding: 0 10px; flex: 1; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;
    color: var(--muted); transition: all 0.15s; border: none; background: none; width: 100%;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: rgba(79,142,247,0.12); color: var(--accent); }
  .sidebar-bottom { padding: 16px 10px; border-top: 1px solid var(--border); margin-top: auto; }
  .user-badge {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
    border-radius: 8px; background: var(--surface2);
  }
  .user-avatar {
    width: 32px; height: 32px; border-radius: 8px; background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 800; color: white; flex-shrink: 0;
  }
  .user-name { font-size: 13px; font-weight: 700; flex: 1; }
  .logout-btn {
    background: none; border: none; cursor: pointer; color: var(--muted);
    padding: 4px; border-radius: 4px; transition: color 0.15s; display: flex;
  }
  .logout-btn:hover { color: var(--red); }

  /* ── MAIN ── */
  .main { margin-left: 220px; flex: 1; padding: 32px; min-height: 100vh; }

  /* ── PAGE HEADER ── */
  .page-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 32px;
  }
  .page-title { font-size: 26px; font-weight: 800; letter-spacing: -0.5px; }
  .page-subtitle { font-size: 13px; color: var(--muted); margin-top: 2px; font-family: var(--mono); }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px;
    border-radius: 8px; font-size: 13px; font-weight: 700; cursor: pointer;
    border: none; transition: all 0.15s; font-family: var(--font);
  }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: #6aa0f8; transform: translateY(-1px); }
  .btn-danger { background: rgba(247,85,85,0.12); color: var(--red); border: 1px solid rgba(247,85,85,0.2); }
  .btn-danger:hover { background: rgba(247,85,85,0.2); }
  .btn-ghost { background: var(--surface2); color: var(--text); border: 1px solid var(--border2); }
  .btn-ghost:hover { background: var(--border2); }

  /* ── CARDS ── */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 20px;
  }
  .card-title { font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 12px; }

  /* ── STAT CARDS ── */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 20px 22px;
  }
  .stat-label { font-size: 11px; color: var(--muted); font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
  .stat-value { font-size: 26px; font-weight: 800; margin: 8px 0 4px; letter-spacing: -1px; font-family: var(--mono); }
  .stat-change { font-size: 12px; display: flex; align-items: center; gap: 4px; font-family: var(--mono); font-weight: 500; }
  .up { color: var(--green); }
  .down { color: var(--red); }
  .neutral { color: var(--muted); }

  /* ── TABLE ── */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead th {
    text-align: left; padding: 10px 14px; font-size: 10px; font-weight: 700;
    color: var(--muted); letter-spacing: 1.2px; text-transform: uppercase;
    border-bottom: 1px solid var(--border);
  }
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.1s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--surface2); }
  tbody td { padding: 12px 14px; font-family: var(--mono); }
  .ticker-badge {
    display: inline-block; background: rgba(79,142,247,0.12); color: var(--accent);
    padding: 2px 8px; border-radius: 5px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px;
  }
  .sector-badge {
    display: inline-block; background: var(--surface2); color: var(--muted);
    padding: 2px 8px; border-radius: 5px; font-size: 11px; border: 1px solid var(--border2);
  }
  .perf-positive { color: var(--green); font-weight: 600; }
  .perf-negative { color: var(--red); font-weight: 600; }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.75); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; z-index: 999;
    animation: fadeIn 0.15s ease;
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border2); border-radius: 16px;
    padding: 28px; width: 420px; max-width: 95vw;
    animation: slideUp 0.2s ease;
  }
  .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .modal-title { font-size: 18px; font-weight: 800; }
  .modal-close { background: none; border: none; cursor: pointer; color: var(--muted); display: flex; }
  .modal-close:hover { color: var(--text); }
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 11px; font-weight: 700; color: var(--muted); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; display: block; }
  .form-input {
    width: 100%; padding: 10px 14px; background: var(--surface2); border: 1px solid var(--border2);
    border-radius: 8px; color: var(--text); font-size: 14px; font-family: var(--mono);
    outline: none; transition: border-color 0.15s;
  }
  .form-input:focus { border-color: var(--accent); }
  .form-input::placeholder { color: var(--muted); }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .ticker-preview {
    background: var(--surface2); border: 1px solid var(--border2); border-radius: 8px;
    padding: 12px 14px; margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
  }
  .ticker-preview-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
  .ticker-preview-name { font-size: 13px; font-weight: 700; }
  .ticker-preview-sector { font-size: 11px; color: var(--muted); }
  .modal-actions { display: flex; gap: 10px; margin-top: 24px; }

  /* ── MARKET ── */
  .market-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .asset-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 16px 18px; display: flex; flex-direction: column; gap: 8px;
  }
  .asset-card-header { display: flex; justify-content: space-between; align-items: flex-start; }
  .asset-ticker { font-size: 13px; font-weight: 800; color: var(--accent); font-family: var(--mono); }
  .asset-name { font-size: 11px; color: var(--muted); margin-top: 1px; }
  .asset-price { font-size: 22px; font-weight: 800; font-family: var(--mono); letter-spacing: -0.5px; }
  .asset-change-badge {
    display: flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 6px;
    font-size: 12px; font-weight: 700; font-family: var(--mono);
  }
  .badge-up { background: rgba(34,211,160,0.12); color: var(--green); }
  .badge-down { background: rgba(247,85,85,0.12); color: var(--red); }

  /* ── TRENDING TABLE ── */
  .trend-item {
    display: flex; align-items: center; padding: 12px 0;
    border-bottom: 1px solid var(--border);
  }
  .trend-item:last-child { border-bottom: none; }
  .trend-rank { width: 28px; font-size: 12px; color: var(--muted); font-family: var(--mono); }
  .trend-info { flex: 1; }
  .trend-ticker { font-size: 13px; font-weight: 700; color: var(--text); }
  .trend-name { font-size: 11px; color: var(--muted); }
  .trend-volume { font-size: 11px; color: var(--muted); font-family: var(--mono); text-align: right; margin-right: 16px; }
  .trend-perf { font-size: 13px; font-weight: 700; font-family: var(--mono); width: 70px; text-align: right; }

  /* ── LOGIN ── */
  .login-page {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg); position: relative; overflow: hidden;
  }
  .login-bg {
    position: absolute; inset: 0; pointer-events: none;
    background: radial-gradient(ellipse 60% 50% at 50% -20%, rgba(79,142,247,0.15), transparent);
  }
  .login-card {
    background: var(--surface); border: 1px solid var(--border2); border-radius: 20px;
    padding: 40px; width: 380px; position: relative; z-index: 1;
  }
  .login-logo { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
  .login-logo span { color: var(--accent); }
  .login-subtitle { font-size: 13px; color: var(--muted); margin-bottom: 32px; }
  .login-error { background: rgba(247,85,85,0.1); border: 1px solid rgba(247,85,85,0.2); color: var(--red); padding: 10px 14px; border-radius: 8px; font-size: 13px; margin-bottom: 16px; }
  .login-btn { width: 100%; justify-content: center; padding: 13px; font-size: 14px; margin-top: 8px; }
  .login-hint { font-size: 11px; color: var(--muted); text-align: center; margin-top: 20px; font-family: var(--mono); }

  /* ── CHART SECTION ── */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .section-title { font-size: 14px; font-weight: 800; }
  .section-badge { font-size: 10px; background: var(--surface2); color: var(--muted); padding: 3px 8px; border-radius: 5px; border: 1px solid var(--border2); }

  .empty-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 60px 20px; color: var(--muted); gap: 12px;
  }
  .empty-state svg { opacity: 0.3; }
  .empty-state p { font-size: 14px; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .delete-btn {
    background: none; border: none; cursor: pointer; color: var(--muted);
    padding: 5px; border-radius: 5px; transition: all 0.15s; display: flex;
  }
  .delete-btn:hover { color: var(--red); background: rgba(247,85,85,0.1); }

  .refresh-btn {
    background: none; border: none; cursor: pointer; color: var(--muted);
    padding: 6px; border-radius: 6px; transition: all 0.15s; display: flex;
  }
  .refresh-btn:hover { color: var(--text); background: var(--surface2); }
  .spin { animation: spin 1s linear infinite; }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

  .market-sections { display: flex; flex-direction: column; gap: 24px; }
  .top-cap-item {
    display: flex; align-items: center; padding: 10px 0;
    border-bottom: 1px solid var(--border);
  }
  .top-cap-item:last-child { border-bottom: none; }
  .cap-rank { width: 32px; font-size: 11px; color: var(--muted); font-family: var(--mono); font-weight: 700; }
  .cap-info { flex: 1; }
  .cap-ticker { font-size: 12px; font-weight: 800; color: var(--accent); }
  .cap-name { font-size: 12px; color: var(--muted); }
  .cap-value { font-size: 13px; font-weight: 700; font-family: var(--mono); margin-right: 16px; }
  .cap-change { font-size: 12px; font-weight: 700; font-family: var(--mono); width: 60px; text-align: right; }
`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Sparkline({ data, positive }) {
  const color = positive ? "#22d3a0" : "#f75555";
  return (
    <ResponsiveContainer width={100} height={40}>
      <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={`sg-${positive}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} fill={`url(#sg-${positive})`} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function StatCard({ label, value, change, icon: Icon, positive }) {
  return (
    <div className="stat-card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span className="stat-label">{label}</span>
        {Icon && <Icon size={16} color="var(--muted)" />}
      </div>
      <div className="stat-value">{value}</div>
      {change !== undefined && (
        <div className={`stat-change ${positive ? "up" : positive === false ? "down" : "neutral"}`}>
          {positive ? <ChevronUp size={14} /> : positive === false ? <ChevronDown size={14} /> : null}
          {change}
        </div>
      )}
    </div>
  );
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────

function LoginPage({ onLogin }) {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");

  const handle = () => {
    const u = USERS[id.toLowerCase()];
    if (u && u.password === pwd) {
      onLogin(id.toLowerCase(), u.name);
    } else {
      setError("Identifiant ou mot de passe incorrect.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg" />
      <div className="login-card">
        <div className="login-logo">PEA<span>Track</span></div>
        <div className="login-subtitle">Suivi de portefeuille — Espace personnel</div>
        {error && <div className="login-error">{error}</div>}
        <div className="form-group">
          <label className="form-label">Identifiant</label>
          <input className="form-input" value={id} onChange={e => { setId(e.target.value); setError(""); }} placeholder="nolan ou armel" onKeyDown={e => e.key === "Enter" && handle()} />
        </div>
        <div className="form-group">
          <label className="form-label">Mot de passe</label>
          <input className="form-input" type="password" value={pwd} onChange={e => { setPwd(e.target.value); setError(""); }} placeholder="••••••" onKeyDown={e => e.key === "Enter" && handle()} />
        </div>
        <button className="btn btn-primary login-btn" onClick={handle}>Se connecter</button>
        <div className="login-hint">nolan/nolan · armel/armel</div>
      </div>
    </div>
  );
}

// ─── ADD MODAL ───────────────────────────────────────────────────────────────

function AddModal({ onClose, onAdd }) {
  const [ticker, setTicker] = useState("");
  const [preview, setPreview] = useState(null);
  const [qty, setQty] = useState("");
  const [pru, setPru] = useState("");

  const lookupTicker = (val) => {
    const t = val.toUpperCase().trim();
    setTicker(t);
    const found = TICKER_DB[t];
    setPreview(found ? { ...found, ticker: t } : null);
  };

  const handleAdd = () => {
    if (!preview || !qty || !pru) return;
    onAdd({
      ticker: preview.ticker,
      name: preview.name,
      sector: preview.sector,
      qty: parseFloat(qty),
      pru: parseFloat(pru),
      price: preview.price + (Math.random() - 0.5) * 5,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Ajouter une ligne</span>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="form-group">
          <label className="form-label">Ticker</label>
          <input className="form-input" value={ticker} onChange={e => lookupTicker(e.target.value)} placeholder="ex: AAPL, NVDA, CW8..." />
        </div>
        {preview && (
          <div className="ticker-preview">
            <div className="ticker-preview-dot" />
            <div>
              <div className="ticker-preview-name">{preview.name}</div>
              <div className="ticker-preview-sector">{preview.sector} · {preview.price.toFixed(2)} €</div>
            </div>
          </div>
        )}
        {ticker && !preview && (
          <div style={{ fontSize: 12, color: "var(--red)", marginBottom: 12 }}>Ticker non trouvé. Essayez : AAPL, MSFT, NVDA, MC, CW8…</div>
        )}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Nombre de titres</label>
            <input className="form-input" type="number" value={qty} onChange={e => setQty(e.target.value)} placeholder="10" />
          </div>
          <div className="form-group">
            <label className="form-label">PRU (€)</label>
            <input className="form-input" type="number" value={pru} onChange={e => setPru(e.target.value)} placeholder="150.00" />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Annuler</button>
          <button className="btn btn-primary" onClick={handleAdd} disabled={!preview || !qty || !pru} style={{ flex: 1, justifyContent: "center", opacity: (!preview || !qty || !pru) ? 0.5 : 1 }}>
            <Check size={15} /> Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TAB: SUIVI ──────────────────────────────────────────────────────────────

function SuiviTab({ portfolio, setPortfolio }) {
  const [showModal, setShowModal] = useState(false);

  const totalInvested = portfolio.reduce((s, l) => s + l.qty * l.pru, 0);
  const totalValue    = portfolio.reduce((s, l) => s + l.qty * l.price, 0);
  const totalPerfEur  = totalValue - totalInvested;
  const totalPerfPct  = totalInvested > 0 ? (totalPerfEur / totalInvested) * 100 : 0;

  const addLine = (line) => {
    setPortfolio(prev => [...prev, { ...line, id: Date.now() }]);
  };
  const deleteLine = (id) => {
    setPortfolio(prev => prev.filter(l => l.id !== id));
  };

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Mon Portefeuille</div>
          <div className="page-subtitle">{portfolio.length} ligne{portfolio.length !== 1 ? "s" : ""} · Mis à jour maintenant</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <PlusCircle size={15} /> Ajouter une ligne
        </button>
      </div>

      <div className="stats-grid">
        <StatCard label="Valeur totale"   value={`${totalValue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`}    icon={Wallet}    change="Portefeuille PEA" />
        <StatCard label="Investi"         value={`${totalInvested.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`}  icon={BarChart2} change="Capital déployé" />
        <StatCard label="Plus-value"      value={`${totalPerfEur >= 0 ? "+" : ""}${totalPerfEur.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €`} icon={TrendingUp} change={`${totalPerfPct >= 0 ? "+" : ""}${totalPerfPct.toFixed(2)} %`} positive={totalPerfEur >= 0} />
        <StatCard label="Lignes"          value={portfolio.length} icon={Activity} change={`${portfolio.filter(l => l.price > l.pru).length} en positif`} />
      </div>

      <div className="card">
        <div className="section-header">
          <span className="section-title">Positions ouvertes</span>
          <span className="section-badge">{portfolio.length} actif{portfolio.length !== 1 ? "s" : ""}</span>
        </div>
        {portfolio.length === 0 ? (
          <div className="empty-state">
            <BarChart2 size={40} />
            <p>Aucune ligne dans votre portefeuille</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}><PlusCircle size={14} /> Première ligne</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Ticker</th><th>Nom</th><th>Secteur</th>
                  <th style={{ textAlign: "right" }}>Qté</th>
                  <th style={{ textAlign: "right" }}>PRU</th>
                  <th style={{ textAlign: "right" }}>Cours</th>
                  <th style={{ textAlign: "right" }}>Valeur</th>
                  <th style={{ textAlign: "right" }}>Perf €</th>
                  <th style={{ textAlign: "right" }}>Perf %</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map(l => {
                  const val = l.qty * l.price;
                  const inv = l.qty * l.pru;
                  const perfE = val - inv;
                  const perfP = (perfE / inv) * 100;
                  const pos = perfE >= 0;
                  return (
                    <tr key={l.id}>
                      <td><span className="ticker-badge">{l.ticker}</span></td>
                      <td style={{ fontFamily: "var(--font)", fontWeight: 600, fontSize: 13 }}>{l.name}</td>
                      <td><span className="sector-badge">{l.sector}</span></td>
                      <td style={{ textAlign: "right" }}>{l.qty}</td>
                      <td style={{ textAlign: "right" }}>{l.pru.toFixed(2)} €</td>
                      <td style={{ textAlign: "right" }}>{l.price.toFixed(2)} €</td>
                      <td style={{ textAlign: "right", fontWeight: 700 }}>{val.toFixed(2)} €</td>
                      <td style={{ textAlign: "right" }} className={pos ? "perf-positive" : "perf-negative"}>
                        {pos ? "+" : ""}{perfE.toFixed(2)} €
                      </td>
                      <td style={{ textAlign: "right" }} className={pos ? "perf-positive" : "perf-negative"}>
                        {pos ? "+" : ""}{perfP.toFixed(2)} %
                      </td>
                      <td><button className="delete-btn" onClick={() => deleteLine(l.id)}><Trash2 size={14} /></button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && <AddModal onClose={() => setShowModal(false)} onAdd={addLine} />}
    </>
  );
}

// ─── TAB: MARCHÉ ─────────────────────────────────────────────────────────────

function MarcheTab({ portfolio }) {
  const [refreshing, setRefreshing] = useState(false);
  const [sparklines] = useState(() => {
    const s = {};
    Object.keys(TICKER_DB).forEach(t => {
      s[t] = generateSparkline(TICKER_DB[t].price);
    });
    return s;
  });
  const [prices, setPrices] = useState(() => {
    const p = {};
    Object.keys(TICKER_DB).forEach(t => { p[t] = TICKER_DB[t].price; });
    return p;
  });

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setPrices(prev => {
        const n = { ...prev };
        Object.keys(n).forEach(t => { n[t] = parseFloat((n[t] * (1 + (Math.random() - 0.499) * 0.01)).toFixed(2)); });
        return n;
      });
      setRefreshing(false);
    }, 800);
  };

  const ownedTickers = portfolio.length > 0 ? portfolio : [];

  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">Marché</div>
          <div className="page-subtitle">Données simulées · Actualisation manuelle</div>
        </div>
        <button className="refresh-btn" onClick={refresh} title="Actualiser">
          <RefreshCw size={16} className={refreshing ? "spin" : ""} />
        </button>
      </div>

      <div className="market-sections">
        {/* Section 1: Mes actifs */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">Mes Actifs</span>
            <span className="section-badge">{ownedTickers.length} ligne{ownedTickers.length !== 1 ? "s" : ""}</span>
          </div>
          {ownedTickers.length === 0 ? (
            <div className="empty-state" style={{ padding: "30px 20px" }}>
              <Star size={28} />
              <p>Ajoutez des actifs dans l'onglet Suivi</p>
            </div>
          ) : (
            <div className="market-grid">
              {ownedTickers.map(l => {
                const current = prices[l.ticker] ?? l.price;
                const change = ((current - l.pru) / l.pru) * 100;
                const pos = change >= 0;
                return (
                  <div className="asset-card" key={l.id}>
                    <div className="asset-card-header">
                      <div>
                        <div className="asset-ticker">{l.ticker}</div>
                        <div className="asset-name">{l.name}</div>
                      </div>
                      <div className={`asset-change-badge ${pos ? "badge-up" : "badge-down"}`}>
                        {pos ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {pos ? "+" : ""}{change.toFixed(2)} %
                      </div>
                    </div>
                    <div className="asset-price">{current.toFixed(2)} €</div>
                    <Sparkline data={sparklines[l.ticker] ?? []} positive={pos} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Tendances */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">Tendances du jour</span>
            <span className="section-badge">Top movers</span>
          </div>
          {TRENDING.map((t, i) => {
            const pos = t.change >= 0;
            return (
              <div className="trend-item" key={t.ticker}>
                <span className="trend-rank">#{i + 1}</span>
                <div className="trend-info">
                  <div className="trend-ticker">{t.ticker}</div>
                  <div className="trend-name">{t.name}</div>
                </div>
                <span className="trend-volume">{t.volume}</span>
                <span className={`trend-perf ${pos ? "up" : "down"}`}>
                  {pos ? "+" : ""}{t.change.toFixed(1)} %
                </span>
              </div>
            );
          })}
        </div>

        {/* Section 3: Top Market Cap */}
        <div className="card">
          <div className="section-header">
            <span className="section-title">Top Market Cap</span>
            <span className="section-badge"><Globe size={10} style={{ display: "inline" }} /> Mondial</span>
          </div>
          {TOP_MARKET_CAP.map((c, i) => {
            const pos = c.change >= 0;
            return (
              <div className="top-cap-item" key={c.ticker}>
                <span className="cap-rank">#{i + 1}</span>
                <div className="cap-info">
                  <div className="cap-ticker">{c.ticker}</div>
                  <div className="cap-name">{c.name}</div>
                </div>
                <span className="cap-value">{c.cap}</span>
                <span className={`cap-change ${pos ? "up" : "down"}`}>
                  {pos ? "+" : ""}{c.change.toFixed(1)} %
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

const STORAGE_KEY = (user) => `pea_portfolio_${user}`;

const DEFAULT_PORTFOLIOS = {
  nolan: [
    { id: 1, ticker: "AAPL",  name: "Apple Inc.",            sector: "Technologie",   qty: 10, pru: 165.00, price: 189.30 },
    { id: 2, ticker: "NVDA",  name: "NVIDIA Corp.",           sector: "Semi-conducteurs", qty: 5, pru: 620.00, price: 875.40 },
    { id: 3, ticker: "CW8",   name: "Amundi MSCI World ETF",  sector: "ETF Monde",     qty: 20, pru: 395.00, price: 424.10 },
    { id: 4, ticker: "MC",    name: "LVMH",                   sector: "Luxe",          qty: 3,  pru: 700.00, price: 642.00 },
  ],
  armel: [
    { id: 1, ticker: "MSFT",  name: "Microsoft Corp.",        sector: "Technologie",   qty: 8,  pru: 380.00, price: 415.20 },
    { id: 2, ticker: "TTE",   name: "TotalEnergies",          sector: "Énergie",       qty: 30, pru: 58.00,  price: 62.40  },
    { id: 3, ticker: "AIR",   name: "Airbus SE",              sector: "Aéronautique",  qty: 15, pru: 140.00, price: 168.20 },
  ],
};

export default function App() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [tab, setTab] = useState("suivi");
  const [portfolio, setPortfolio] = useState([]);

  // Load portfolio from storage on login
  const handleLogin = (id, name) => {
    setUser(id);
    setUserName(name);
    try {
      const stored = localStorage.getItem(STORAGE_KEY(id));
      setPortfolio(stored ? JSON.parse(stored) : DEFAULT_PORTFOLIOS[id] || []);
    } catch {
      setPortfolio(DEFAULT_PORTFOLIOS[id] || []);
    }
  };

  // Save portfolio to storage on change
  useEffect(() => {
    if (user) {
      try { localStorage.setItem(STORAGE_KEY(user), JSON.stringify(portfolio)); } catch {}
    }
  }, [portfolio, user]);

  const handleLogout = () => { setUser(null); setUserName(""); setPortfolio([]); setTab("suivi"); };

  if (!user) return (
    <>
      <style>{css}</style>
      <LoginPage onLogin={handleLogin} />
    </>
  );

  const TABS = [
    { id: "suivi",  label: "Suivi",   icon: BarChart2 },
    { id: "marche", label: "Marché",  icon: TrendingUp },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-logo">PEA<span>Track</span></div>
          <nav className="sidebar-nav">
            {TABS.map(t => (
              <button key={t.id} className={`nav-item ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
                <t.icon size={16} />
                {t.label}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="user-badge">
              <div className="user-avatar">{userName[0]?.toUpperCase()}</div>
              <span className="user-name">{userName}</span>
              <button className="logout-btn" onClick={handleLogout} title="Déconnexion"><LogOut size={14} /></button>
            </div>
          </div>
        </aside>
        <main className="main">
          {tab === "suivi"  && <SuiviTab  portfolio={portfolio} setPortfolio={setPortfolio} />}
          {tab === "marche" && <MarcheTab portfolio={portfolio} />}
        </main>
      </div>
    </>
  );
}
