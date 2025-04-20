const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the "scanner" folder
app.use(express.static(path.join(__dirname, "scanner")));

// Default route - serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "scanner", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Scanner running at http://localhost:${PORT}`);
});
