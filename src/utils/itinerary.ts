/**
 * Itinerary and stay filtering utilities.
 */

export interface ChecklistItem {
  id: string;
  label: string;
  category: 'essentials' | 'gear' | 'documents';
  completed: boolean;
}

export function calculateChecklistProgress(items: { id: string; completed: boolean }[]): {
  total: number;
  completed: number;
  percentage: number;
} {
  if (!items || items.length === 0) {
    return { total: 0, completed: 0, percentage: 0 };
  }
  const completed = items.filter((item) => item.completed).length;
  const total = items.length;
  const percentage = Math.round((completed / total) * 100);
  return { total, completed, percentage };
}

export interface StayItem {
  id: string;
  title: string;
  location: string;
  category: string;
  pricePerNight: number;
  rating: number;
}

export function filterStays<T extends StayItem>(
  stays: T[],
  query: string,
  category: string,
  maxPrice?: number
): T[] {
  const cleanQuery = (query || '').trim().toLowerCase();
  const cleanCategory = (category || 'all').toLowerCase();

  return stays.filter((stay) => {
    const matchesCategory =
      cleanCategory === 'all' || stay.category.toLowerCase() === cleanCategory;

    const matchesQuery =
      !cleanQuery ||
      stay.title.toLowerCase().includes(cleanQuery) ||
      stay.location.toLowerCase().includes(cleanQuery);

    const matchesPrice = !maxPrice || stay.pricePerNight <= maxPrice;

    return matchesCategory && matchesQuery && matchesPrice;
  });
}
