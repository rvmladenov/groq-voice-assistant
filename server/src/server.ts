const express = require("express");
const http = require("http");

const app = express();
const server = http.createServer(app);

app.get("/transcript", (req, res) => {
  res.send("Transcript2");
});

server.listen(9000, () => {
  console.log("Socket.IO server running on http://localhost:9000");
});
