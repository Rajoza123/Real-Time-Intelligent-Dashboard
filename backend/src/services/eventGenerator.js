import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { GEN_DEFAULTS } from "../config.js";
import { pushEvent } from "./eventStore.js";

let timer = null;
let state = { ...GEN_DEFAULTS };

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randConf = () => Number((0.4 + Math.random() * 0.6).toFixed(2));

const emitOne = () => {
  const burst = Math.random() < state.burstChance;
  const camera = rand(state.cameras);
  const label = rand(state.labels);

  const evt = {
    id: uuid(),
    cameraId: camera,
    label,
    confidence: randConf(),
    timestamp: dayjs().toISOString()
  };

  pushEvent(evt);

  if (burst) {
    const extra = 1 + Math.floor(Math.random() * 3);
    for (let i = 0; i < extra; i++) {
      pushEvent({
        ...evt,
        id: uuid(),
        timestamp: dayjs().toISOString()
      });
    }
  }
};

export const startGenerator = () => {
  if (timer) {
    console.log("Generator already running — ignoring start request");
    return;
  }
  timer = setInterval(emitOne, state.intervalMs);
  console.log("Generator started");
};

export const stopGenerator = () => {
  clearInterval(timer);
  timer = null;
};

export const isRunning = () => Boolean(timer);

export const setGeneratorOptions = (opts = {}) => {
  state = { ...state, ...opts };
  if (timer && opts.intervalMs) {
    stopGenerator();
    startGenerator();
  }
};

export const getGeneratorOptions = () => ({ ...state, running: isRunning() });
