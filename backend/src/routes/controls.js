import { Router } from "express";
import {
  startGenerator,
  stopGenerator,
  getGeneratorOptions,
  setGeneratorOptions
} from "../services/eventGenerator.js";
import { clearAll } from "../services/eventStore.js";

const router = Router();

router.post("/controls/start", (req, res) => {
  startGenerator();
  res.json({ ok: true });
});

router.post("/controls/stop", (req, res) => {
  stopGenerator();
  res.json({ ok: true });
});

router.post("/controls/options", (req, res) => {
  setGeneratorOptions(req.body);
  res.json({ ok: true, generator: getGeneratorOptions() });
});

router.post("/controls/reset", (req, res) => {
  clearAll();
  res.json({ ok: true });
});

export default router;
