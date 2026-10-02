import { books } from "../data/books";
import { store } from "../data/store";
import type { Book } from "../types";

export function getBook(id: string): Book | undefined {
  return books.find((book) => book.id === id);
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat(store.locale, {
    style: "currency",
    currency: store.currency,
  }).format(amount);
}

export function categoryLabel(book: Book): string {
  if (book.category === "fiction") return "Fiction";
  if (book.topic === "self-development") return "Non-fiction · Self-Development";
  if (book.topic === "financial-literacy") return "Non-fiction · Financial Literacy";
  return "Non-fiction";
}

export function stockLabel(book: Book): string {
  return book.inStock ? "In Stock" : "Out of Stock";
}

type FilterOptions = {
  stock?: "in" | "out";
  q?: string;
  category?: string | null;
  topic?: string | null;
};

export function filterBooks(options: FilterOptions): Book[] {
  const query = options.q?.trim().toLowerCase() ?? "";

  return books.filter((book) => {
    if (options.stock === "in" && !book.inStock) return false;
    if (options.stock === "out" && book.inStock) return false;
    if (query) {
      const haystack = `${book.title} ${book.author}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    if (options.category === "fiction" && book.category !== "fiction") return false;
    if (options.category === "nonfiction" && book.category !== "nonfiction") return false;
    if (
      options.category === "nonfiction" &&
      options.topic === "self-development" &&
      book.topic !== "self-development"
    ) {
      return false;
    }
    if (
      options.category === "nonfiction" &&
      options.topic === "financial-literacy" &&
      book.topic !== "financial-literacy"
    ) {
      return false;
    }
    return true;
  });
}

export function bestSellers(): Book[] {
  return books
    .filter((book) => book.unitsSold > 0)
    .sort((a, b) => b.unitsSold - a.unitsSold);
}

export type OrderMessageLine = {
  title: string;
  quantity: number;
  price: number;
  lineTotal: number;
};

export function buildOrderMessage(input: {
  name: string;
  address: string;
  homeDelivery: boolean;
  note: string;
  lines: OrderMessageLine[];
  total: number;
}): string {
  const delivery = input.homeDelivery ? "Yes (extra fees may apply)" : "No";
  const books = input.lines
    .map(
      (line) =>
        `${line.title}\n${line.quantity} × ${formatMoney(line.price)}\n${formatMoney(line.lineTotal)}`,
    )
    .join("\n\n");
  const parts = [
    `${store.name} order`,
    "Thank you for your order. Please confirm the books and the final price.",
    `Name: ${input.name.trim()}`,
    `Address:\n${input.address.trim()}`,
    `Home delivery: ${delivery}`,
    `Books\n${books}`,
    `Total: ${formatMoney(input.total)}`,
  ];
  if (input.note.trim()) parts.push(`Note:\n${input.note.trim()}`);
  return parts.join("\n\n");
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${store.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string) {
  const link = document.createElement("a");
  link.href = buildWhatsAppUrl(message);
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  link.remove();
}
