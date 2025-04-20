const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const qrcode = require('qrcode-terminal'); // QR code terminal fix

let sock;

async function initBaileys() {
  const { state, saveCreds } = await useMultiFileAuthState('auth');
  sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // prevent auto print
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      qrcode.generate(qr, { small: true }); // This line will print QR in terminal
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('connection closed. Reconnecting:', shouldReconnect);
      if (shouldReconnect) initBaileys();
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
