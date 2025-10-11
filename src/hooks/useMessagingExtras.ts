import { useMutation } from "@tanstack/react-query";
import api from "@/lib/client";
import type { Conversation } from "@/types/messages";

export function useStartSupportChat() {
  return useMutation({
    mutationFn: async () =>
      (await api.post("/chat/conversations/start-support/"))
        .data as Conversation,
  });
}

export function useStartChatWithRoom() {
  return useMutation({
    mutationFn: async (payload: { room_slug?: string; room_id?: number }) =>
      (await api.post("/chat/conversations/start-with-room/", payload))
        .data as Conversation,
  });
}
