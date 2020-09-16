import React from "react";
interface HeaderProps {
  clients: string[];
}
const Header = ({ clients }: HeaderProps) => {
  let connectedClients = "";
  if (clients.length === 0) {
    connectedClients = "Looks you are the only one here";
  } else {
    connectedClients = clients.join(", ");
  }

  return (
    <div className="w-full p-6 text-lg bg-gray-200 text-center text-gray-700 font-bold shadow-lg">
      {connectedClients}
    </div>
  );
};
export default Header;
