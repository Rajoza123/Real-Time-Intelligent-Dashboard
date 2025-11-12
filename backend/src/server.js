import express from "express";
import cors from "cors";
import { PORT, GEN_DEFAULTS } from "./config.js";
import health from "./routes/health.js";
import events from "./routes/events.js";
import { startGenerator, setGeneratorOptions } from "./services/eventGenerator.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", health);
app.use("/api", events);


app.get("/", (req, res) => {
  res.json({ msg: "Backend is running" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  setGeneratorOptions(GEN_DEFAULTS);
  startGenerator();
});
