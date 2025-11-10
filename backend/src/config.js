export const PORT = process.env.PORT || 4000;

export const GEN_DEFAULTS = {
  enabled: true,
  intervalMs: 700,
  burstChance: 0.15,
  cameras: ["CAM-01","CAM-02","CAM-03","CAM-04","CAM-05"],
  labels: ["Person","Vehicle","Intrusion","Fire","Smoke","Loitering","Crowd"]
};

export const RANKING = {
  baseLabelWeight: {
    Fire: 1.0,
    Smoke: 0.9,
    Intrusion: 0.85,
    Crowd: 0.7,
    Loitering: 0.6,
    Vehicle: 0.55,
    Person: 0.5
  },
  severityCutoffs: { critical: 1.0, moderate: 0.6 },
  windowForFrequencyMin: 2,
  frequencyWeight: 0.35,
  confidenceWeight: 0.4
};

export const ABNORMAL = {
  windowMin: 2,
  thresholdCount: 10
};

export const RETENTION_MINUTES = 30;
