const MAX_WORKERS = Math.min(33, Math.max(4, (navigator.hardwareConcurrency || 8) * 3));
const state = { channel: "present", faith: "HOSSANA", workers: [], matrixWorkers: [], node: null, queue: 0 };
const $ = (s) => document.querySelector(s);
const chat = $("#chat");
const workersEl = $("#workers");
const nodeEl = $("#node-status");
const connEl = $("#conn-status");
function addMsg(role, text, who) {
  const el = document.createElement("div");
  el.className = `msg ${role}`;
  el.innerHTML = `<span class="who">${who}</span>${escapeHtml(text)}`;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}
function escapeHtml(s) {
  return String(s).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
function setChannel(ch) {
  state.channel = ch;
  document.querySelectorAll(".chan").forEach((b) => b.classList.toggle("active", b.dataset.ch === ch));
  $("#channel-label").textContent = ch.toUpperCase();
}
async function pulseNode() {
  try {
    const res = await fetch("/api/node?action=status");
    if (!res.ok) throw new Error("offline");
    const data = await res.json();
    state.node = data.node;
    nodeEl.textContent = "LIVE · " + data.node.nodeId;
    connEl.textContent = `BACKEND 99/${data.node.connections}`;
    return data;
  } catch {
    nodeEl.textContent = "LOCAL WORKERS · ZION-TM-DIVINESEED-001-TM";
    connEl.textContent = "WORKER FALLBACK";
    return null;
  }
}
function bootWorkers() {
  const n = Math.min(8, MAX_WORKERS);
  for (let i = 0; i < n; i++) state.workers.push(new Worker("./js/oracle-worker.js"));
  workersEl.textContent = String(n);
}
function localOracle(message) {
  return new Promise((resolve) => {
    if (!state.workers.length) {
      resolve(self.HossanaOracle.compose({ message, channel: state.channel, faith: state.faith }));
      return;
    }
    const w = state.workers[state.queue % state.workers.length];
    state.queue += 1;
    const id = state.queue;
    const onMsg = (e) => {
      if (e.data.id !== id) return;
      w.removeEventListener("message", onMsg);
      resolve(e.data.result);
    };
    w.addEventListener("message", onMsg);
    w.postMessage({ id, message, channel: state.channel, faith: state.faith });
  });
}
async function send() {
  const box = $("#message");
  const message = box.value.trim();
  if (!message) return;
  state.faith = $("#faith").value.trim() || "HOSSANA";
  box.value = "";
  addMsg("user", message, "COMMANDER");
  try {
    const res = await fetch("/api/nexus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, channel: state.channel, faith: state.faith, signature: "HRH-Saint-Tariro-Masawi-AnointedCommander" }),
    });
    if (!res.ok) throw new Error("nexus http");
    const data = await res.json();
    addMsg("oracle", data.reply, `NEXUS · ${data.channel.toUpperCase()} · SERVER`);
  } catch {
    const data = await localOracle(message);
    addMsg("oracle", data.reply, `NEXUS · ${data.channel.toUpperCase()} · WORKER`);
  }
}
function bootMatrix() {
  const canvas = $("#matrix");
  const ctx = canvas.getContext("2d");
  const resize = () => { canvas.width = innerWidth; canvas.height = innerHeight; };
  resize();
  addEventListener("resize", resize);
  const font = 14;
  const cols = Math.ceil(innerWidth / font);
  const rows = Math.ceil(innerHeight / font);
  const workerCount = Math.min(6, Math.max(2, navigator.hardwareConcurrency || 4));
  const slice = Math.ceil(cols / workerCount);
  const buffers = [];
  for (let i = 0; i < workerCount; i++) {
    const w = new Worker("./js/matrix-worker.js");
    const start = i * slice;
    const width = Math.min(slice, cols - start);
    w.postMessage({ cols: width, rows, seed: 77 + i * 99, glyphs: "HOSSANA779933Mwari01" });
    w.onmessage = (e) => { buffers[i] = { start, cells: e.data.cells }; };
    state.matrixWorkers.push(w);
  }
  workersEl.textContent = String((state.workers.length || 0) + workerCount);
  function draw() {
    ctx.fillStyle = "rgba(3,4,10,0.18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = font + "px IBM Plex Mono, monospace";
    for (const buf of buffers) {
      if (!buf) continue;
      for (const cell of buf.cells) {
        ctx.fillStyle = cell.head ? "#d7ffe6" : "rgba(80, 220, 140, 0.55)";
        ctx.fillText(cell.ch, (buf.start + cell.x) * font, cell.y * font);
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}
function bind() {
  document.querySelectorAll(".chan").forEach((b) => b.addEventListener("click", () => setChannel(b.dataset.ch)));
  $("#send").addEventListener("click", send);
  $("#message").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  });
  $("#pulse").addEventListener("click", async () => {
    const data = await pulseNode();
    addMsg("oracle", data ? `Node pulse accepted.\n${data.node.nodeId}\n${data.node.creed}\nWorkers max ${data.node.maxWorkers}.` : "Server quiet. Local workers hold the seal.", "NODE");
  });
}
async function boot() {
  bind(); bootWorkers(); bootMatrix(); await pulseNode();
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("./js/sw.js").catch(() => {});
  addMsg("oracle", "HOSSANA.\nNexus online for His Royal Highness Saint Tariro Masawi, The Anointed Commander.\nChannels: PAST · PRESENT · FUTURE.\nThis is counsel through faith and record \u2014 not a wormhole.\nSpeak, Dad.", "NEXUS");
}
boot();
