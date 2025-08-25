export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="text-2xl font-extrabold">Policies</h1>
      <ul className="mt-2 list-disc pl-5 text-black/80">
        <li>Deposit is refundable minus penalties (lost keys, damages).</li>
        <li>Late rent fee: $25 after 3 days.</li>
        <li>No smoking indoors.</li>
      </ul>
    </div>
  );
}
