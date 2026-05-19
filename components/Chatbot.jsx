"use client";

import { useState, useRef, useEffect, useSyncExternalStore } from "react";
import { validateMessage } from "@/lib/validation";
import { MAX_MESSAGE_LENGTH } from "@/lib/chat";
import LoadingSpinner from "./LoadingSpinner";
import ErrorMessage from "./ErrorMessage";

const WELCOME =
  "Hi! I'm NovaPulse — your ChatGPT assistant. What would you like to explore today?";

function subscribe(cb) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

function getIsMobile() {
  return typeof window !== "undefined" && window.innerWidth <= 640;
}

async function sendChatMessage(messages) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }

  if (!data.success) {
    throw new Error(data.error || "Could not get a response.");
  }

  return data;
}

export default function Chatbot() {
  const isMobile = useSyncExternalStore(subscribe, getIsMobile, () => false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(e) {
    e.preventDefault();

    const validation = validateMessage(input);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    const userMessage = { role: "user", content: validation.text };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const apiMessages = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const data = await sendChatMessage(apiMessages);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(err.message || "Failed to get a response.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setMessages([]);
    setError("");
  }

  return (
    <section className="chatbot">
      <div className="chat-toolbar">
        <h2>Conversation</h2>
        <button
          type="button"
          className="reset-btn"
          onClick={handleClear}
          disabled={loading}
        >
          Reset
        </button>
      </div>

      <div
        className="chat-thread"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 && !loading && (
          <article className="msg msg--bot">
            <div className="msg-body">
              <span className="msg-label">NovaPulse</span>
              <p>{WELCOME}</p>
            </div>
          </article>
        )}
        {messages.map((msg, i) => (
          <article key={i} className={`msg msg--${msg.role}`}>
            <div className="msg-avatar" aria-hidden="true">
              {msg.role === "user" ? "You" : "NP"}
            </div>
            <div className="msg-body">
              <span className="msg-label">
                {msg.role === "user" ? "You" : "NovaPulse"}
              </span>
              <p>{msg.content}</p>
            </div>
          </article>
        ))}
        {loading && (
          <article className="msg msg--bot msg--loading">
            <div className="msg-avatar" aria-hidden="true">
              NP
            </div>
            <div className="msg-body">
              <span className="msg-label">NovaPulse</span>
              <LoadingSpinner />
              <span className="loading-text">Composing reply…</span>
            </div>
          </article>
        )}
        <div ref={messagesEndRef} />
      </div>

      <ErrorMessage message={error} />

      <form className="composer" onSubmit={handleSend}>
        <label className="composer-label" htmlFor="chat-input">
          Your message
        </label>
        <textarea
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
          placeholder={
            isMobile
              ? "Ask NovaPulse anything…"
              : "Ask NovaPulse anything… (Enter to send)"
          }
          rows={2}
          maxLength={MAX_MESSAGE_LENGTH}
          disabled={loading}
        />
        <div className="composer-actions">
          <span className="char-count">
            {input.length} / {MAX_MESSAGE_LENGTH}
          </span>
          <button
            type="submit"
            className="send-btn"
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                <span>Sending</span>
              </>
            ) : (
              <span>Send message</span>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}
