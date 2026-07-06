/**
 * RangerBot - AI Health Assistant
 * Powered by Google Gemini via Ranger Med-Core backend
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./RangerBot.css";
import { sendMessage } from "../../api/ai";

/* ------------------------------------------------------------------ */
/*  Markdown-lite renderer (bold, bullets, numbered lists, line breaks) */
/* ------------------------------------------------------------------ */
function renderMarkdown(text) {
  if (!text) return null;
  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Numbered list
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`}>
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: inlineMd(item) }} />
          ))}
        </ol>
      );
      continue;
    }

    // Bullet list (-, *, +)
    // eslint-disable-next-line no-useless-escape
    if (/^[-*+]\s/.test(line)) {
      const items = [];
      // eslint-disable-next-line no-useless-escape
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        // eslint-disable-next-line no-useless-escape
        items.push(lines[i].replace(/^[-*+]\s/, ""));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`}>
          {items.map((item, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: inlineMd(item) }} />
          ))}
        </ul>
      );
      continue;
    }

    // Empty line = spacer
    if (line.trim() === "") {
      elements.push(<br key={`br-${i}`} />);
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <p
        key={`p-${i}`}
        dangerouslySetInnerHTML={{ __html: inlineMd(line) }}
      />
    );
    i++;
  }
  return elements;
}

/** Inline markdown: **bold**, *italic*, `code` */
function inlineMd(str) {
  return str
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
function RangerBot() {
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "bot",
      text: "Greetings, Ranger. I am AlphaBot -- your AI health assistant.\n\nI have access to your medications, symptoms, and appointments. Ask me anything about your health, and I will give you personalised guidance.\n\nWhat can I help you with?",
      timestamp: new Date(),
    },
  ]);

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickActions = [
    { id: "meds", label: "My Medications", msg: "What medications am I currently taking and when should I take them?" },
    { id: "symptoms", label: "Check Symptoms", msg: "I want to discuss some symptoms I have been experiencing." },
    { id: "wellness", label: "Wellness Tips", msg: "Give me personalised wellness tips based on my health data." },
    { id: "schedule", label: "My Schedule", msg: "What upcoming appointments and doses do I have?" },
  ];

  /* ---- auto-scroll ---- */
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /* ---- build history for API ---- */
  function buildHistory() {
    return messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, text: m.text }));
  }

  /* ---- send message ---- */
  const handleSend = async (overrideText) => {
    const text = (overrideText || inputText).trim();
    if (!text || isLoading) return;

    setError(null);

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      role: "user",
      text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const history = buildHistory();
      const res = await sendMessage(text, history);
      const { reply, metadata } = res.data;

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: reply,
        timestamp: new Date(),
        metadata,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("RangerBot error:", err);
      setError("Failed to reach the AI service. Check your connection and try again.");
      const errorMsg = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: "I could not process your request right now. Please try again in a moment.",
        timestamp: new Date(),
        isError: true,
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (msg) => {
    if (isLoading) return;
    handleSend(msg);
  };

  /* ---- navigate helpers (detect suggestion keywords) ---- */
  const handleSuggestionNav = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("symptom checker")) navigate("/symptom-checker");
    else if (lower.includes("log symptoms") || lower.includes("symptom tracker")) navigate("/symptoms");
    else if (lower.includes("book appointment") || lower.includes("schedule appointment")) navigate("/appointments");
    else if (lower.includes("view medications") || lower.includes("my capsules")) navigate("/capsules");
    else if (lower.includes("calendar")) navigate("/calendar");
    else if (lower.includes("timeline")) navigate("/timeline");
    else handleSend(text);
  };

  /* ---- render ---- */
  return (
    <div className="rb-page">
      {/* Background layers */}
      <div className="rb-bg">
        <div className="rb-bg-grid" />
        <div className="rb-bg-scanline" />
        <div className="rb-bg-glow" />
      </div>

      {/* Header */}
      <header className="rb-header">
        <button className="rb-back" onClick={() => navigate("/dashboard")}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Dashboard
        </button>
        <div className="rb-title-group">
          <h1 className="rb-title">ALPHABOT</h1>
          <span className="rb-subtitle">AI HEALTH ASSISTANT</span>
        </div>
        <div className="rb-status">
          <span className={`rb-status-dot ${isLoading ? "processing" : "online"}`} />
          <span className="rb-status-label">{isLoading ? "Processing" : "Online"}</span>
        </div>
      </header>

      {/* Main chat area */}
      <main className="rb-main">
        {/* Quick actions bar */}
        <div className="rb-quick-bar">
          {quickActions.map((a) => (
            <button
              key={a.id}
              className="rb-quick-btn"
              onClick={() => handleQuickAction(a.msg)}
              disabled={isLoading}
            >
              {a.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="rb-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rb-msg ${msg.role} ${msg.isError ? "error" : ""}`}
            >
              <div className="rb-msg-indicator">
                {msg.role === "bot" ? (
                  <div className="rb-avatar-bot">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="4"/><line x1="8" y1="16" x2="8" y2="16.01"/><line x1="16" y1="16" x2="16" y2="16.01"/></svg>
                  </div>
                ) : (
                  <div className="rb-avatar-user">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                )}
              </div>
              <div className="rb-msg-body">
                <div className="rb-msg-label">
                  {msg.role === "bot" ? "AlphaBot" : "You"}
                  <time className="rb-msg-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </time>
                </div>
                <div className="rb-msg-content">
                  {msg.role === "bot" ? renderMarkdown(msg.text) : <p>{msg.text}</p>}
                </div>
                {msg.metadata && (
                  <div className="rb-msg-meta">
                    <span>{msg.metadata.model}</span>
                    <span>{msg.metadata.processingTime}ms</span>
                    {msg.metadata.tokensUsed && <span>{msg.metadata.tokensUsed} tokens</span>}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isLoading && (
            <div className="rb-msg bot">
              <div className="rb-msg-indicator">
                <div className="rb-avatar-bot pulsing">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="4"/><line x1="8" y1="16" x2="8" y2="16.01"/><line x1="16" y1="16" x2="16" y2="16.01"/></svg>
                </div>
              </div>
              <div className="rb-msg-body">
                <div className="rb-msg-label">AlphaBot</div>
                <div className="rb-typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          {/* Error banner */}
          {error && !isLoading && (
            <div className="rb-error-banner">
              {error}
              <button onClick={() => setError(null)}>Dismiss</button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion chips for navigation */}
        <div className="rb-nav-chips">
          {["Symptom Checker", "Log Symptoms", "Book Appointment", "View Medications", "Calendar"].map((s) => (
            <button key={s} className="rb-chip" onClick={() => handleSuggestionNav(s)}>
              {s}
            </button>
          ))}
        </div>

        {/* Input area */}
        <div className="rb-input-area">
          <textarea
            ref={inputRef}
            className="rb-input"
            placeholder="Ask me anything about your health..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows="1"
            disabled={isLoading}
          />
          <button
            className="rb-send"
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isLoading}
            aria-label="Send message"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </main>
    </div>
  );
}

export default RangerBot;
