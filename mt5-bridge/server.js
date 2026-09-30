import express from "express";
import cors from "cors";
import crypto from "node:crypto";

const app = express();
app.use(cors({ origin: process.env.WEBSITE_ORIGIN || "*" }));
app.use(express.json({ limit: "32kb" }));

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.BRIDGE_TOKEN;
let latest = null;

function authorized(req, res, next) {
  const token = req.header("x-bridge-token");
  if (!TOKEN || !token || !crypto.timingSafeEqual(Buffer.from(token), Buffer.from(TOKEN))) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

app.get("/health", (_req, res) => res.json({ ok: true, service: "Smart EA MT5 Bridge" }));
app.post("/api/mt5/status", authorized, (req, res) => {
  const d = req.body || {};
  latest = {
    receivedAt: new Date().toISOString(),
    connected: true,
    accountLogin: String(d.accountLogin || ""),
    server: String(d.server || ""),
    currency: String(d.currency || ""),
    balance: Number(d.balance || 0),
    equity: Number(d.equity || 0),
    profit: Number(d.profit || 0),
    positions: Number(d.positions || 0),
    symbol: String(d.symbol || ""),
    terminalConnected: Boolean(d.terminalConnected)
  };
  res.json({ ok: true });
});
app.get("/api/mt5/status", (_req, res) => {
  if (!latest) return res.json({ connected: false, message: "Waiting for MT5 terminal" });
  const ageMs = Date.now() - Date.parse(latest.receivedAt);
  res.json({ ...latest, connected: ageMs < 30000 });
});
app.listen(PORT, "0.0.0.0", () => console.log("MT5 bridge listening on " + PORT));
