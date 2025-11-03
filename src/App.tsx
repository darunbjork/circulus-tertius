import { useEffect, useState } from "react";
import "./msgdetails/msgdetail.css";
import { io } from "socket.io-client";
import MessagesDetails from "./msgdetails/messagesDetails";
import type { typeMessages } from "./tsdeclaration";
import Login from "./Login";

// Skapar anslutning till servern
const socket = io("wss://api.leetcode.se/", {path: "/FOS25" });
/* wss://api.leetcode.se/
wss://socket.chasqui.se */
const room = ["chat_room", "chat", "general"];
const actualChatRoom = room[0];

function App() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<typeMessages[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [userLogin, setUserLogin] = useState([]);
  const [userName, setUserName] = useState("");

  const AddNewUser = () => {
    if (userName === "") {
      return;
    }
    const newUsers = {
      id: Date.now(),
      username: userName,
    };
    setUserLogin([...userLogin, newUsers]);
    
  };

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
        idm: data.id || socket.id, // Om servern skickar id, annars ditt eget
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
      idm: socket.id,
      msg: inputMessage,
      date: new Date().toLocaleString(),
      room: actualChatRoom,
      user: userName,
    };

    // Skicka till servern
    socket.emit(actualChatRoom, msgObject);

    // Visa direkt i din egen lista (innan servern svarar)
    setMessages((prev) => [...prev, msgObject]);

    // Nollställ inputfältet
    setInputMessage("");
  };

  return (
    <div id="messages-container">
      <MessagesDetails messages={messages} userName={userName} />

      <div className="input-section">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Skriv ett meddelande..."
          />
        <button onClick={sendMessage}>Skicka</button>
        <p>{connectionStatus}</p>
      </div> 
      <input
        type="text"
        placeholder="write something"
        onChange={(e)=> setUserName(e.target.value)}
      />
      <button onClick={AddNewUser}>Add name</button>
        
      {userLogin.map((ul) =>(
        <Login 
        loginRef={ul}
        />
      ))}
      
    </div>
  );
}

export default App;
