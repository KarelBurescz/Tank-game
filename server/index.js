import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import { ServerGame } from "./serverGame.js";
import { Player } from "./player.js";

const serverGame = new ServerGame();
const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });
  if (!serverGame.hasPlayer(socket.id)) {
    let p = new Player(socket);
    serverGame.players.push(p);
  }
  console.log(serverGame);

  socket.on("disconnect", () => {
    serverGame.removePlayer(socket.id);
  });
});

server.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});
