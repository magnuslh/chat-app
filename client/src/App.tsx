import React, { useEffect, useState } from "react";
import { useStateWithCallbackLazy } from "use-state-with-callback";
import { GET_HISTORY, CLEAR_MESSAGES } from "./db/queries";
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

import Chat from "./components/Chat";
import { Message } from "./types/types";

// const port = "9000";
const io = require("socket.io-client");
const socket = io("/");

const link = createHttpLink({
  uri: "/graphql",
});

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [clients, setClients] = useState<string[]>([]);

  const [typers, setTypers] = useState<string[]>([]);
  const [nickname, setNickname] = useStateWithCallbackLazy<string>("");

  const clearMessages = async () => {
    try {
      let res = await client.mutate({
        mutation: CLEAR_MESSAGES,
      });
      let messages = res.data;
      setMessages([]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getHistory = async () => {
      try {
        let res = await client.query({
          query: GET_HISTORY,
        });
        let messages = res.data.messages;
        console.log(messages);
        setMessages(messages);
      } catch (error) {
        console.error(error);
      }
    };
    getHistory();

    socket.on("bcMessage", (data: Message) => {
      setMessages((prevState) => [...prevState, data]);
    });
    socket.on(
      "nickname",
      (nick: string, clients: string[], callback: () => void) => {
        setNickname(nick, () => {
          callback();
        });
        let otherClients = clients.filter((client) => client !== nick);
        setClients(otherClients);
      }
    );
    socket.on("typers", (typers: string[]) => {
      setTypers(typers);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    socket.on("connectedClients", (clients: string[]) => {
      //nickname is not set yet.
      let otherClients = clients.filter((client) => client !== nickname);
      setClients(otherClients);
    });
  }, [nickname]);

  const sendMessage = async (text: string) => {
    console.log(nickname);
    let message = {
      text: text,
      sender: nickname,
    };
    socket.emit("newMessage", message);
  };
  const startTyping = () => {
    socket.emit("typing");
  };
  const stopTyping = () => {
    socket.emit("stoppedTyping");
  };

  return (
    <div className="h-screen w-full">
      <Chat
        clients={clients}
        nickname={nickname}
        messages={messages}
        typers={typers}
        clearMessages={() => clearMessages()}
        sendMessage={(text: string) => sendMessage(text)}
        sendTyping={(value: boolean) => {
          console.log(value);
          if (value) {
            startTyping();
          } else {
            stopTyping();
          }
        }}
      />
    </div>
  );
}

export default App;
