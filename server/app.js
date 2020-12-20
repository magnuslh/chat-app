const express = require("express");
const path = require("path");
const cors = require("cors");
const { typeDefs, resolvers } = require("./models/graphql.js");
const { ApolloServer } = require("apollo-server-express");

const port = process.env.PORT || 9000;

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});
const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

const http = app.listen(port, () => {
  console.log(`Server started at localhost:9000`);
});

exports.http = http;
