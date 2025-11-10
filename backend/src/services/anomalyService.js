import { ABNORMAL } from "../config.js";
import { recentEvents } from "./eventStore.js";

export const abnormalCameras = () => {
  const events = recentEvents(ABNORMAL.windowMin);
  const map = new Map();

  for (const e of events)
    map.set(e.cameraId, (map.get(e.cameraId) || 0) + 1);

  const result = [];
  for (const [cam, count] of map.entries()) {
    if (count >= ABNORMAL.thresholdCount)
      result.push({ cameraId: cam, count });
  }

  return result.sort((a, b) => b.count - a.count);
};
