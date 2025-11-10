import { Router } from "express";
import { getGeneratorOptions, isRunning } from "../services/eventGenerator.js";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    ok: true,
    generator: getGeneratorOptions(),
    running: isRunning()
  });
});

export default router;
