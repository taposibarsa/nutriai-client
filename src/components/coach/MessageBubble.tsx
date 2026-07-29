"use client";

import type { ChatMessage } from "@/types";

type MessageBubbleProps = {
  message: ChatMessage;
};

function formatTime(iso: string) {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[85%] whitespace-pre-wrap px-4 py-2.5 text-sm leading-relaxed sm:max-w-[75%] ${
          isUser
            ? "rounded-2xl rounded-br-sm bg-coral text-foreground"
            : "rounded-2xl rounded-bl-sm bg-white text-forest shadow-sm"
        }`}
      >
        {message.content}
      </div>
      {message.timestamp ? (
        <span className="mt-1 px-1 text-[11px] text-warm-gray">
          {formatTime(message.timestamp)}
        </span>
      ) : null}
    </div>
  );
}
