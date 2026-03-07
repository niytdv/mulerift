"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import dynamic from "next/dynamic";
import { AnalysisResult } from "@/lib/types";

const Antigravity = dynamic(() => import("@/components/Antigravity"), {
  ssr: false,
});

interface Message {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface AIChatbotPanelProps {
  analysisContext?: AnalysisResult;
}

export default function AIChatbotPanel({ analysisContext }: AIChatbotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Hello! I'm your AI AML Lead. I can help you analyze suspicious patterns, explain risk scores, and provide insights on fraud rings. What would you like to investigate?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Also scroll after loading state changes
  useEffect(() => {
    if (!isLoading) {
      setTimeout(scrollToBottom, 100);
    }
  }, [isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Prepare conversation history (last 10 messages for context)
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.role === "ai" ? "assistant" : "user",
        content: msg.content
      }));

      // Call Grok API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "I apologize, but I'm having trouble connecting to the AI service. Please make sure the GROQ_API_KEY is configured in your .env.local file.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative h-full flex flex-col overflow-hidden">
      {/* Antigravity Background */}
      <div className="absolute inset-0 z-0">
        <Antigravity
          count={400}
          magnetRadius={12}
          ringRadius={10}
          waveSpeed={0.5}
          waveAmplitude={1.8}
          particleSize={1.2}
          lerpSpeed={0.1}
          color="#06b6d4"
          autoAnimate={true}
          particleVariance={1.3}
          rotationSpeed={0.2}
          depthFactor={1}
          pulseSpeed={3.5}
          particleShape="sphere"
          fieldStrength={15}
        />
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-br from-black/60 via-black/50 to-black/70 backdrop-blur-[2px]"></div>

      {/* Content */}
      <div className="relative z-[2] h-full flex flex-col border-l border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.15)]">
        {/* Header */}
        <div className="p-4 border-b border-cyan-500/20 bg-black/40 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Bot className="text-cyan-400" size={20} />
            <h2 className="text-cyan-400 font-semibold tracking-wider">
              🔍 AI AML LEAD
            </h2>
          </div>
          <p className="text-cyan-300/60 text-xs mt-1">
            Real-time fraud investigation assistant
          </p>
        </div>

        {/* Message Display Area */}
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-lg ${
                message.role === "user"
                  ? "bg-cyan-600/30 backdrop-blur-md border border-cyan-400/40 shadow-cyan-500/20"
                  : "bg-black/50 backdrop-blur-md border border-cyan-500/30 shadow-cyan-500/10"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {message.role === "ai" ? (
                  <Bot size={14} className="text-cyan-300" />
                ) : (
                  <User size={14} className="text-cyan-200" />
                )}
                <span className="text-xs text-cyan-200/70">
                  {message.role === "ai" ? "AI Lead" : "You"}
                </span>
              </div>
              <p className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <span className="text-xs text-cyan-200/50 mt-1 block">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-black/50 backdrop-blur-md border border-cyan-500/30 rounded-2xl px-4 py-3 shadow-lg shadow-cyan-500/10">
              <div className="flex items-center gap-2">
                <Bot size={14} className="text-cyan-300 animate-pulse" />
                <span className="text-xs text-cyan-200/70">AI Lead is typing...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="p-4 border-t border-cyan-500/20 bg-black/40 backdrop-blur-xl">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about the investigation..."
            className="flex-1 bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-xl px-4 py-2.5 text-sm text-white placeholder-cyan-300/40 focus:outline-none focus:border-cyan-400/60 focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="bg-cyan-500/30 hover:bg-cyan-500/40 disabled:bg-black/30 disabled:cursor-not-allowed border border-cyan-400/40 rounded-xl px-4 py-2.5 transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-300" />
            ) : (
              <Send size={16} className="text-cyan-300" />
            )}
          </button>
        </div>
        <p className="text-xs text-cyan-300/50 mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
      </div>
    </div>
  );
}
