"use client";
import { useStore } from "@/lib/store";
import Input from "@/components/ui/Input";

export default function MaintenancePage() {
  const { maintenance, createTicket } = useStore();
  async function submit(formData: FormData) {
    createTicket({ title: String(formData.get("title") || "") });
  }
  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-extrabold">Maintenance</h1>
      <form action={submit} className="mt-4 flex gap-2">
        <Input name="title" placeholder="Describe the issue" required />
        <button className="btn btn-primary">Submit</button>
      </form>
      <ul className="mt-4 space-y-2 text-sm">
        {maintenance.map((t) => (
          <li key={t.id} className="card p-3">
            <div className="flex items-center justify-between">
              <strong>{t.title}</strong>
              <span className="badge">{t.status}</span>
            </div>
          </li>
        ))}
        {maintenance.length === 0 && (
          <li className="text-black/60">No tickets yet.</li>
        )}
      </ul>
    </div>
  );
}
