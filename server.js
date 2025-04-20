const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "scanner")));

const sessions = {}; // store phone => {pairCode, sessionId}

function generateCode(length = 6) {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}

app.post("/generate", (req, res) => {
  const { phone } = req.body;

  if (!phone) return res.status(400).json({ error: "Phone number required" });

  const pairCode = generateCode(6);
  const sessionId = generateCode(12);

  sessions[phone] = { pairCode, sessionId };

  res.json({ pairCode, sessionId });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
