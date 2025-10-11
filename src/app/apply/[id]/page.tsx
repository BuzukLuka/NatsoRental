"use client";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function ApplyPage() {
  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-extrabold">Application & Screening</h1>
      <p className="text-sm text-black/70">For: [Property Title]</p>

      <form className="mt-6 grid gap-4">
        <Input name="fullName" label="Full name" required />
        <Input name="email" label="Email" type="email" required />
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
