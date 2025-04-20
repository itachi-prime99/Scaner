const express = require('express');
const path = require('path');
const { initBaileys, sendMessageToWhatsApp } = require('./baileysClient');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Baileys
initBaileys();

// Handle number submission and pairing
app.post('/generate', async (req, res) => {
  const { number } = req.body;
  if (!number) {
    return res.status(400).json({ success: false, message: 'Number is required.' });
  }

  // Fake pair code and session ID
  const pairCode = Math.random().toString(36).substr(2, 6).toUpperCase();
  const sessionId = 'SID-' + Math.random().toString(36).substr(2, 10).toUpperCase();

  try {
    await sendMessageToWhatsApp(number, sessionId);
    res.json({
      success: true,
      pairCode,
      sessionId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send session ID via WhatsApp.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});