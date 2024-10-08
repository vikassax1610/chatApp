const http = require("http");
const express = require("express");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.resolve("./public")));

// socket.io connection
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // Listen for user messages
  socket.on("user-message", (message) => {
    // Broadcast message with the sender's socket id
    io.emit("msg", { id: socket.id, message });
  });

  // Optionally, notify when a user disconnects
  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);
    io.emit("msg", { id: "server", message: "A user has disconnected" });
  });
});

// Serve index.html on root URL
app.get("/", (req, res) => {
  return res.sendFile("/public/index.html");
});

// Start the server
server.listen(9000, () => console.log("hello from server"));
