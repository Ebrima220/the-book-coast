import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { getBook } from "../lib/catalog";
import type { CartItem } from "../types";

type CartContextValue = {
  items: CartItem[];
  count: number;
  add: (bookId: string) => void;
  setQuantity: (bookId: string, quantity: number) => void;
  remove: (bookId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "book-coast-cart";

function readCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (typeof item !== "object" || item === null) return [];
      const record = item as { bookId?: unknown; quantity?: unknown };
      if (typeof record.bookId !== "string") return [];
      if (typeof record.quantity !== "number" || record.quantity < 1) return [];
      return [{ bookId: record.bookId, quantity: Math.floor(record.quantity) }];
    });
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, ready]);

  const value = useMemo<CartContextValue>(() => {
    return {
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      add(bookId) {
        const book = getBook(bookId);
        if (!book?.inStock) return;
        setItems((current) => {
          const existing = current.find((item) => item.bookId === bookId);
          if (!existing) return [...current, { bookId, quantity: 1 }];
          return current.map((item) =>
            item.bookId === bookId
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        });
      },
      setQuantity(bookId, quantity) {
        setItems((current) => {
          if (quantity < 1) return current.filter((item) => item.bookId !== bookId);
          const book = getBook(bookId);
          return current.map((item) => {
            if (item.bookId !== bookId) return item;
            const next = Math.floor(quantity);
            if (book && !book.inStock && next > item.quantity) return item;
            return { ...item, quantity: next };
          });
        });
      },
      remove(bookId) {
        setItems((current) => current.filter((item) => item.bookId !== bookId));
      },
      clear() {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used within CartProvider");
  return value;
}
