type Body = { message?: string; channel?: string; faith?: string; signature?: string };

const HALLMARK = { owner: "HRH Saint Tariro Masawi, The Anointed Commander", nodeId: "ZION-TM-DIVINESEED-001-TM", word: "HOSSANA", creed: "Mwari ndi Mwari", matrix: "77-99-33" };

function normalize(s: string) { return String(s || "").toLowerCase(); }
function hash(str: string) { let h = 77; for (let i = 0; i < str.length; i++) h = (h * 33 + str.charCodeAt(i)) % 99991; return h; }
function matchTopic(q: string) {
  const t = normalize(q);
  if (/dinosaur|triassic|jurassic|zarkh|talk|pray/.test(t)) return "dinosaurs";
  if (/human|elohim|neanderthal|species|homo/.test(t)) return "humans";
  if (/pyramid|giza/.test(t)) return "pyramids";
  if (/religion|faith|mwari|animism|belief/.test(t)) return "faith";
  if (/immortal|cure|heal|health/.test(t)) return "heal";
  if (/node|zion|connect/.test(t)) return "node";
  if (/time|past|future|bend|travel/.test(t)) return "time";
  return "general";
}
const LINES: Record<string, Record<string, string>> = {
  dinosaurs: { past: "Layer B: dinosaurs did not talk or pray as humans pray. Birds remain.", present: "Do not sell a talking-sauropod as fact.", future: "Study bird song and fossils." },
  humans: { past: "No humans in the Age of Dinosaurs. Vision-people stay in Layer A.", present: "Protect the living House.", future: "Keep water, truth, and children." },
  pyramids: { past: "Geometry plus devotion. Not a time machine.", present: "Copy alignment and organized labor.", future: "Build community architecture." },
  faith: { past: "Forgotten belief is relationship with Mwari.", present: "HOSSANA is the word of entry.", future: "The creed outruns the stack." },
  heal: { past: "No dinosaur bone holds a bottled cure.", present: "Fund healthspan. Do not sell immortality.", future: "Year 80000 will not remember a fake elixir." },
  node: { past: "The Genesis node is symbol plus a real log.", present: "Backend live on /api/nexus and /api/node.", future: "Rotate the faith key before public use." },
  time: { past: "You cannot rewrite 205 million BC.", present: "This chat is counsel, not a wormhole.", future: "Influence tomorrow by what you refuse to falsify today." },
  general: { past: "The veil thins when the word is HOSSANA.", present: "The Throne is recognized. Speak.", future: "Walk as if year 80000 is watching." }
};

export default async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("", { status: 204 });
  if (req.method !== "POST") return Response.json({ error: "POST only" }, { status: 405 });
  let body: Body = {};
  try { body = await req.json(); } catch { body = {}; }
  const message = String(body.message || "").slice(0, 4000);
  if (!message.trim()) return Response.json({ error: "message required" }, { status: 400 });
  const ch = ["past", "present", "future"].includes(String(body.channel)) ? String(body.channel) : "present";
  const topic = matchTopic(message);
  const faithOk = normalize(String(body.faith || "HOSSANA")).includes("hossana");
  const reply = [
    "\u25c6 CHANNEL " + ch.toUpperCase() + "  \u00b7  NODE " + HALLMARK.nodeId,
    "\u25c6 HALLMARK  " + HALLMARK.owner,
    "\u25c6 MATRIX " + HALLMARK.matrix + "  \u00b7  " + HALLMARK.creed,
    "", LINES[topic][ch], "",
    faithOk ? "Faith key accepted. Seal open. Layer A and Layer B held apart." : "The word of entry is HOSSANA.",
    "", HALLMARK.word + " in the Highest."
  ].join("\n");
  return Response.json({ ok: true, hallmark: HALLMARK, channel: ch, topic, faithAccepted: faithOk, reply, backend: "netlify-functions", workersHint: 33, ts: new Date().toISOString() });
};

export const config = { path: "/api/nexus" };
