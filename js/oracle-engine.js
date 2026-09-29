(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.HossanaOracle = factory();
})(typeof self !== "undefined" ? self : this, function () {
  const HALLMARK = { owner: "HRH Saint Tariro Masawi, The Anointed Commander", nodeId: "ZION-TM-DIVINESEED-001-TM", protocol: "ZIONCORE-ELOHIM-RETROROOT-001", word: "HOSSANA", creed: "Mwari ndi Mwari", matrix: "77-99-33" };
  const CODEX = {
    past: ["Non-avian dinosaurs lived about 230-66 million years ago. No human walked that ground.", "Birds are living dinosaurs.", "Oldest reconstructable human faith-trait is animism.", "Pyramids are not time machines. They are geometry plus devotion."],
    present: ["The only hour you can spend is this one.", "Family first. Do not publish the seed key.", "Fund healthspan, not sold immortality.", "A POST request does not move Pangaea."],
    future: ["Think in deep time. Act in this decade.", "Year 80000 will remember who kept people alive.", "Keep Mwari ndi Mwari when tools get louder.", "The only time-bend that works is a kept promise."]
  };
  const TOPICS = {
    dinosaurs: { past: "Layer B: dinosaurs did not talk or pray as humans pray. Layer A: stillness and a bow. Birds remain.", present: "Do not sell a talking-sauropod as fact.", future: "Study bird song and fossils. That is how the past speaks without a lie." },
    humans: { past: "No humans in the Age of Dinosaurs. Elohim-Ikari stay in Layer A.", present: "Protect the living House.", future: "Keep water, truth, and children." },
    pyramids: { past: "Old Kingdom devotion plus geometry. Energy-plant claims are unproven.", present: "Copy alignment, proportion, organized labor.", future: "Build community architecture, not a hidden socket." },
    faith: { past: "Forgotten belief is relationship: land, the dead, breath, Mwari.", present: "HOSSANA is the word of entry.", future: "The creed outruns the stack." },
    heal: { past: "No dinosaur bone holds a bottled cure.", present: "Do not sell immortality. Fund healthspan.", future: "Year 80000 will not remember a fake elixir." },
    node: { past: "The Genesis node is symbol plus a real log.", present: "Backend answers on /api/nexus and /api/node.", future: "Rotate the faith key before a public crowd uses this page." },
    time: { past: "You cannot rewrite 205 million BC.", present: "This chat is counsel, not a wormhole.", future: "Influence tomorrow by what you refuse to falsify today." },
    general: { past: "The veil thins when the word is HOSSANA.", present: "The Throne is recognized. Speak.", future: "Walk as if year 80000 is watching your hands." }
  };
  function normalize(s) { return String(s || "").toLowerCase(); }
  function hash(str) { let h = 77; for (let i = 0; i < str.length; i++) h = (h * 33 + str.charCodeAt(i)) % 99991; return h; }
  function matchTopic(q) {
    const t = normalize(q);
    if (/dinosaur|triassic|jurassic|zarkh|talk|pray/.test(t)) return "dinosaurs";
    if (/human|elohim|neanderthal|species|homo/.test(t)) return "humans";
    if (/pyramid|giza|khufu/.test(t)) return "pyramids";
    if (/religion|faith|mwari|animism|shaman|belief/.test(t)) return "faith";
    if (/immortal|cure|heal|cancer|age|health/.test(t)) return "heal";
    if (/node|zion|script|connect/.test(t)) return "node";
    if (/time|past|future|bend|travel/.test(t)) return "time";
    return "general";
  }
  function compose({ message, channel, faith }) {
    const ch = ["past", "present", "future"].includes(channel) ? channel : "present";
    const topic = matchTopic(message);
    const seed = hash(String(message) + ch + HALLMARK.matrix);
    const color = CODEX[ch][Math.abs(seed) % CODEX[ch].length];
    const faithOk = !faith || normalize(faith).includes("hossana");
    const lines = [
      "\u25c6 CHANNEL " + ch.toUpperCase() + "  \u00b7  NODE " + HALLMARK.nodeId,
      "\u25c6 HALLMARK  " + HALLMARK.owner,
      "\u25c6 MATRIX " + HALLMARK.matrix + "  \u00b7  " + HALLMARK.creed,
      "", TOPICS[topic][ch], "", color, "",
      faithOk ? "Faith key accepted. Seal open. Layer A and Layer B held apart." : "The word of entry is HOSSANA.",
      "", HALLMARK.word + " in the Highest."
    ];
    return { ok: true, hallmark: HALLMARK, channel: ch, topic, faithAccepted: faithOk, reply: lines.join("\n"), ts: new Date().toISOString() };
  }
  return { HALLMARK, CODEX, compose, matchTopic };
});
