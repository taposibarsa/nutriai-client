"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { ConversationList } from "@/components/coach/ConversationList";
import { ChatWindow } from "@/components/coach/ChatWindow";
import {
  useChatStream,
  useConversations,
  useConversation,
  useCreateConversation,
  useDeleteConversation,
} from "@/hooks/useChat";
import { useSavedMealPlans } from "@/hooks/useMealPlans";
import { ApiError } from "@/lib/api";

export default function CoachPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [linkedPlanId, setLinkedPlanId] = useState<string>("");
  /** Only hydrate messages from GET when switching conversations — not after stream refetch. */
  const hydratedIdRef = useRef<string | null>(null);

  const listQuery = useConversations();
  const detailQuery = useConversation(activeId);
  const createConv = useCreateConversation();
  const deleteConv = useDeleteConversation();
  const savedPlans = useSavedMealPlans();

  const {
    messages,
    setMessages,
    isStreaming,
    waitingForFirstToken,
    suggestions,
    streamError,
    sendMessage,
    stopStream,
    clearSuggestions,
  } = useChatStream();

  const conversations = listQuery.data?.data ?? [];
  const plans = savedPlans.data?.data ?? [];

  useEffect(() => {
    if (!activeId && conversations.length > 0 && !listQuery.isLoading) {
      setActiveId(conversations[0]!._id);
    }
  }, [activeId, conversations, listQuery.isLoading]);

  useEffect(() => {
    if (!detailQuery.data || isStreaming) return;
    if (detailQuery.data._id !== activeId) return;

    const linked = detailQuery.data.activeMealPlanId
      ? String(detailQuery.data.activeMealPlanId)
      : "";
    setLinkedPlanId(linked);

    // Skip re-hydration after SSE completes (invalidation) so suggestion chips stay
    if (hydratedIdRef.current === activeId) return;

    hydratedIdRef.current = activeId;
    setMessages(
      detailQuery.data.messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp:
          typeof m.timestamp === "string"
            ? m.timestamp
            : new Date(m.timestamp).toISOString(),
      })),
    );
    clearSuggestions();
  }, [
    detailQuery.data,
    activeId,
    isStreaming,
    setMessages,
    clearSuggestions,
  ]);

  const ensureConversation = useCallback(async (): Promise<string | null> => {
    if (activeId) return activeId;
    try {
      const created = await createConv.mutateAsync();
      hydratedIdRef.current = created._id;
      setActiveId(created._id);
      setMessages([]);
      clearSuggestions();
      return created._id;
    } catch (error) {
      const msg =
        error instanceof ApiError ? error.message : "Could not start chat.";
      toast.error(msg);
      return null;
    }
  }, [activeId, createConv, setMessages, clearSuggestions]);

  async function handleNewChat() {
    try {
      const created = await createConv.mutateAsync();
      hydratedIdRef.current = created._id;
      setActiveId(created._id);
      setMessages([]);
      clearSuggestions();
      setLinkedPlanId("");
    } catch (error) {
      const msg =
        error instanceof ApiError ? error.message : "Could not create chat.";
      toast.error(msg);
    }
  }

  async function handleSelect(id: string) {
    if (id === activeId) return;
    if (isStreaming) stopStream();
    hydratedIdRef.current = null;
    setActiveId(id);
    setMessages([]);
    clearSuggestions();
  }

  async function handleDelete(id: string) {
    try {
      await deleteConv.mutateAsync(id);
      if (activeId === id) {
        hydratedIdRef.current = null;
        setActiveId(null);
        setMessages([]);
        clearSuggestions();
        setLinkedPlanId("");
      }
      toast.success("Conversation deleted");
    } catch (error) {
      const msg =
        error instanceof ApiError ? error.message : "Delete failed.";
      toast.error(msg);
    }
  }

  async function handleSend(message: string) {
    const id = await ensureConversation();
    if (!id) return;
    await sendMessage(id, message, linkedPlanId || null);
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4.5rem)] max-w-7xl flex-col gap-0 overflow-hidden border-t border-forest/10 lg:flex-row">
      <aside className="flex max-h-[40vh] w-full shrink-0 flex-col border-b border-forest/10 bg-card lg:max-h-none lg:w-[280px] lg:border-r lg:border-b-0">
        <ConversationList
          conversations={conversations}
          activeId={activeId}
          onSelect={handleSelect}
          onDelete={handleDelete}
          onNewChat={handleNewChat}
          creating={createConv.isPending}
          loading={listQuery.isLoading}
        />
        <div className="shrink-0 border-t border-forest/10 p-3">
          <label
            htmlFor="link-meal-plan"
            className="mb-1 block text-[11px] font-medium tracking-wide text-warm-gray uppercase"
          >
            Link Active Meal Plan
          </label>
          <select
            id="link-meal-plan"
            value={linkedPlanId}
            onChange={(e) => setLinkedPlanId(e.target.value)}
            className="w-full rounded-lg border border-forest/15 bg-white px-2 py-2 text-xs text-foreground outline-none focus:border-forest/40"
          >
            <option value="">None</option>
            {plans.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </aside>

      <main className="min-h-0 min-w-0 flex-1">
        {detailQuery.isLoading && activeId && messages.length === 0 ? (
          <div className="flex h-full animate-pulse flex-col gap-4 px-4 py-6 sm:px-6">
            <div className="ml-auto h-16 w-2/3 rounded-2xl bg-gray-200" />
            <div className="h-24 w-3/4 rounded-2xl bg-gray-200" />
            <div className="ml-auto h-12 w-1/2 rounded-2xl bg-gray-200" />
            <div className="h-20 w-2/3 rounded-2xl bg-gray-200" />
          </div>
        ) : (
          <ChatWindow
            messages={messages}
            isStreaming={isStreaming}
            waitingForFirstToken={waitingForFirstToken}
            suggestions={suggestions}
            streamError={streamError}
            onSend={handleSend}
            onStop={stopStream}
            onStarter={handleSend}
          />
        )}
      </main>
    </div>
  );
}
