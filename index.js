/**
 * @fileoverview
 * The entry file for the server part of the game.
 * <p>
 * The data model of the game starts with {@link ServerGame} object.
 * This class holds all the data structures of the game.
 * </p>
 * <p>
 * The game allows to create a several players represented by {@link Player}.
 * Each player connects with a roomName which is a string identifier.
 * A room {@link Room} is created for each new roomName and the player is added.
 * </p>
 *
 * <pre>
 *   ServerGame (1) --> (0..*) Room
 *   Room (1) --> (0..*) Player
 *   Room (1) --> (0..1) RoomRuntime
 * </pre>
 *
 * @mermaid
 * graph TD;
 *    ServerGame --> Room
 *    Room --> Player
 *    Room --> RoomRuntime
 *
 */
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
app.use("/model", express.static(__dirname + "/model"));
app.use("/docs", express.static(__dirname + "/docs"));

// app.get("/docs", (req, res) => {
//   res.sendFile(join(__dirname, "docs/index.html"));
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
    serverGame.updateController(socket, msg);
  });

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

const port = process.env.PORT || 3001;

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
