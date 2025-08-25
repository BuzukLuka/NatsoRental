"use client";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function ApplyPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { getPropertyById, submitApplication, me } = useStore();
  const p = getPropertyById(id);
  if (!p) return <div className="p-6">Not found.</div>;

  async function onSubmit(formData: FormData) {
    if (!p) return;
    const payload = {
      propertyId: p.id,
      fullName: String(formData.get("fullName") || ""),
      email: String(formData.get("email") || ""),
      idNumber: String(formData.get("idNumber") || ""),
      references: String(formData.get("references") || ""),
      moveIn: String(formData.get("moveIn") || ""),
    };
    submitApplication(payload);
    router.push(`/reservation/${p.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-extrabold">Application & Screening</h1>
      <p className="text-sm text-black/70">For: {p.title}</p>

      <form action={onSubmit} className="mt-6 grid gap-4">
        <Input
          name="fullName"
          label="Full name"
          defaultValue={me?.name || ""}
          required
        />
        <Input
          name="email"
          label="Email"
          defaultValue={me?.email || ""}
          type="email"
          required
        />
        <Input name="idNumber" label="Government ID #" required />
        <Input
          name="references"
          label="Reference contact"
          placeholder="Name, phone/email"
        />
        <Input name="moveIn" label="Preferred move‑in date" type="date" />
        <Select
          name="tenure"
          label="Term"
          options={[
            { label: "Mid-term (3–6 mo)", value: "mid" },
            { label: "Long-term (6+ mo)", value: "long" },
          ]}
        />
        <button className="btn btn-primary">Submit and continue →</button>
      </form>

      <div className="mt-6 rounded-xl bg-yellow-50 p-4 text-sm">
        <strong>Privacy:</strong> Your data is used only for screening by the
        landlord. You can request deletion anytime.
      </div>
    </div>
  );
}
