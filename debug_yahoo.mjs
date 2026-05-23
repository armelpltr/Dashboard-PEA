const e = 91.48; // regularMarketPrice actuel TTE

for (const ticker of ['TTE', 'TTE.PA']) {
  console.log(`\n====== ${ticker} ======`);
  const periods = [
    { label: '1J',  url: `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=5m&range=1d` },
    { label: '1M',  url: `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1mo` },
    { label: '1A',  url: `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1d&range=1y` },
    { label: 'ALL', url: `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?interval=1mo&period1=946886400&period2=${Math.floor(Date.now()/1000)}` },
  ];
  for (const p of periods) {
    try {
      const d = await fetch(p.url).then(r => r.json());
      const res = d.chart?.result?.[0];
      if (!res) { console.log(p.label, 'NO DATA'); continue; }
      const m = res.meta;
      const q = res.indicators.quote[0];
      const pts = q.close.filter(Boolean);
      const price = m.regularMarketPrice;
      console.log(`[${p.label}] price=${price} cpc=${m.chartPreviousClose} %cpc=${((price/m.chartPreviousClose-1)*100).toFixed(4)}% | close0=${pts[0]?.toFixed(4)} %close0=${((price/pts[0]-1)*100).toFixed(4)}%`);
    } catch(err) { console.log(p.label, 'ERR', err.message); }
  }
}
