import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createOrder,
  emptyData,
  nextStatus,
  parseData,
  updateQuantity,
  type StoreData,
} from "./domain";
const KEY = "vitrine.store.v1";
type Store = {
  data: StoreData;
  ready: boolean;
  busy: boolean;
  error: string;
  quantity: (id: string, delta: number) => Promise<void>;
  checkout: (name: string, note: string) => Promise<boolean>;
  advance: (id: string) => Promise<void>;
  reset: () => Promise<void>;
};
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState(emptyData);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const current = useRef(data);
  const locked = useRef(false);
  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        const parsed = parseData(raw);
        if (active) {
          current.current = parsed;
          setData(parsed);
        }
      })
      .catch(() => {
        if (active)
          setError(
            "Não foi possível carregar os dados locais. Você pode limpar a demonstração na aba Loja.",
          );
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);
  async function commit(transform: (previous: StoreData) => StoreData) {
    if (!ready || locked.current) return false;
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      const next = transform(current.current);
      await AsyncStorage.setItem(KEY, JSON.stringify(next));
      current.current = next;
      setData(next);
      return true;
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível salvar. Tente novamente.",
      );
      return false;
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  const value: Store = {
    data,
    ready,
    busy,
    error,
    quantity: async (id, delta) => {
      await commit((previous) => ({
        ...previous,
        cart: updateQuantity(
          previous.cart,
          id,
          (previous.cart[id] ?? 0) + delta,
        ),
      }));
    },
    checkout: (name, note) =>
      commit((previous) => {
        if (previous.orders.length >= 100)
          throw new Error(
            "Limite de 100 pedidos demonstrativos. Limpe a demonstração na aba Loja.",
          );
        const order = createOrder(
          previous.cart,
          name,
          note,
          `VT-${Date.now().toString(36).toUpperCase()}`,
          new Date().toISOString(),
        );
        return { ...previous, cart: {}, orders: [order, ...previous.orders] };
      }),
    advance: async (id) => {
      await commit((previous) => ({
        ...previous,
        orders: previous.orders.map((order) =>
          order.id === id
            ? { ...order, status: nextStatus(order.status) }
            : order,
        ),
      }));
    },
    reset: async () => {
      await commit(emptyData);
    },
  };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useStore() {
  const context = useContext(Context);
  if (!context) throw new Error("StoreProvider ausente");
  return context;
}
