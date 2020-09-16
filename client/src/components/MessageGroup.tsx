import React from "react";
interface MessageGroupProps {
  children: any[];
  sender: string;
  // createdAt: string;
  updatedAt?: string;
  isSender: boolean;
}
const MessageGroup = ({
  isSender,
  sender,
  // createdAt,
  children,
}: MessageGroupProps) => {
  const classes = "p-2 m-1 ";

  if (isSender) {
    return (
      <div className={classes + " self-end text-right"}>
        <span className=" text-gray-700">{sender}</span>
        <div className="flex flex-col items-end space-y-1">{children}</div>
      </div>
    );
  } else {
    return (
      <div className={classes + " self-start text-left "}>
        <span className=" text-gray-700">{sender}</span>
        <div className="flex flex-col items-start space-y-1">{children}</div>
      </div>
    );
  }
};
export default MessageGroup;
