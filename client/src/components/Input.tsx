import React, { useState } from "react";
interface InputProps {
  sendMessage: (text: string) => void;
}
const Input = ({ sendMessage }: InputProps) => {
  const [value, setValue] = useState("");
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
