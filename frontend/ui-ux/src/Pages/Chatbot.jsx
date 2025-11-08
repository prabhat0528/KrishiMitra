import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

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
      const botMsg = {
        id: Date.now() + 1,
        text: data.reply || "Sorry, I couldn’t understand that.",
        from: "bot",
        ts: new Date().toISOString(),
      };
      setMessages((m) => [...m, botMsg]);
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-white p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <header className="px-6 py-4 bg-green-600 text-white flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-3">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Chat with KrishiMitra
          </h2>
          <span className="text-sm opacity-90">
            {loading ? "Typing..." : "Online"}
          </span>
        </header>

        <main className="p-6">
          <div ref={listRef} className="space-y-4 h-72 overflow-y-auto pr-2">
            {messages.length === 0 && (
              <div className="text-center text-gray-400">
                No messages yet — say hi 👋
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
                  className={`max-w-[80%] px-4 py-2 rounded-2xl leading-relaxed text-sm shadow-sm ${
                    m.from === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  <div className="text-[10px] text-gray-400 mt-1 text-right">
                    {new Date(m.ts).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl text-gray-500 text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> KrishiMitra is
                  typing...
                </div>
              </div>
            )}
          </div>

          {/* input area */}
          <div className="mt-4">
            <label
              htmlFor="chat-input"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message
            </label>
            <div className="flex gap-3">
              <textarea
                id="chat-input"
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                placeholder="Ask something about farming, e.g. 'Best crop for loamy soil?'"
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-300 resize-none"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl shadow transition disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span className="hidden sm:inline-block font-medium">
                  {loading ? "Sending..." : "Send"}
                </span>
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </main>

       
      </div>
    </div>
  );
}
