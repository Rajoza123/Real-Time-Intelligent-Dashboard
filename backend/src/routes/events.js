import { Router } from "express";
import { rankedAlerts } from "../services/rankingService.js";
import { allEvents } from "../services/eventStore.js";
import { abnormalCameras } from "../services/anomalyService.js";
import dayjs from "dayjs";

const router = Router();

router.get("/events", (req, res) => {
  const { since, limit } = req.query;
  let events = allEvents();

  if (since) {
    const t = dayjs(since);
    events = events.filter(e => dayjs(e.timestamp).isAfter(t));
  }

  res.json({
    count: events.length,
    events: events.slice(-(limit || 200))
  });
});

router.get("/alerts", (req, res) => {
  const data = rankedAlerts(req.query);
  res.json({ count: data.length, alerts: data });
});

router.get("/abnormal", (req, res) => {
  const data = abnormalCameras();
  res.json({ count: data.length, results: data });
});

export default router;
