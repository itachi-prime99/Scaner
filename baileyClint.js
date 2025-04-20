const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

let sock;

const initBaileys = async () => {
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveCreds);
};

const sendMessageToWhatsApp = async (number, sessionId) => {
  if (!sock) {
    console.error("Baileys socket not initialized.");
    return;
  }

  const jid = `${number}@s.whatsapp.net`;
  const message = `✅ Your WhatsApp session has been linked successfully.\nSession ID: ${sessionId}`;

  try {
    await sock.sendMessage(jid, { text: message });
    console.log(`Session ID sent to ${number}`);
  } catch (err) {
    console.error("Failed to send session ID:", err);
  }
};

module.exports = { initBaileys, sendMessageToWhatsApp };