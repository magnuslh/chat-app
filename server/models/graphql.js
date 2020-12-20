const { Message } = require("./mongoose");
const { gql } = require("apollo-server-express");
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

module.exports = {
  typeDefs: typeDefs,
  resolvers: resolvers,
};
