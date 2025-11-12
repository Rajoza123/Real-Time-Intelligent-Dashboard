import { Router } from "express";
import { startGenerator, stopGenerator, isRunning } from "../services/eventGenerator.js";

const router = Router();

// Start the event generator
router.post("/controls/start", (_req, res) => {
  startGenerator();
  res.json({ ok: true, running: isRunning() });
});

// Stop the event generator
router.post("/controls/stop", (_req, res) => {
  stopGenerator();
  res.json({ ok: true, running: isRunning() });
});

export default router;
