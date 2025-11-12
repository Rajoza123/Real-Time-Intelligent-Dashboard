import { Router } from "express";
import { startGenerator, stopGenerator, isRunning } from "../services/eventGenerator.js";
import { clearAll } from "../services/eventStore.js";

const router = Router();

// Start generator
router.post("/controls/start", (_req, res) => {
  startGenerator();
  res.json({ ok: true, running: isRunning() });
});

// Stop generator
router.post("/controls/stop", (_req, res) => {
  stopGenerator();
  res.json({ ok: true, running: isRunning() });
});

// Reset dashboard (clear all events)
router.post("/controls/reset", (_req, res) => {
  clearAll();
  res.json({ ok: true, message: "All events cleared." });
});

export default router;
