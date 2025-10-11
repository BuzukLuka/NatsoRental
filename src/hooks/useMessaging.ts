// hooks/useMessaging.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/client";
import type { Conversation, Message } from "@/types/messages";

export function useConversations() {
  return useQuery({
    queryKey: ["chat", "conversations"],
    queryFn: async (): Promise<Conversation[]> =>
      (await api.get("/chat/conversations/")).data,
  });
}

export function useMessages(conversationId?: number) {
  return useQuery({
    queryKey: ["chat", "messages", conversationId],
    queryFn: async (): Promise<Message[]> =>
      (
        await api.get("/chat/messages/", {
          params: { conversation: conversationId },
        })
      ).data,
    enabled: !!conversationId,
  });
}

export function useStartConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (user_id: number) =>
      (await api.post("/chat/conversations/start/", { user_id }))
        .data as Conversation,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["chat", "conversations"] }),
  });
}

export function useSendMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { conversation: number; body: string }) =>
      (await api.post("/chat/messages/", payload)).data as Message,
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({
        queryKey: ["chat", "messages", vars.conversation],
      });
      qc.invalidateQueries({ queryKey: ["chat", "conversations"] });
    },
  });
}

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: number) =>
      (await api.post(`/chat/conversations/${conversationId}/mark_read/`)).data,
    onSuccess: (_d, conversationId) => {
      qc.invalidateQueries({ queryKey: ["chat", "conversations"] });
      qc.invalidateQueries({ queryKey: ["chat", "messages", conversationId] });
    },
  });
}

export function useStartSupport() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.post("/chat/conversations/start-support/");
      return res.data; // { id, ... }
    },
  });
}
