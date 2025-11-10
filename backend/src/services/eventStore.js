import { RETENTION_MINUTES } from "../config.js";
import { pruneOlderThanMinutes } from "../utils/time.js";

let EVENTS = [];

export const pushEvent = (evt) => {
  EVENTS.push(evt);

  if (EVENTS.length % 100 === 0) {
    EVENTS = pruneOlderThanMinutes(EVENTS, RETENTION_MINUTES);
  }
};

export const allEvents = () => EVENTS;

export const recentEvents = (minutes) =>
  pruneOlderThanMinutes(EVENTS, minutes);

export const clearAll = () => (EVENTS = []);
