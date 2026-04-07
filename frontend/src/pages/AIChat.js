import { useState } from "react";
import axios from "axios";

export default function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    const res = await axios.post("http://localhost:8000/chat/chat", {
      message
    });

    setChat([...chat, { user: message, ai: res.data.reply }]);
    setMessage("");
  };

  return (
    <div>
      <h2>AI Career Assistant</h2>

      {chat.map((c, i) => (
        <div key={i}>
          <p><b>You:</b> {c.user}</p>
          <p><b>AI:</b> {c.ai}</p>
        </div>
      ))}

      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}