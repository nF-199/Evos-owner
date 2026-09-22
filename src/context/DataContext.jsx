import React, {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import { toast } from "react-toastify";
import { api } from "../utils/api";

const DataContext = createContext(null);

const RESOURCES = ["orders", "products", "categories", "workers", "expenses"];
const POLL_MS = 15000;

export const DataProvider = ({ children }) => {
  const [data, setData] = useState({
    orders: [], products: [], categories: [], workers: [], expenses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastSync, setLastSync] = useState(null);
  const mounted = useRef(true);

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    try {
      const results = await Promise.all(RESOURCES.map((r) => api.list(r)));
      if (!mounted.current) return;
      setData(Object.fromEntries(RESOURCES.map((r, i) => [r, results[i] ?? []])));
      setError(null);
      setLastSync(new Date());
    } catch (err) {
      if (!mounted.current) return;
      setError(err);
      if (!silent) toast.error("Serverga ulanib bo'lmadi");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    load();
    const id = setInterval(() => load({ silent: true }), POLL_MS);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [load]);

  // CRUD — optimistik emas, ataylab: json-server javobini kutamiz va state'ni yangilaymiz.
  const createItem = useCallback(async (resource, body) => {
    const created = await api.create(resource, body);
    setData((prev) => ({ ...prev, [resource]: [...prev[resource], created] }));
    return created;
  }, []);

  const updateItem = useCallback(async (resource, id, body) => {
    const updated = await api.update(resource, id, body);
    setData((prev) => ({
      ...prev,
      [resource]: prev[resource].map((item) => (String(item.id) === String(id) ? updated : item)),
    }));
    return updated;
  }, []);

  const removeItem = useCallback(async (resource, id) => {
    await api.remove(resource, id);
    setData((prev) => ({
      ...prev,
      [resource]: prev[resource].filter((item) => String(item.id) !== String(id)),
    }));
  }, []);

  const value = useMemo(
    () => ({ ...data, loading, error, lastSync, refresh: load, createItem, updateItem, removeItem }),
    [data, loading, error, lastSync, load, createItem, updateItem, removeItem]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData faqat <DataProvider> ichida ishlaydi");
  return ctx;
};
