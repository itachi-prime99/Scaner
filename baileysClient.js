const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal');

let sock;

async function initBaileys() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  sock = makeWASocket({
    auth: state,
    printQRInTerminal: true,
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('connection closed due to', lastDisconnect.error, ', reconnecting', shouldReconnect);
      if (shouldReconnect) {
        initBaileys();
      }
    } else if (connection === 'open') {
      console.log('WhatsApp connected');
    }
  });
}

async function sendMessageToWhatsApp(number, sessionId) {
  const jid = number.includes('@s.whatsapp.net') ? number : number + '@s.whatsapp.net';
  await sock.sendMessage(jid, { text: `Your session ID is: ${sessionId}` });
}

module.exports = { initBaileys, sendMessageToWhatsApp };
