import React, { useRef, useState } from "react";
interface MessageProps {
  text: string;
  isSender: boolean;
  createdAt: string;
}
const Message = ({ createdAt, isSender, text }: MessageProps) => {
  const [showTime, setShowTime] = useState<boolean>(false);
  console.log(createdAt);
  const color = isSender
    ? "bg-blue-500 text-white "
    : "bg-gray-200 text-gray-900 ";

  let date = new Date(createdAt);

  let minutes: number = date.getMinutes();
  let fMinutes: string = "" + minutes;
  if (minutes < 10) {
    fMinutes = "0" + minutes;
  }
  let format = date.getHours() + ":" + fMinutes;

  let visible = showTime ? "visible" : "invisible";

  return (
    <div className="flex items-center">
      {
        //position should be to the left of the message
        isSender ? (
          <div className={`text-gray-300 text-xs m-2 ${visible}`}>{format}</div>
        ) : null
      }
      <div
        onMouseOver={() => setShowTime(true)}
        onMouseLeave={() => setShowTime(false)}
        className={color + " inline-block rounded p-2 shadow-md"}
      >
        {text}
      </div>
      {
        //position should be to the right of the message
        !isSender ? (
          <div className={`text-gray-300 text-xs m-2 ${visible}`}>{format}</div>
        ) : null
      }
    </div>
  );
};
export default Message;
