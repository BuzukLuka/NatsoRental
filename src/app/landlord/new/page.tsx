"use client";
import Input from "@/components/ui/Input";

export default function NewListingPage() {
  async function submit(formData: FormData) {
    // Handle form submission here (e.g., send to API)
    const title = String(formData.get("title") || "");
    const priceMonthly = Number(formData.get("price") || 0);
    // Example: console.log({ title, priceMonthly });
  }
  return (
    <div className="mx-auto max-w-2xl p-4">
      <h1 className="text-2xl font-extrabold">Create Listing</h1>
      <form action={submit} className="mt-4 grid gap-3">
        <Input name="title" label="Title" required />
        <Input name="price" label="Monthly price" type="number" required />
        <button className="btn btn-primary">Create</button>
      </form>
    </div>
  );
}
