import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

// Anslut till din Socket.IO-server
const socket = io("ws://10.100.2.139:3001");

function App() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");

  const connectionStatus = connected ? "✅ Connected" : "❌ Disconnected";

  // Hantera socket-händelser
  useEffect(() => {
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    // När ett nytt meddelande tas emot
    socket.on("cir_ter", (data: string) => {
      try {
        const parsed = JSON.parse(data);
        setMessages((prev) => [...prev, parsed]);
      } catch (error) {
        console.error("Kunde inte tolka meddelande:", data);
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("cir_ter");
    };
  }, []);

  // Skicka ett meddelande
  const sendMessage = () => {
    if (!currentMessage.trim()) return;

    const message = {
      sender: username,
      text: currentMessage,
    };

    socket.emit("cir_ter", JSON.stringify(message));
    setMessages((prev) => [...prev, message]);
    setCurrentMessage("");
  };

  // Hantera login
  const handleLogin = () => {
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div id="app">
      <h2>{connectionStatus}</h2>

      {!isLoggedIn ? (
        <div className="login-container">
          <h3>Skriv ditt namn för att logga in:</h3>
          <input
            type="text"
            placeholder="Ditt namn..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleLogin}>Logga in</button>
        </div>
      ) : (
        <div className="chat-container">
          <h3>Inloggad som: {username}</h3>

          <div className="messages-box">
            {messages.map((msg, i) => (
              <p
                key={i}
                className={msg.sender === username ? "own-message" : "other-message"}
              >
                <strong>{msg.sender}:</strong> {msg.text}
              </p>
            ))}
          </div>

          <div className="input-area">
            <input
              type="text"
              placeholder="Skriv ett meddelande..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>Skicka</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
