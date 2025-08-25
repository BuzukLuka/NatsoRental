"use client";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const { login } = useStore();
  async function submit(formData: FormData) {
    login({
      email: String(formData.get("email") || ""),
      role: String(formData.get("role") || "renter") as any,
    });
  }
  return (
    <div className="mx-auto max-w-sm p-4">
      <h1 className="text-2xl font-extrabold">Sign in</h1>
      <form action={submit} className="mt-4 grid gap-3">
        <Input name="email" label="Email" type="email" required />
        <Select
          name="role"
          label="Role"
          options={[
            { label: "Renter", value: "renter" },
            { label: "Landlord", value: "landlord" },
            { label: "Investor", value: "investor" },
          ]}
        />
        <button className="btn btn-primary">Sign in</button>
      </form>
    </div>
  );
}
