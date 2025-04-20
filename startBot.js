const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");

function startBot(sessionId) {
  const sessionFile = path.join(__dirname, "sessions", `${sessionId}.json`);

  if (!fs.existsSync(sessionFile)) {
    console.error("❌ Session file not found for ID:", sessionId);
    return;
  }

  const { state, saveState } = useSingleFileAuthState(sessionFile);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on("creds.update", saveState);

  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const from = msg.key.remoteJid;
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text;

    if (text === "ping") {
      await sock.sendMessage(from, { text: "pong" });
    }
  });

  console.log("✅ Bot started for session:", sessionId);
}

module.exports = { startBot };
