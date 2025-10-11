// src/utils/queryParams.ts
import type { Filters } from "@/types";

export function buildRoomQuery(filters: Filters) {
  const params = new URLSearchParams();

  if (filters.q) params.append("search", filters.q);
  if (filters.priceMin !== undefined)
    params.append("min_price", String(filters.priceMin));
  if (filters.priceMax !== undefined)
    params.append("max_price", String(filters.priceMax));
  if (filters.type) params.append("type", filters.type);
  if (filters.tenure) params.append("tenure", filters.tenure);
  if (filters.petsAllowed) params.append("pets_allowed", "true");

  return params.toString();
}
