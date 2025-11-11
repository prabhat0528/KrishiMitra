import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

// --- Utility to clean markdown and replace * with arrow icons ---
const cleanMarkdown = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/#{1,6}\s?/g, "")
    .replace(/^\s*-\s+/gm, "→ ")
    .replace(/^\s*\*\s+/gm, "→ ")
    .replace(/\n\s*\n/g, "\n")
    .trim();
};

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => {
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async () => {
    const text = message.trim();
    if (!text) return;

    const userMsg = {
      id: Date.now(),
      text,
      from: "user",
      ts: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const cleanText = cleanMarkdown(
        data.reply || "Sorry, I couldn’t understand that."
      );
      const botMsg = {
        id: Date.now() + 1,
        text: cleanText,
        from: "bot",
        ts: new Date().toISOString(),
      };

      setMessages((m) => [...m, { ...botMsg, text: "" }]);

      let i = 0;
      const interval = setInterval(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMsg.id
              ? { ...msg, text: cleanText.slice(0, i + 1) }
              : msg
          )
        );
        i++;
        if (i >= cleanText.length) clearInterval(interval);
      }, 15);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          id: Date.now() + 1,
          text: "⚠️ Network or server error.",
          from: "bot",
          ts: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // --- Format text with SVG arrows ---
  const formatWithArrows = (text) => {
    const html = text
      .split("\n")
      .map((line) =>
        line.startsWith("→")
          ? `<div class='flex items-start gap-2'>
              <svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth='2' class='text-green-600 mt-1'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7'/>
              </svg>
              <span>${line.slice(1).trim()}</span>
            </div>`
          : `<div>${line}</div>`
      )
      .join("");
    return html;
  };

  return (
    <div className="flex items-center justify-center bg-gradient-to-br from-green-100 to-white px-6 pt-24 pb-10 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[80vh]">
        {/* --- Header --- */}
        <header className="px-8 py-4 bg-green-600 text-white flex items-center justify-between">
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Chat with <span className="font-bold">KrishiMitra 🌾</span>
          </h2>
          <span className="text-sm opacity-90">
            {loading ? "Typing..." : "Online"}
          </span>
        </header>

        {/* --- Chat Area --- */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div ref={listRef} className="space-y-4 pr-3">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-20 text-base">
                👋 Hi there! I’m <span className="font-semibold">KrishiMitra</span>.
                <br />
                Ask me anything about farming or crops!
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-5 py-3 rounded-2xl leading-relaxed text-[15px] shadow-sm ${
                    m.from === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-gradient-to-r from-green-50 to-white border border-green-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <div
                    className="whitespace-pre-wrap font-medium"
                    dangerouslySetInnerHTML={{
                      __html: formatWithArrows(m.text),
                    }}
                  ></div>
                  <div className="text-[10px] text-gray-400 mt-2 text-right">
                    {new Date(m.ts).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl text-gray-500 text-sm flex items-center gap-2 shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin" /> KrishiMitra is
                  typing...
                </div>
              </div>
            )}
          </div>
        </main>

        {/* --- Input Area --- */}
        <div className="border-t p-5 bg-white">
          <div className="flex gap-3 items-end">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              placeholder="Ask about soil, fertilizers, crop selection..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 resize-none text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow transition disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              <span className="hidden sm:inline font-medium">
                {loading ? "Sending..." : "Send"}
              </span>
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-400">
            Press <kbd>Enter</kbd> to send • <kbd>Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
}
