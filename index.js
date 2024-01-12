import express from "express";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { Server } from "socket.io";
import { ServerGame } from "./server/serverGame.js";

const serverGame = new ServerGame();
const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(__dirname + "/client"));
// app.get("/", (req, res) => {
//   res.sendFile(join(__dirname, "client/index.html"));
// });

io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  serverGame.acceptOrUpdateConnection(socket);

  socket.on("join-room", (msg) => {
    console.log(`Joining room: ${msg}`);
    socket.join(msg);

    let r = serverGame.getOrCreateRoomById(msg);
    let p = serverGame.getOrCreatePlayer(socket);

    r.playerJoinRoom(p);
    console.log(getInfo());
  });

  socket.on("leave-room", (msg) => {
    socket.leave(msg);
    let r = serverGame.getOrCreateRoomById(msg);
    r.removePlayer(socket);
    console.log(getInfo());
  });

  socket.on("disconnect", () => {
    serverGame.removePlayer(socket);
    console.log(getInfo());
  });

  socket.on("update-controller", (msg) => {
    //serverGame.updateController(socket,msg);
    console.log(`Updating controller for ${socket.id} to: ${msg}`);
  })

  console.log(getInfo());
});

function getInfo() {
  let str = `Game has : ${serverGame.players.length} players: `;
  serverGame.players.forEach((p) => (str += `${p.socket.id},`));
  str += "\n  Rooms:";
  serverGame.rooms.forEach((r) => {
    str += `  ${r.id} (${r.players.length} players)\n`;
    str += r.roomRuntime.getInfo();
    return str;
  });

  return str;
}

server.listen(3001, () => {
  console.log("server running at http://localhost:3001");
});
