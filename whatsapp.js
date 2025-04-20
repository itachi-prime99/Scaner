const { default: makeWASocket, useSingleFileAuthState } = require("@whiskeysockets/baileys");
const fs = require("fs");
const path = require("path");

const tempAuthFile = path.join(__dirname, "sessions", "notify-session.json");
if (!fs.existsSync("sessions")) fs.mkdirSync("sessions");
if (!fs.existsSync(tempAuthFile)) fs.writeFileSync(tempAuthFile, JSON.stringify({}));

const { state, saveState } = useSingleFileAuthState(tempAuthFile);
const sock = makeWASocket({ auth: state });

sock.ev.on("creds.update", saveState);

async function sendWhatsAppMessage(phoneNumber, message) {
  try {
    await sock.sendMessage(`${phoneNumber}@s.whatsapp.net`, { text: message });
    console.log("✅ WhatsApp message sent to", phoneNumber);
  } catch (err) {
    console.error("❌ Failed to send WhatsApp message:", err);
  }
}

module.exports = { sendWhatsAppMessage };
