import { RANKING } from "../config.js";
import { recentEvents, allEvents } from "./eventStore.js";

const frequencyMap = () => {
  const map = new Map();
  const recent = recentEvents(RANKING.windowForFrequencyMin);

  for (const e of recent)
    map.set(e.cameraId, (map.get(e.cameraId) || 0) + 1);

  return map;
};

const labelWeight = (label) =>
  RANKING.baseLabelWeight[label] || 0.5;

const scoreEvent = (evt, freq) => {
  const lw = labelWeight(evt.label);
  const confidence = evt.confidence;

  const freqBoost = Math.min(1, freq / 12);

  const score =
    lw +
    RANKING.confidenceWeight * confidence +
    RANKING.frequencyWeight * freqBoost;

  let severity = "Low";
  if (score >= RANKING.severityCutoffs.critical) severity = "Critical";
  else if (score >= RANKING.severityCutoffs.moderate) severity = "Moderate";

  return { score: Number(score.toFixed(3)), severity };
};

export const rankedAlerts = (filters = {}) => {
  const freq = frequencyMap();

  let rows = allEvents().map(evt => {
    const f = freq.get(evt.cameraId) || 0;
    const r = scoreEvent(evt, f);
    return { event: evt, score: r.score, severity: r.severity, freqInWindow: f };
  });

  if (filters.cameraId)
    rows = rows.filter(r => r.event.cameraId === filters.cameraId);

  if (filters.label)
    rows = rows.filter(r => r.event.label === filters.label);

  if (filters.severity)
    rows = rows.filter(r => r.severity === filters.severity);

  rows.sort((a, b) => b.score - a.score);

  if (filters.limit)
    rows = rows.slice(0, Number(filters.limit));

  return rows;
};
