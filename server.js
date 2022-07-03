const { rejects } = require("assert");
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const server = http.createServer(app);
const { Server } = require("socket.io");
const collectionfun = require("./database/database");
const port = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, resp) => {
  resp.sendFile(path.join(__dirname, "build/index.html"));
});

const io = new Server(server);

let collection;
let codeSync;
let clientsSync;
(async () => {
  collection = await collectionfun();
  codeSync = collection[0];
  clientsSync = collection[1];
})();

const getConnectedClient = async (socketId) => {
  let client = await clientsSync.findOne({ socketId });
  let userName = await client?.username;
  let user = {
    socketId,
    userName,
  };

  return user;
};

const getAllConnectedClient = async (roomId) => {
  const sockets = io.sockets.adapter.rooms.get(roomId);

  let clients = [];

  for (i of sockets) {
    let user = await getConnectedClient(i);
    clients.push(user);
  }

  return clients;
};

io.on("connection", (socket) => {
  socket.on("join", async ({ user }) => {
    socket.join(user.roomId);
    
    await clientsSync.insertMany([
      { socketId: socket.id, username: user.userName },
    ]);
    const userConnected = await getAllConnectedClient(user.roomId);
    io.to(user.roomId).emit("joined", { user, userConnected });
    const roomIddata = await codeSync.findOne({ roomId: user.roomId });
    let code;
    if (roomIddata) {
      code = roomIddata.code;
    } else {
      await codeSync.insertMany([{ roomId: user.roomId, code: "" }]);
    }
 
    socket.emit("syncCode", { code });
  });

  socket.on("disconnecting", async () => {
    const sockets = [...socket.rooms];

    const user = await getConnectedClient(socket.id);
    await clientsSync.deleteOne({ socketId: socket.id });
    io.to(sockets[1]).emit("disconnected", { user });
    socket.leave();
  });

  socket.on("codeChange", async ({ code, roomId }) => {
    codeSync.updateOne({ roomId }, { $set: { code } }, (err, data) => {
      if (err) throw err;
    });
    socket.in(roomId).emit("codeChange", { code });
  });
  socket.on("leave", async () => {
    const sockets = [...socket.rooms];
    const user = await getConnectedClient(socket.id);
    await clientsSync.deleteOne({ socketId: socket.id });
    io.to(sockets[1]).emit("disconnected", { user });

    socket.leave();
  });
  socket.on("delete", async () => {
    const sockets = [...socket.rooms];
    const user =await getConnectedClient(socket.id);
    const userConnected =await getAllConnectedClient(sockets[1]);

    for (let user of userConnected) {
      await clientsSync.deleteOne({ socketId: user.socketId });
      
    }
 
    const roomId = sockets[1];
    await codeSync.deleteOne({ roomId });

    io.to(sockets[1]).emit("delete", { user });

    socket.leave();
  });
});

server.listen(port, () => {
  console.log(`Server is listing on post ${port}`);
});
