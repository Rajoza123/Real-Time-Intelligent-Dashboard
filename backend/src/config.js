export const PORT = process.env.PORT || 4000;

export const GEN_DEFAULTS = {
  enabled: true,
  intervalMs: 3000,
  burstChance: 0.15,
  cameras: ["CAM-01","CAM-02","CAM-03","CAM-04","CAM-05"],
  labels: ["Person","Vehicle","Intrusion","Fire","Smoke","Loitering","Crowd"]
};

export const RANKING = {
  baseLabelWeight: {
    Fire: 0.9,
    Smoke: 0.8,
    Intrusion: 0.75,
    Crowd: 0.6,
    Loitering: 0.55,
    Vehicle: 0.5,
    Person: 0.45,
    FaceMask: 0.4
  },
  severityCutoffs: { critical: 1.35, moderate: 0.85 },
  windowForFrequencyMin: 2,
  frequencyWeight: 0.25,
  confidenceWeight: 0.3
};

export const ABNORMAL = {
  windowMin: 2,
  thresholdCount: 10
};

export const RETENTION_MINUTES = 30;
