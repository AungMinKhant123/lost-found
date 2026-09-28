import { useEffect, useState } from "react";
import { getCategories, getColours } from "../services/api";

// Loads the admin-managed categories and colours so every page that
// shows them (New Post, Item List, Manage Listings) reads the same live
// list instead of its own hard-coded copy. It fetches on mount, so after
// an admin adds, renames or deletes a value, the next time one of those
// pages opens it shows the change.
export function useAttributes() {
  const [categories, setCategories] = useState([]);
  const [colours, setColours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    Promise.all([getCategories(), getColours()])
      .then(([categoryData, colourData]) => {
        if (cancelled) return;
        setCategories(categoryData);
        setColours(colourData);
      })
      .catch((err) => console.error("Failed to load categories/colours:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, colours, loading };
}
