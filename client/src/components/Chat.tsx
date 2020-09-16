import React, { useEffect, useState, useRef } from "react";
import Input from "./Input";
import Message from "./Message";
import Header from "./Header";
import MessageGroup from "./MessageGroup";
import { Message as MessageType } from "../types/types";
interface ChatProps {
  messages: any[];
  sendMessage: (text: string) => void;
  clearMessages: () => void;
  nickname: string;
  clients: string[];
}
const Chat = ({
  sendMessage,
  clearMessages,
  clients,
  nickname,
  messages,
}: ChatProps) => {
  const [messageElements, setMessageElements] = useState<JSX.Element[]>([]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let messageGroups: any[] = [];
    let currentGroup: number = 0;
    let elements = messages.map((message, k) => {
      if (k == 0) {
        messageGroups[currentGroup] = [message];
      } else if (k > 0 && message.sender === messages[k - 1].sender) {
        messageGroups[currentGroup] = [...messageGroups[currentGroup], message];
      } else {
        currentGroup += 1;
        messageGroups[currentGroup] = [message];
      }
      // return <Message key={k} text={message.text} />;
    });
    let groups = messageGroups.map((group, j) => {
      let isSender = group[0].sender === nickname ? true : false;
      let messages = group.map((message: MessageType, k: number) => {
        return (
          <Message
            isSender={isSender}
            createdAt={message.createdAt}
            key={k}
            text={message.text}
          />
        );
      });
      return (
        <MessageGroup
          isSender={isSender}
          sender={group[0].sender}
          // createdAt={group[0].createdAt}
          key={j}
        >
          {messages}
        </MessageGroup>
      );
    });
    console.log(messageGroups);
    setMessageElements(groups);
  }, [messages, nickname]);

  useEffect(() => {
    end.current!.scrollIntoView({ behavior: "smooth" });
  }, [messageElements]);
  return (
    <div className="w-full h-screen bg-gray-500 flex flex-col justify-end">
      <Header clients={clients} />
      <div className="w-full h-full flex flex-col p-4 overflow-y-scroll">
        {messageElements.length > 0 ? (
          <button className="text-gray-400" onClick={clearMessages}>
            Clear All
          </button>
        ) : (
          <span />
        )}
        {messageElements}
        <div ref={end}></div>
      </div>
      {/*input*/}
      <Input sendMessage={sendMessage}></Input>
    </div>
  );
};
export default Chat;
