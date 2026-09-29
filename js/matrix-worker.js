self.onmessage = (e) => {
  const { cols, rows, seed, glyphs } = e.data;
  const drops = new Float32Array(cols);
  for (let i = 0; i < cols; i++) drops[i] = (seed + i * 17) % rows;
  const g = glyphs || "HOSSANA779933Mwari01";
  setInterval(() => {
    const cells = [];
    for (let x = 0; x < cols; x++) {
      const y = Math.floor(drops[x]);
      const ch = g[(x * 13 + y * 7 + seed) % g.length];
      cells.push({ x, y, ch, head: true });
      drops[x] += 0.35 + (x % 5) * 0.07;
      if (drops[x] > rows && ((x * seed) % 33) > 24) drops[x] = 0;
    }
    self.postMessage({ cells });
  }, 42);
};
