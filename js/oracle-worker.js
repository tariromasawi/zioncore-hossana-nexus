importScripts("./oracle-engine.js");
self.onmessage = (e) => {
  const { id, message, channel, faith } = e.data || {};
  const result = self.HossanaOracle.compose({ message, channel, faith });
  self.postMessage({ id, result, worker: true });
};
