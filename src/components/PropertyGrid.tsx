import PropertyCard from "./PropertyCard";
import type { Property } from "@/types";

export default function PropertyGrid({ items }: { items: Property[] }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => (
        <PropertyCard key={p.id} p={p} />
      ))}
      {items.length === 0 && (
        <div className="p-6 text-black/60">No results. Adjust filters.</div>
      )}
    </div>
  );
}
