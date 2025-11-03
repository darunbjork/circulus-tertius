import { useEffect, useState } from "react";
import "./msgdetails/msgdetail.css";
import { io } from "socket.io-client";
import MessagesDetails from "./msgdetails/messagesDetails";
import type { typeMessages } from "./tsdeclaration";
import Login from "./Login";
import "./App.css"

/*
// Skapar anslutning till servern
// Ahmads server
const socket = io("wss://api.leetcode.se/", {path: "/FOS25" }); */

const socket = io("wss://socket.chasqui.se");

const room = ["chat_room", "chat", "general"];
const actualChatRoom = room[0];
/* const userName = "TestOnTrain"; */

function App() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<typeMessages[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [userLogin, setUserLogin] = useState([]);
  const [userName, setUserName] = useState("");

  const connectionStatus = connected ? "🟢 Uppkopplad" : "🔴 Nedkopplad";

  // === Hantera anslutning och inkommande meddelanden ===
  useEffect(() => {
    // När en anslutning har upprättats
    socket.on("connect", () => {
      setConnected(true);
      console.log("Connected to server:", socket.id);
    });

    // När anslutningen bryts
    socket.on("disconnect", () => {
      setConnected(false);
    });

    // När ett meddelande tas emot
    socket.on(actualChatRoom, (data) => {
      console.log("Data received: ", data);
      const newMessage = {
        idm: data.id || socket.id, // Om servern skickar id, annars ditt eget "data.id || socket.id"
        date: data.date || new Date().toLocaleString(),
        msg: data.msg || data, // Om servern skickar objekt eller ren sträng
        room: actualChatRoom,
        user: userName,
      };
      setMessages((prev) => [...prev, newMessage]);
    });

    // Städa upp event listeners när komponenten avmonteras
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off(actualChatRoom);
    };
  }, []);

  // === Skicka meddelande till servern ===
  const sendMessage = () => {
    if (!inputMessage.trim()) return; // Tomt meddelande? gör inget

    // Skapa meddelandeobjekt
    const msgObject = {
      idm: socket.id, //socket.id,
      msg: inputMessage,
      date: new Date().toLocaleString(),
      room: actualChatRoom,
      user: userName,
    };

    // Skicka till servern
    socket.emit(actualChatRoom, msgObject);
    setMessages((prev) => [...prev, msgObject]);
    setInputMessage("");
  };

  return (
    <div id="container">
      <div className="messages">
        <MessagesDetails messages={messages} userName={userName} />
      </div>
      <div className="interaction-container">
        <div className="status-holder">
          <p className="connection-status">{connectionStatus}</p>
          <p className="actual-usr">{userName}</p>
        </div>
        <div className="menti-container">
          <div className="list-users"></div>
          <div className="input-container">
            <div className="input-section">
              <textarea
                rows="3"
                cols="40"
                placeholder="Skriv ditt meddelande"
                onChange={(e) => setInputMessage(e.target.value)}
              ></textarea>
              <button onClick={sendMessage}>Skicka</button>
            </div>
            <Login
              userName={userName}
              setUserLogin={setUserLogin}
              setUserName={setUserName}
              userLogin={userLogin}
            />
          </div>
        </div>
      </div>
      {/*  */}
    </div>
  );
}
export default App;
