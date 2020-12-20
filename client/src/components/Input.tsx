import React, { useState, useEffect } from "react";
import { debounce } from "../helpers/debounce";

interface InputProps {
  sendMessage: (text: string) => void;
  sendTyping: (value: boolean) => void;
  // typingFunctions: { startTyping: () => void; stopTyping: () => void };
}
const Input = ({ sendTyping, sendMessage }: InputProps) => {
  const [value, setValue] = useState("");
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    //this is retarded
    if (!typing) {
      setTyping(true);
    }
    debounce(() => setTyping(false), 1000, false);
  }, [value]);

  useEffect(() => {
    sendTyping(typing);
  }, [typing]);
  const submit = () => {
    if (value !== "") {
      sendMessage(value);
      setValue("");
    }
  };

  return (
    <div className="w-full p-4 flex bg-gray-200">
      <input
        type="text"
        name="message"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="rounded p-3 pl-6 flex-grow shadow"
        placeholder="Say something..."
        onKeyPress={(event) => {
          if (event.charCode === 13) {
            submit();
          }
        }}
      ></input>
      <button
        className="bg-blue-500 text-white rounded p-3 ml-2 shadow "
        onClick={submit}
      >
        Send
      </button>
    </div>
  );
};
export default Input;
