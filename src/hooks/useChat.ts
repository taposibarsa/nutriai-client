"use client";

import {
  useCallback,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError, getApiRequestUrl } from "@/lib/api";
import type {
  ChatConversation,
  ChatConversationSummary,
  ChatMessage,
} from "@/types";

/** Hide SUGGESTIONS trailer (and incomplete trailing <!--) while streaming. */
export function stripSuggestionsTrailer(text: string): string {
  const marker = text.search(/<!--\s*SUGGESTIONS/i);
  if (marker >= 0) return text.slice(0, marker).trimEnd();
  const partial = text.lastIndexOf("<!--");
  if (partial >= 0 && partial > text.length - 100) {
    return text.slice(0, partial).trimEnd();
  }
  return text;
}

function nowIso() {
  return new Date().toISOString();
}

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      apiFetch<{ data: ChatConversationSummary[] }>("/api/ai/conversations"),
  });
}

export function useConversation(id: string | null) {
  return useQuery({
    queryKey: ["conversations", id],
    queryFn: () => apiFetch<ChatConversation>(`/api/ai/conversations/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiFetch<ChatConversation>("/api/ai/conversations", { method: "POST" }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(`/api/ai/conversations/${id}`, { method: "DELETE" }),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.removeQueries({ queryKey: ["conversations", id] });
    },
  });
}

export type UseChatStreamResult = {
  messages: ChatMessage[];
  setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
  isStreaming: boolean;
  waitingForFirstToken: boolean;
  suggestions: string[];
  streamError: string | null;
  sendMessage: (
    conversationId: string,
    message: string,
    activeMealPlanId?: string | null,
  ) => Promise<void>;
  stopStream: () => void;
  clearSuggestions: () => void;
};

export function useChatStream(): UseChatStreamResult {
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [waitingForFirstToken, setWaitingForFirstToken] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [streamError, setStreamError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const stopStream = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsStreaming(false);
    setWaitingForFirstToken(false);
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  const sendMessage = useCallback(
    async (
      conversationId: string,
      message: string,
      activeMealPlanId?: string | null,
    ) => {
      const trimmed = message.trim();
      if (!trimmed || !process.env.NEXT_PUBLIC_API_URL) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStreamError(null);
      setSuggestions([]);
      setIsStreaming(true);
      setWaitingForFirstToken(true);

      const userMsg: ChatMessage = {
        role: "user",
        content: trimmed,
        timestamp: nowIso(),
      };
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: "",
        timestamp: nowIso(),
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);

      try {
        const body: {
          message: string;
          activeMealPlanId: string | null;
        } = {
          message: trimmed,
          // Always send so "None" can clear a previously linked plan
          activeMealPlanId: activeMealPlanId?.trim()
            ? activeMealPlanId.trim()
            : null,
        };

        const response = await fetch(
          getApiRequestUrl(`/api/ai/chat/${conversationId}`),
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          let errMsg = `Request failed with status ${response.status}`;
          try {
            const data = (await response.json()) as { error?: string };
            if (data.error) errMsg = data.error;
          } catch {
            // ignore
          }
          throw new ApiError(errMsg, response.status);
        }

        if (!response.body) {
          throw new Error("No response body from chat stream.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let assistantRaw = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            const line = part
              .split("\n")
              .map((l) => l.trim())
              .find((l) => l.startsWith("data:"));
            if (!line) continue;

            const jsonStr = line.replace(/^data:\s*/, "");
            if (!jsonStr) continue;

            let payload: {
              text?: string;
              suggestions?: string[];
              done?: boolean;
              error?: string;
            };
            try {
              payload = JSON.parse(jsonStr) as typeof payload;
            } catch {
              continue;
            }

            if (payload.error) {
              setStreamError(payload.error);
            }

            if (typeof payload.text === "string" && payload.text.length > 0) {
              setWaitingForFirstToken(false);
              assistantRaw += payload.text;
              const display = stripSuggestionsTrailer(assistantRaw);
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last?.role === "assistant") {
                  next[next.length - 1] = {
                    ...last,
                    content: display,
                    timestamp: last.timestamp || nowIso(),
                  };
                }
                return next;
              });
            }

            if (payload.done) {
              if (Array.isArray(payload.suggestions)) {
                setSuggestions(
                  payload.suggestions
                    .filter((s): s is string => typeof s === "string")
                    .slice(0, 3),
                );
              }
              setMessages((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last?.role === "assistant") {
                  next[next.length - 1] = {
                    ...last,
                    content: stripSuggestionsTrailer(assistantRaw),
                  };
                }
                return next;
              });
            }
          }
        }

        void queryClient.invalidateQueries({ queryKey: ["conversations"] });
        void queryClient.invalidateQueries({
          queryKey: ["conversations", conversationId],
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          // Keep partial assistant text if any tokens arrived (server persists on stop).
          // Otherwise drop the optimistic turn so history stays clean.
          setMessages((prev) => {
            const next = [...prev];
            const last = next[next.length - 1];
            if (last?.role === "assistant" && !last.content.trim()) {
              next.pop();
              if (next[next.length - 1]?.role === "user") next.pop();
            }
            return next;
          });
        } else {
          const msg =
            error instanceof Error ? error.message : "Chat failed.";
          setStreamError(msg);
          // Request failed before persist — remove optimistic turn
          setMessages((prev) => {
            const next = [...prev];
            if (next[next.length - 1]?.role === "assistant") next.pop();
            if (next[next.length - 1]?.role === "user") next.pop();
            return next;
          });
        }
      } finally {
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
        setIsStreaming(false);
        setWaitingForFirstToken(false);
      }
    },
    [queryClient],
  );

  return {
    messages,
    setMessages,
    isStreaming,
    waitingForFirstToken,
    suggestions,
    streamError,
    sendMessage,
    stopStream,
    clearSuggestions,
  };
}
