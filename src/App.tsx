import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

// Vi vill vid start av appen, automatiskt ansluta till servern
const socket = io("ws://10.100.2.139:3001");

function App() {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  const connectionStatus = connected ? "Connected" : "Disconnected";

  useEffect(() => {
    // När en anslutning har upprättats
    socket.on("connect", () => {
      setConnected(true);
    });

    // När anslutningen har avslutats
    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("cir-ter", (data: string) => {
      console.log("Data received: ", data);

      // const receivedMessage = JSON.parse(data); // Omvandlar JSON-string till objekt/array

      setMessages((prev) => [...prev, JSON.stringify(data)]);

      console.log(messages);
    });

    return () => {
      // Kod som körs när komponenten avmonteras
      socket.off("connect");
      socket.off("disconnect");
      socket.off("cir-ter");
    };
  }, []);

  const emitEvent = () => {
    const message = {
      message: "Hej där",
      sender: "Ahmad ardal",
    };

    const stringifiedMessage = JSON.stringify(message);

    socket.emit("cir-ter", stringifiedMessage);
  };

  return (
    <div id="messages-container">
      <p>{connectionStatus}</p>

      {messages.map((message) => (
        <p>{message}</p>
      ))}
    </div>
  );
}

export default App;