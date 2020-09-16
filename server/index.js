const mongoose = require("mongoose");
const socketIO = require("socket.io");
const express = require("express");
const path = require("path");
var cors = require("cors");
const { ApolloServer, gql } = require("apollo-server-express");

const app = express();
app.use(cors());

app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const username = "server";
const password = "HgGIHrrS7ep6ArnQ";

mongoose.connect(
  "mongodb+srv://" +
    username +
    ":" +
    password +
    "@chatapp.5hbu4.mongodb.net/root?retryWrites=true&w=majority",
  { useNewUrlParser: true }
);

const messageSchema = new mongoose.Schema(
  {
    text: String,
    sender: String,
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

const typeDefs = gql`
  scalar Date
  type Message {
    id: ID!
    sender: String!
    text: String
    createdAt: Date
    updatedAt: Date
  }
  type Response {
    success: Boolean
  }
  input MessageInput {
    id: ID!
    sender: String!
    text: String
  }
  type Query {
    messages: [Message]
  }

  type Mutation {
    addMessage(message: MessageInput): [Message]
    clearMessages: Response
  }
`;

const resolvers = {
  Query: {
    messages: async () => {
      try {
        const allMessages = await Message.find();
        return allMessages;
      } catch (e) {
        console.log("e", e);
        return [];
      }
    },
  },
  Mutation: {
    addMessage: async (obj, { message }) => {
      try {
        const newMessage = await Message.create({
          ...message,
        });
        const allMessages = await Message.find();
        return allMessages;
      } catch (e) {
        console.log("e", e);
      }
    },
    clearMessages: async () => {
      try {
        const allMessages = await Message.remove({});
        return true;
      } catch (e) {
        console.log("e", e);
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

const http = app.listen({ port: "9000" }, () => {
  console.log(`Server started at localhost:9000`);
});

//---------SocketIO------------
const io = socketIO(http);

async function addMessage(message) {
  try {
    const newMessage = await Message.create({
      ...message,
    });
    return newMessage;
  } catch (e) {
    console.log("e", e);
  }
}

async function clearMessages() {
  try {
    const allMessages = await Message.remove({});
    return true;
  } catch (e) {
    console.log("e", e);
  }
}

const nicknames = [
  "Sulla",
  "Caesar",
  "Augustus",
  "Tiberius",
  "Caligula",
  "Claudius",
  "Nero",

  "Vespasian",
  "Titus",
  "Domitian",
  "Nerva",
  "Trajan",
  "Hadrian",
  "Marcus Aurelius",
  "Commodus",
];

const nickDict = {};

io.on("connection", async (socket) => {
  console.log("User connected");
  let clientNames = Object.values(nickDict);
  let nickname = nicknames[Math.floor(Math.random() * nicknames.length)];
  while (
    clientNames.includes(nickname) &&
    clientNames.length < nicknames.length
  ) {
    nickname = nicknames[Math.floor(Math.random() * nicknames.length)];
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
    io.emit("bcMessage", msg);
  });

  socket.on("disconnect", () => {
    delete nickDict[socket.id];
    io.emit("connectedClients", Object.values(nickDict));
    console.log("user disconnected");
    if (Object.keys(io.sockets.sockets).length === 0) {
      console.log("Last person disconnected. Clearing Messages.");
      clearMessages();
    }
  });
});
