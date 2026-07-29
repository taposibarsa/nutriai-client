"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { ArrowUp, Leaf, Square } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedPrompts } from "./SuggestedPrompts";
import type { ChatMessage } from "@/types";

export const STARTER_PROMPTS = [
  "What should I eat before a morning workout?",
  "Explain the difference between keto and paleo diets.",
  "How much protein do I need to build muscle?",
  "What are the best foods for gut health?",
  "Can you review my current meal plan?",
  "I'm trying to reduce bloating — what should I avoid?",
] as const;

type ChatWindowProps = {
  messages: ChatMessage[];
  isStreaming: boolean;
  waitingForFirstToken: boolean;
  suggestions: string[];
  streamError?: string | null;
  onSend: (message: string) => void;
  onStop: () => void;
  onStarter?: (prompt: string) => void;
};

export function ChatWindow({
  messages,
  isStreaming,
  waitingForFirstToken,
  suggestions,
  streamError,
  onSend,
  onStop,
  onStarter,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isEmpty = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, waitingForFirstToken, suggestions]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    setInput("");
    onSend(trimmed);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    submit(input);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        {isEmpty ? (
          <div className="mx-auto flex max-w-xl flex-col items-center pt-10 text-center sm:pt-16">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-forest text-card">
              <Leaf className="h-7 w-7" />
            </div>
            <h2 className="font-semibold text-forest text-xl sm:text-2xl">
              Ask me anything about nutrition, food, or your meal plan.
            </h2>
            <p className="mt-2 text-sm text-warm-gray">
              Pick a starter or type your own question below.
            </p>
            <div className="mt-8 flex w-full flex-wrap justify-center gap-2">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={isStreaming}
                  onClick={() =>
                    onStarter ? onStarter(prompt) : onSend(prompt)
                  }
                  className="rounded-full border border-forest/20 bg-card px-3 py-2 text-left text-xs text-forest transition hover:border-forest/40 hover:bg-sage/40 disabled:opacity-50 sm:text-sm"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {messages.map((m, i) => {
              const isLastAssistant =
                m.role === "assistant" && i === messages.length - 1;
              if (
                isLastAssistant &&
                waitingForFirstToken &&
                !m.content.trim()
              ) {
                return <TypingIndicator key={`typing-${i}`} />;
              }
              if (!m.content.trim() && m.role === "assistant") {
                return null;
              }
              return (
                <MessageBubble
                  key={`${m.role}-${m.timestamp}-${i}`}
                  message={m}
                />
              );
            })}

            {!isStreaming && suggestions.length > 0 ? (
              <SuggestedPrompts
                prompts={suggestions}
                disabled={isStreaming}
                onSelect={(p) => onSend(p)}
              />
            ) : null}

            {streamError ? (
              <p className="text-center text-sm text-red-600">{streamError}</p>
            ) : null}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="shrink-0 border-t border-forest/10 bg-card/80 px-4 py-3 backdrop-blur-sm sm:px-6">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-2"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isStreaming}
            rows={1}
            placeholder="Ask NutriAI Coach..."
            className="max-h-[120px] min-h-[44px] flex-1 resize-none rounded-2xl border border-forest/15 bg-white px-4 py-3 text-sm text-foreground outline-none placeholder:text-warm-gray focus:border-forest/40 disabled:opacity-60"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={onStop}
              aria-label="Stop generating"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700"
            >
              <Square className="h-4 w-4 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-coral text-foreground transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          )}
        </form>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-warm-gray">
          NutriAI Coach provides general wellness advice, not medical diagnoses.
        </p>
      </div>
    </div>
  );
}
