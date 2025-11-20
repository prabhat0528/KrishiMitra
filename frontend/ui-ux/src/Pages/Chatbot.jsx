// src/ChatPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { Menu, Trash2, Plus, Send, Loader2, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CHAT_STORAGE_KEY = "chatHistory_v1";

// small utility to load/save localStorage
const loadChats = () => {
  try {
    return JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};
const saveChats = (chats) => {
  localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
};

// sanitizes a reply to simple inline text (keeps minimal formatting)
const cleanMarkdown = (text) => {
  if (typeof text !== "string") return "";
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

function formatWithArrows(text) {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) =>
      line.startsWith("→")
        ? `<div class='flex items-start gap-2 text-sm'><span class="text-amber-600 font-bold">»</span><span>${line
            .slice(1)
            .trim()}</span></div>`
        : `<div class="text-sm">${line}</div>`
    )
    .join("");
}

function formatTimestamp(ts) {
  if (!ts) return "";
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPage() {
  const [chats, setChats] = useState(() => loadChats());
  const [activeId, setActiveId] = useState(() => (chats[0] ? chats[0].id : null));
  const [messages, setMessages] = useState(() => (chats[0] ? chats[0].messages || [] : []));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const listRef = useRef(null);
  const inputRef = useRef(null);

  // When active chat changes, load messages into view
  useEffect(() => {
    const active = chats.find((c) => c.id === activeId) || null;
    setMessages(active ? active.messages || [] : []);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [activeId]);

  useEffect(() => {
    saveChats(chats);
  }, [chats]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading]);

  const createChat = () => {
    const id = crypto.randomUUID();
    const newChat = {
      id,
      title: "New Query",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    const next = [newChat, ...chats];
    setChats(next);
    setActiveId(id);
    setMessages([]);
    setDrawerOpen(false);
  };

  const deleteChat = (e, id) => {
    e.stopPropagation();
    const next = chats.filter((c) => c.id !== id);
    setChats(next);
    if (activeId === id) {
      setActiveId(next[0] ? next[0].id : null);
    }
  };

  const selectChat = (id) => {
    setActiveId(id);
    setDrawerOpen(false);
  };

  const persistMessages = (msgs) => {
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: msgs, title: msgs[0]?.text?.slice(0, 40) || c.title }
          : c
      )
    );
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    if (!activeId) {
      createChat();
      return setTimeout(() => sendMessage(), 60);
    }

    const userMsg = { id: crypto.randomUUID(), from: "user", text, ts: new Date().toISOString() };
    const withUser = [...messages, userMsg];
    setMessages(withUser);
    persistMessages(withUser);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();

      const rawReply =
        data?.reply || "Sorry, I couldn't understand that. Please try rephrasing.";
      const reply = cleanMarkdown(rawReply);

      const botId = crypto.randomUUID();
      const botMsg = { id: botId, from: "bot", text: "", ts: new Date().toISOString() };
      setMessages((prev) => {
        const next = [...prev, botMsg];
        persistMessages(next);
        return next;
      });

      let i = 0;
      const interval = setInterval(() => {
        i++;
        setMessages((prev) => {
          const updated = prev.map((m) =>
            m.id === botId ? { ...m, text: reply.slice(0, i) } : m
          );
          persistMessages(updated);
          return updated;
        });
        if (i >= reply.length) clearInterval(interval);
      }, 16);
    } catch (err) {
      console.error(err);
      const errMsg = {
        id: crypto.randomUUID(),
        from: "bot",
        text: " Network error. Check your connection or server.",
        ts: new Date().toISOString(),
      };
      const updated = [...messages, errMsg];
      setMessages(updated);
      persistMessages(updated);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const Drawer = ({ open, onClose }) => (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black z-30"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white z-40 border-r border-stone-200 shadow-xl p-4 pt-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-stone-800">History</h3>
              <button
                onClick={() => {
                  setChats([]);
                  saveChats([]);
                  setActiveId(null);
                  setMessages([]);
                }}
                className="text-xs text-red-500 px-2 py-1 rounded hover:bg-red-50"
              >
                Clear
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto h-[calc(100%-56px)]">
              <button
                onClick={createChat}
                className="w-full mt-10 flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-lg shadow-sm mb-2 hover:bg-emerald-700"
              >
                <Plus size={16} /> New Query
              </button>

              {chats.length === 0 && (
                <div className="text-sm text-stone-400">
                  No previous queries — start a new one.
                </div>
              )}

              {chats.map((c) => (
                <div
                  key={c.id}
                  onClick={() => selectChat(c.id)}
                  className={`flex items-start gap-3 p-3 rounded-md transition-colors cursor-pointer ${
                    c.id === activeId
                      ? "bg-emerald-50 border border-emerald-200"
                      : "hover:bg-stone-50"
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <MessageSquare className="text-emerald-600" size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-stone-800 truncate">
                      {c.title}
                    </div>
                    <div className="text-xs text-stone-400 mt-1">
                      {new Date(c.createdAt).toLocaleString([], {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <button
                    onClick={(e) => deleteChat(e, c.id)}
                    className="text-stone-400 hover:text-red-500 p-1 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  const logoSrc =
    "/mnt/data/a3e1bd2b-97fb-4fdd-8a12-45b9da078f62.png";

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">

      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative">

            <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <div className="mx-auto bg-white rounded-2xl shadow-2xl border border-stone-100 overflow-hidden">

              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-gradient-to-r from-white to-emerald-50">
                <div className="flex items-center gap-4">
                  {/* <img
                    src={logoSrc}
                    alt="KrishiMitra"
                    className="w-12 h-12 rounded-md object-cover shadow-sm"
                  /> */}
                  <div>
                    <div className="text-lg font-extrabold text-stone-800 leading-none">
                      KrishiMitra
                    </div>
                    <div className="text-xs text-stone-500">
                      Field guidance & crop insights
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setDrawerOpen(true)}
                  className="p-2 rounded-md hover:bg-stone-100 transition"
                >
                  <Menu size={20} className="text-stone-600" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr]">
                <main className="p-6 bg-stone-50 min-h-[60vh]">
                  <div className="mx-auto max-w-3xl">

                    <div ref={listRef} className="space-y-6 mb-6">
                      {messages.length === 0 && (
                        <div className="text-center py-24 text-stone-400">
                          <div className="text-2xl font-semibold mb-1">
                            Ask about soil, pests, or market prices
                          </div>
                          <div className="text-sm">
                            KrishiMitra will provide practical, India-focused
                            guidance.
                          </div>
                        </div>
                      )}

                      {messages.map((m) => (
                        <div
                          key={m.id}
                          className={`flex ${
                            m.from === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[85%] p-4 rounded-xl shadow-sm ${
                              m.from === "user"
                                ? "bg-emerald-600 text-white rounded-br-lg"
                                : "bg-white text-stone-800 border border-stone-100"
                            }`}
                          >
                            <div
                              className="whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{
                                __html: formatWithArrows(m.text),
                              }}
                            ></div>
                            <div
                              className={`text-[11px] mt-2 ${
                                m.from === "user"
                                  ? "text-emerald-100 text-right"
                                  : "text-stone-400 text-left"
                              }`}
                            >
                              {formatTimestamp(m.ts)}
                            </div>
                          </div>
                        </div>
                      ))}

                      {loading && (
                        <div className="flex justify-start">
                          <div className="p-3 bg-white border border-stone-200 rounded-xl shadow-sm">
                            <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-stone-100 shadow-inner">
                      <div className="flex gap-3 items-end">
                        <textarea
                          ref={inputRef}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKey}
                          placeholder="Type your farming question here..."
                          className="flex-1 min-h-[56px] max-h-40 resize-none p-3 border border-stone-200 rounded-md focus:ring-2 focus:ring-emerald-300"
                          disabled={loading}
                        />
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className={`p-3 rounded-lg flex items-center justify-center transition ${
                              loading || !input.trim()
                                ? "bg-emerald-300 text-white cursor-not-allowed"
                                : "bg-emerald-600 text-white hover:bg-emerald-700 shadow"
                            }`}
                          >
                            {loading ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <Send />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              createChat();
                              setInput("");
                            }}
                            className="p-2 rounded-md text-stone-600 hover:bg-stone-100"
                            title="New query"
                          >
                            <Plus />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
