const mongoose = require("mongoose");
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

module.exports = {
  Message: Message,
  addMessage: addMessage,
  clearMessages: clearMessages,
};
