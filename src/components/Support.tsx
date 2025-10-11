// anywhere (e.g. Header quick actions or Profile)
"use client";
import { Headset } from "lucide-react";
import { useStartSupportChat } from "@/hooks/useMessagingExtras";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";

function SupportButton() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const startSupport = useStartSupportChat();

  return (
    <button
      className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-sm hover:shadow"
      onClick={async () => {
        if (!isAuthenticated) return router.push("/login");
        try {
          const conv = await startSupport.mutateAsync();
          router.push(`/messages?c=${conv.id}`);
        } catch {}
      }}
      aria-label="Chat with Natso Rental Team"
      title="Chat with Natso Rental Team"
    >
      <Headset size={16} />
      Support
    </button>
  );
}

export default SupportButton;
