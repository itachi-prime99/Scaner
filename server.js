const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { startBot } = require("./startBot");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("scanner"));

const sessions = {}; // { sessionId: { phone, pairCode, connected: false } }

app.post("/generate", async (req, res) => {
  const { phone } = req.body;

  if (!phone || !phone.startsWith("+")) {
    return res.status(400).json({ error: "Invalid phone number" });
  }

  const pairCode = Math.random().toString(36).substr(2, 6).toUpperCase();
  const sessionId = uuidv4();

  sessions[sessionId] = { phone, pairCode, connected: false };

  // Send WhatsApp notification via Baileys
  const { sendWhatsAppMessage } = require("./whatsapp");
  await sendWhatsAppMessage(phone, `🔐 Your pair code is: *${pairCode}*\nPlease scan it now.`);

  // Create empty session file for now
  const sessionFile = path.join(__dirname, "sessions", `${sessionId}.json`);
  fs.writeFileSync(sessionFile, JSON.stringify({}));

  res.json({ pairCode, sessionId });
});

app.get("/status/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const session = sessions[sessionId];

  if (!session) return res.status(404).json({ error: "Session not found" });

  res.json({ connected: session.connected });
});

app.post("/pair-complete", async (req, res) => {
  const { sessionId } = req.body;
  const session = sessions[sessionId];
  if (!session) return res.status(404).json({ error: "Invalid session ID" });

  session.connected = true;

  // Notify user on WhatsApp
  const { sendWhatsAppMessage } = require("./whatsapp");
  await sendWhatsAppMessage(session.phone, `✅ Device paired!\nYour session ID is: *${sessionId}*`);

  // Start bot for this session
  startBot(sessionId);

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});