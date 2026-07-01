"use client";

import { useState, useRef, useEffect } from "react";

type Message = { from: "agent" | "user"; text: string };

const INITIAL: Message = {
  from: "agent",
  text: "Hi! I'm Ishu's assistant. Ask me about his experience, services, or how he can help your team.",
};

export default function AgentCard() {
  const [messages, setMessages] = useState<Message[]>([INITIAL]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length > 1) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { from: "user", text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    // Build API messages — skip the initial greeting (must start with "user")
    const apiMessages = updated
      .filter((m) => m !== INITIAL && m.text !== INITIAL.text)
      .map((m) => ({
        role: m.from === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "API error");

      setMessages((prev) => [...prev, { from: "agent", text: data.text }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "agent", text: "Something went wrong. Reach out directly at topmate.io/ishu_singh" },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  return (
    <div className="w-96 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col min-h-[420px] animate-border-glow">

      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-glow" />
          <div>
            <p className="text-sm font-semibold text-foreground">Talk to Ishu</p>
            <p className="text-xs text-muted">Ask me anything about Ishu</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-live-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[10px] font-bold tracking-widest text-emerald-500">LIVE</span>
        </span>
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-3 px-5 py-4 overflow-y-auto max-h-80 min-h-[300px]">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`text-sm px-4 py-3 rounded-xl max-w-[88%] leading-relaxed ${
                m.from === "agent"
                  ? "bg-surface text-foreground rounded-tl-none"
                  : "bg-accent text-white rounded-tr-none"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="text-sm px-4 py-3 rounded-xl bg-surface text-muted rounded-tl-none">
              <span className="animate-pulse">…</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-5 pb-5 pt-2 shrink-0">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-surface focus-within:border-accent transition-colors">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message…"
            disabled={loading}
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted outline-none disabled:opacity-60"
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="text-muted hover:text-accent disabled:opacity-40 transition-colors"
          >
            {loading ? (
              <span className="block w-3.5 h-3.5 border-2 border-muted border-t-accent rounded-full animate-spin" />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
