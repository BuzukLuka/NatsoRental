// app/messages/page.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkRead,
  useStartSupport, // POST /chat/conversations/start-support/
} from "@/hooks/useMessaging";
import { useAuth } from "@/providers/AuthProvider";
import { Send, MessageSquare, Plus, X, Search } from "lucide-react";
import api from "@/lib/client";

/* ---------- tiny UI helpers ---------- */
function cx(...c: Array<string | false | undefined>) {
  return c.filter(Boolean).join(" ");
}
function DayDivider({ label }: { label: string }) {
  return (
    <div className="my-3 flex items-center gap-3">
      <div className="h-[1px] flex-1 bg-black/10" />
      <div className="rounded-full bg-black/5 px-3 py-1 text-xs text-black/60">
        {label}
      </div>
      <div className="h-[1px] flex-1 bg-black/10" />
    </div>
  );
}
function formatDayLabel(d: string | Date) {
  const dt = new Date(d);
  const today = new Date();
  const yday = new Date();
  yday.setDate(today.getDate() - 1);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  if (sameDay(dt, today)) return "Today";
  if (sameDay(dt, yday)) return "Yesterday";
  return dt.toLocaleDateString();
}

/* ---------- New message modal ---------- */
function NewChatModal({
  open,
  onClose,
  onStartSupport,
  onStartWithUser, // optional future
}: {
  open: boolean;
  onClose: () => void;
  onStartSupport: () => Promise<void>;
  onStartWithUser?: (userId: number) => Promise<void>;
}) {
  // ⚠️ All hooks are called unconditionally to keep order stable
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<
    { id: number; name: string; avatar?: string | null }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [supportPending, setSupportPending] = useState(false);

  // Clear error whenever modal opens
  useEffect(() => {
    if (open) setErr(null);
  }, [open]);

  // ESC to close + body scroll lock only while open
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  async function doSearch(q: string) {
    setLoading(true);
    setErr(null);
    try {
      // Replace with your real endpoint if needed
      const res = await api.get(`/users/search/`, { params: { q } });
      setResults(res.data.results || []);
    } catch (e: any) {
      setResults([]);
      setErr(e?.message ?? "Search failed");
    } finally {
      setLoading(false);
    }
  }

  // Render nothing when closed (but hooks above still ran → order is stable)
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] pointer-events-auto"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="font-semibold">Start a new chat</div>
          <button
            className="btn btn-sm btn-outline"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <button
            onClick={async () => {
              try {
                setSupportPending(true);
                await onStartSupport();
              } finally {
                setSupportPending(false);
              }
            }}
            disabled={supportPending}
            className="w-full rounded-xl border border-black/10 bg-black px-3 py-2 text-sm font-medium text-white hover:translate-y-[-1px] hover:shadow-md disabled:opacity-60"
          >
            {supportPending ? "Starting…" : "Chat with Natso Rental Team"}
          </button>

          {/* Optional people search */}
          <div>
            <label className="mb-1 block text-sm font-medium text-black/80">
              Find a person (optional)
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                <input
                  className="w-full rounded-xl border border-black/10 pl-8 pr-3 py-2 text-sm focus:ring-2 focus:ring-brand-yellow"
                  placeholder="Search teammates, hosts, renters…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && search.trim()) {
                      doSearch(search.trim());
                    }
                  }}
                />
              </div>
              <button
                className="rounded-xl border border-black/10 bg-white px-3 text-sm font-medium hover:shadow"
                onClick={() => (search.trim() ? doSearch(search.trim()) : null)}
              >
                Search
              </button>
            </div>

            <div className="mt-2 max-h-56 overflow-y-auto space-y-2">
              {loading ? (
                <div className="text-sm text-black/60">Searching…</div>
              ) : results.length ? (
                results.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between rounded-xl border border-black/10 p-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative h-8 w-8 overflow-hidden rounded-full border border-black/10">
                        {u.avatar ? (
                          <Image
                            src={u.avatar}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center bg-black text-white">
                            <MessageSquare size={14} />
                          </div>
                        )}
                      </div>
                      <div className="truncate text-sm">{u.name}</div>
                    </div>
                    {onStartWithUser && (
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => onStartWithUser(u.id)}
                      >
                        Start
                      </button>
                    )}
                  </div>
                ))
              ) : search ? (
                <div className="text-sm text-black/60">No matches.</div>
              ) : (
                <div className="text-xs text-black/50">
                  Tip: You can skip this and just talk to Support.
                </div>
              )}
            </div>

            {err && (
              <div className="mt-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Main page ---------- */
export default function MessagesPage() {
  const { user, isAuthenticated } = useAuth();

  const { data: conversations } = useConversations();
  const [activeId, setActiveId] = useState<number | null>(null);

  const { data: msgs } = useMessages(activeId ?? undefined);
  const send = useSendMessage();
  const markRead = useMarkRead();
  const startSupport = useStartSupport(); // POST /chat/conversations/start-support/

  const [draft, setDraft] = useState("");
  const [newOpen, setNewOpen] = useState(false);

  const listRef = useRef<HTMLDivElement>(null);

  const activeConv = useMemo(
    () => conversations?.find((c: any) => c.id === activeId) || null,
    [conversations, activeId]
  );

  // pick “other” member for header
  const otherMember = useMemo(() => {
    if (!activeConv || !user) return null;
    return (
      activeConv.members.find((m: any) => m.user !== user.id) ||
      activeConv.members[0]
    );
  }, [activeConv, user]);

  // auto-select the first conversation on first load
  useEffect(() => {
    if (!activeId && conversations?.length) {
      setActiveId(conversations[0].id);
      markRead.mutate(conversations[0].id);
    }
  }, [conversations, activeId, markRead]);

  // auto scroll to bottom when messages or active chat changes
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [msgs, activeId]);

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-5xl px-4 pb-16 pt-8">
        <div className="rounded-2xl border border-black/10 bg-white p-6 text-center">
          Please log in to use messages.
        </div>
      </main>
    );
  }

  // Helpers for grouping & separators
  const isNewDay = (prev: any, cur: any) =>
    !prev ||
    new Date(prev.created_at).toDateString() !==
      new Date(cur.created_at).toDateString();
  const sameAuthor = (prev: any, cur: any) =>
    !!prev && prev.sender === cur.sender;

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16 pt-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold">Messages</h1>
          <p className="text-sm text-black/70">
            Chat with hosts, renters, or workers
          </p>
        </div>
        <button
          onClick={() => setNewOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm font-semibold transition hover:shadow"
        >
          <Plus size={16} />
          New message
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Sidebar */}
        <aside className="rounded-2xl border border-black/10 bg-white p-3">
          <div className="mb-2 text-xs font-semibold uppercase text-black/60">
            Conversations
          </div>
          <div className="flex flex-col gap-2">
            {conversations?.length ? (
              conversations.map((c: any) => {
                const other =
                  c.members.find((m: any) => m.user !== user?.id) ||
                  c.members[0];
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveId(c.id);
                      markRead.mutate(c.id);
                    }}
                    className={cx(
                      "flex items-center gap-3 rounded-xl border px-3 py-2 text-left transition hover:shadow",
                      c.id === activeId ? "border-black/20" : "border-black/10"
                    )}
                  >
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border border-black/10">
                      {other?.user_avatar ? (
                        <Image
                          src={other.user_avatar}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-black text-white">
                          <MessageSquare size={16} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">
                        {c.title || other?.user_name || `Chat #${c.id}`}
                      </div>
                      <div className="truncate text-xs text-black/60">
                        {c.last_message?.body || "No messages yet"}
                      </div>
                    </div>
                    {c.unread_count > 0 && (
                      <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-yellow px-1 text-[10px] font-bold text-black">
                        {c.unread_count}
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="text-sm text-black/60">No conversations yet.</div>
            )}
          </div>
        </aside>

        {/* Chat window */}
        <section className="md:col-span-2 rounded-2xl border border-black/10 bg-white flex min-h-[60vh] flex-col">
          {!activeConv ? (
            <div className="grid flex-1 place-items-center text-black/60">
              Select a conversation
            </div>
          ) : (
            <>
              <header className="flex items-center gap-3 border-b border-black/10 px-4 py-3">
                <div className="relative h-8 w-8 overflow-hidden rounded-full border border-black/10">
                  {otherMember?.user_avatar ? (
                    <Image
                      src={otherMember.user_avatar}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center bg-black text-white">
                      <MessageSquare size={16} />
                    </div>
                  )}
                </div>
                <div className="text-sm font-semibold">
                  {activeConv.title ||
                    otherMember?.user_name ||
                    `Chat #${activeConv.id}`}
                </div>
              </header>

              <div
                ref={listRef}
                className="flex-1 space-y-2 overflow-y-auto p-4"
              >
                {msgs?.length ? (
                  msgs.map((m: any, idx: number) => {
                    const prev = idx > 0 ? msgs[idx - 1] : null;
                    const mine = m.sender === user?.id;
                    const showDay = isNewDay(prev, m);
                    const grouped = sameAuthor(prev, m);

                    return (
                      <div key={m.id}>
                        {showDay && (
                          <DayDivider label={formatDayLabel(m.created_at)} />
                        )}

                        <div
                          className={cx(
                            "mb-[2px] flex",
                            mine ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cx(
                              "max-w-[75%] rounded-2xl px-3 py-2 text-sm",
                              mine
                                ? "bg-black text-white"
                                : "bg-black/5 text-black",
                              grouped ? "rounded-t-2xl" : ""
                            )}
                          >
                            {!grouped && !mine && (
                              <div className="mb-1 text-[11px] font-semibold text-black/60">
                                {otherMember?.user_name || "Partner"}
                              </div>
                            )}
                            <div className="whitespace-pre-wrap">{m.body}</div>
                            {!grouped && (
                              <div
                                className={cx(
                                  mine ? "text-white/70" : "text-black/50",
                                  "mt-1 text-[10px]"
                                )}
                              >
                                {new Date(m.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-black/60">Say hi 👋</div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!draft.trim() || !activeId) return;
                  const body = draft.trim();
                  setDraft(""); // optimistic clear
                  send.mutate({ conversation: activeId, body });
                }}
                className="flex items-center gap-2 border-t border-black/10 p-3"
              >
                <input
                  className="flex-1 rounded-xl border border-black/10 px-3 py-2 focus:ring-2 focus:ring-brand-yellow"
                  placeholder="Write a message…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (draft.trim() && activeId) {
                        const body = draft.trim();
                        setDraft("");
                        send.mutate({ conversation: activeId, body });
                      }
                    }
                  }}
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-black px-3 py-2 text-sm font-medium text-white hover:translate-y-[-1px] hover:shadow-md disabled:opacity-60"
                  disabled={send.isPending || !draft.trim()}
                >
                  <Send size={16} />
                  Send
                </button>
              </form>
            </>
          )}
        </section>
      </div>

      {/* New message modal */}
      <NewChatModal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onStartSupport={async () => {
          try {
            const conv = await startSupport.mutateAsync();
            if (conv?.id) {
              setActiveId(conv.id);
              markRead.mutate(conv.id);
            }
            setNewOpen(false);
          } catch {
            // TODO: toast error
          }
        }}
        onStartWithUser={async (_userId) => {
          // TODO: implement POST to your endpoint for direct chat with user
          // const res = await api.post("/chat/conversations/start-with-user/", { user_id: _userId });
          // setNewOpen(false); setActiveId(res.data.id); markRead.mutate(res.data.id);
        }}
      />
    </main>
  );
}
