import { useMemo } from 'react';
import dayjs from 'dayjs';

type Nested<T> = T | NestedArray<T> | NestedObject<T>;
type NestedArray<T> = T[] | null | undefined;
type NestedObject<T> = { [key: string]: Nested<T> };

/**
 * * Custom hook to filter and sort an array of objects by a date property for the current year.
 * * The hook makes a copy of the source array so that the original array would not be mutated
 * @template T - The type of the objects in the input array.
 * @param items - The array of objects to filter and sort. Can be null or undefined.
 * @param dateKey - The key in each object that contains the date-time string.
 * @param sortOrder - Optional. The sort order, either 'asc' for ascending or 'desc' for descending. Defaults to 'asc'.
 * @returns A filtered and sorted array of objects that occur in the current year, or an empty array if no matches.
 */

function useSortByDateForCurrentYear<T>(
  items: T[] | null | undefined,
  dateKey: keyof {
    [K in keyof T as T[K] extends Date | string | null | undefined
      ? K
      : never]: T[K];
  },

  sortOrder: 'asc' | 'desc' = 'asc'
): T[] {
  return useMemo(() => {
    if (!items || items.length === 0) return [];

    return [...items]
      .filter((item) => {
        const dateValue = item[dateKey] as string | Date | null | undefined;
        return dateValue ? dayjs(dateValue).isSame(dayjs(), 'year') : true;
      })
      .sort((a, b) => {
        const dateA = a[dateKey] as string | Date | null | undefined;
        const dateB = b[dateKey] as string | Date | null | undefined;

        // Handle null/undefined values: place them at the end
        if (!dateA && !dateB) return 0; // Both are null/undefined, considered equal
        if (!dateA) return sortOrder === 'asc' ? 1 : -1; // `a` is null, `b` comes first
        if (!dateB) return sortOrder === 'asc' ? -1 : 1; // `b` is null, `a` comes first

        // Both dates are valid, compare them
        const isAfter = dayjs(dateA).isAfter(dayjs(dateB));
        return sortOrder === 'asc' ? (isAfter ? 1 : -1) : isAfter ? -1 : 1;
      });
  }, [items, dateKey, sortOrder]);
}

export default useSortByDateForCurrentYear;
