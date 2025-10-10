import { RoomList } from "@/types/api";
import PropertyCard from "./PropertyCard";

export default function PropertyGrid({ items }: { items: RoomList[] }) {
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
