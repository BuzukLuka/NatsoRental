// types/messages.ts
export type ConversationMember = {
  id: number;
  user: number;
  user_name: string;
  user_avatar: string | null;
  joined_at: string;
  last_read_at: string | null;
  is_muted: boolean;
};

export type Conversation = {
  id: number;
  title: string | null;
  created_at: string;
  updated_at: string;
  members: ConversationMember[];
  last_message: {
    id: number;
    sender: string;
    body: string;
    created_at: string;
  } | null;
  unread_count: number;
};

export type Message = {
  id: number;
  conversation: number;
  sender: number;
  sender_name: string;
  body: string;
  created_at: string;
  edited_at: string | null;
  is_deleted: boolean;
  attachments: { id: number; file: string; uploaded_at: string }[];
};
