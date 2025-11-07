import { useEffect, useState } from "react";
import "./msgdetails/msgdetail.css";
import { io } from "socket.io-client";
import MessagesDetails from "./msgdetails/messagesDetails";
import type { typeMessages } from "./tsdeclaration";
import Login from "./Login";
import "./App.css"

/*
// Ahmads server
const socket = io("wss://api.leetcode.se/", {path: "/FOS25" }); */

const socket = io("wss://socket.chasqui.se");

function App() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<typeMessages[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [userLogin, setUserLogin] = useState([]);
  const [userName, setUserName] = useState("");

  const connectionStatus = connected ? "🟢 Uppkopplad" : "🔴 Nedkopplad";

  const room = ["chat_room", "chat", "general"];
  const actualChatRoom = room[0];

  useEffect(() => {
    socket.on("connect", () => {
      setConnected(true);
      console.log("Connected to server:", socket.id);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on(actualChatRoom, (data: typeMessages) => {
      console.log("Data received: ", data);
      const newMessage: typeMessages = {
        id: data.id || socket.id, // Om servern skickar id, annars ditt eget "data.id || socket.id"
        date: data.date || new Date().toLocaleString(),
        message: data.message || data, // Om servern skickar objekt eller ren sträng
        room: actualChatRoom,
        sender: userName,
      };
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off(actualChatRoom);
    };
  }, []);

  const sendMessage = () => {
    if (!inputMessage.trim()) return; // Tomt meddelande? gör inget

    const msgObject: typeMessages = {
      id: data.id || socket.id, 
      message: inputMessage,
      date: new Date().toLocaleString(),
      room: actualChatRoom,
      sender: userName,
    };

    socket.emit(actualChatRoom, msgObject);
    setMessages((prev) => [...prev, msgObject]);
    setInputMessage("");
  };

  return (
    <div id="container">
      <div className="messages">
        <MessagesDetails messages={messages} />
      </div>
      <div className="interaction-container">
        <div className="status-holder">
          <p className="connection-status">{connectionStatus}</p>
          <p className="actual-usr">{userName}</p>
        </div>
        <div className="menti-container">
          <div className="list-holder">
            <div className="answer">
              <input placeholder="Write your answer"/>
            </div>
            <div className="list-users">
              {userName}
            </div>
          </div>
          <div className="input-container">
            <div className="input-section">
              <textarea rows="2" cols="20" placeholder="Skriv ditt meddelande" onChange={(e) => setInputMessage(e.target.value)}></textarea>
              <button onClick={sendMessage} className="btn-send">Skicka</button>
            </div>
            <Login userName={userName} setUserLogin={setUserLogin} setUserName={setUserName} userLogin={userLogin} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;
