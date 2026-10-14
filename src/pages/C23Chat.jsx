import { ArrowLeft, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import "./Trip.css";

const quickReplies = [
  "What should I wear?",
  "Can we meet a bit earlier?",
  "Is lunch included?",
  "Thank you!",
];

function C23Chat({ trip, messages, onSend, onBack }) {
  const { person } = trip;
  const [text, setText] = useState("");
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function submit(event) {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setText("");
  }

  return (
    <main className="tp-app tp-chat-page">
      <header className="tp-chat-head">
        <button type="button" className="tp-back" onClick={onBack} aria-label="Back">
          <ArrowLeft size={18} />
        </button>

        <div className="tp-person">
          <img src={person.image} alt={person.name} />
          <div>
            <strong>{person.name}</strong>
            <span className="tp-online">Online · {person.responseTime.toLowerCase()}</span>
          </div>
        </div>
      </header>

      <div className="tp-msgs" aria-live="polite">
        {messages.map((message) => (
          <div key={message.id} className={`tp-msg ${message.from}`}>
            {message.text}
            <small>{message.time}</small>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="tp-quick">
        {quickReplies.map((reply) => (
          <button key={reply} type="button" onClick={() => onSend(reply)}>
            {reply}
          </button>
        ))}
      </div>

      <form className="tp-chat-form" onSubmit={submit}>
        <input
          type="text"
          placeholder="Type a message…"
          value={text}
          maxLength={300}
          onChange={(e) => setText(e.target.value)}
          aria-label="Message"
        />
        <button type="submit" className="tp-send" aria-label="Send message">
          <Send size={19} />
        </button>
      </form>
    </main>
  );
}

export default C23Chat;