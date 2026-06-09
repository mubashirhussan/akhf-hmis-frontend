'use client';

/** Pass-through until Redux or other global store is added. */
export default function StoreProvider({ children }) {
  return children;
}
