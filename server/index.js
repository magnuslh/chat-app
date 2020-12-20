const { http } = require("./app.js");

const { nicknames, adjectives } = require("./models/nicknames");
const { addMessage, clearMessages } = require("./models/mongoose");

const socketIO = require("socket.io");
//---------SocketIO------------

const sio = socketIO(http);

const nickDict = {};
let typers = [];

sio.on("connection", async (socket) => {
  console.log("User connected");
  let clientNames = Object.values(nickDict);
  let nickname =
    adjectives[Math.floor(Math.random() * adjectives.length)] +
    " " +
    nicknames[Math.floor(Math.random() * nicknames.length)];
  while (
    clientNames.includes(nickname) &&
    clientNames.length < nicknames.length
  ) {
    nickname =
      adjectives[Math.floor(Math.random() * adjectives.length)] +
      " " +
      nicknames[Math.floor(Math.random() * nicknames.length)];
  }
  nickDict[socket.id] = nickname;
  clientNames = Object.values(nickDict);
  socket.emit("nickname", nickname, clientNames, () => {
    console.log("connected clients");
    console.log(clientNames);
    socket.broadcast.emit("connectedClients", clientNames);
  }); //emit to only the connecting socket

  socket.on("newMessage", async (data) => {
    console.log("newMessage");
    const message = {
      sender: data.sender,
      text: data.text,
    };
    let msg = await addMessage(message);
    sio.emit("bcMessage", msg);
  });
  socket.on("typing", async (data) => {
    typers.push(nickDict[socket.id]);
    console.log(typers);
    socket.broadcast.emit("typers", typers);
  });
  socket.on("stoppedTyping", async (data) => {
    typers.splice(typers.indexOf(nickDict[socket.id]), 1);
    socket.broadcast.emit("typers", typers);
  });

  socket.on("disconnect", () => {
    delete nickDict[socket.id];
    sio.emit("connectedClients", Object.values(nickDict));
    console.log("user disconnected");
    if (Object.keys(sio.sockets.sockets).length === 0) {
      console.log("Last person disconnected. Clearing Messages.");
      clearMessages();
    }
  });
});
