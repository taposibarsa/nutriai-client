"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import type { ChatConversationSummary } from "@/types";

type ConversationListProps = {
  conversations: ChatConversationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onNewChat: () => void;
  creating?: boolean;
  loading?: boolean;
};

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
  onNewChat,
  creating = false,
  loading = false,
}: ConversationListProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 p-3">
        <Button
          type="button"
          onClick={onNewChat}
          loading={creating}
          className="w-full rounded-xl"
        >
          New Chat
        </Button>
      </div>

      <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 pb-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="animate-pulse rounded-lg px-3 py-2.5"
            >
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="mt-2 h-3 w-1/3 rounded bg-gray-200" />
            </li>
          ))
        ) : conversations.length === 0 ? (
          <li className="px-2 py-8 text-center">
            <p className="text-sm font-semibold text-forest">No conversations yet</p>
            <p className="mt-1 text-xs text-warm-gray">
              Tap New Chat to ask your nutrition coach anything.
            </p>
          </li>
        ) : (
          conversations.map((c) => {
            const active = c._id === activeId;
            return (
              <li key={c._id} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelect(c._id)}
                  className={`w-full rounded-lg border-l-4 px-3 py-2.5 text-left transition ${
                    active
                      ? "border-forest bg-sage/50"
                      : "border-transparent hover:bg-sage/30"
                  }`}
                >
                  <p className="truncate pr-8 text-sm font-medium text-foreground">
                    {c.title || "New Conversation"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-warm-gray">
                    {relativeTime(c.updatedAt)}
                  </p>
                </button>
                <button
                  type="button"
                  aria-label="Delete conversation"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(c._id);
                  }}
                  className="absolute top-2.5 right-2 rounded p-1 text-warm-gray opacity-100 transition hover:bg-white hover:text-red-600 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
