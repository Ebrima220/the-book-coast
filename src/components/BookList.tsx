import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatMoney, stockLabel } from "../lib/catalog";
import type { Book } from "../types";
import { BookCover } from "./BookCover";

const SAVED_KEY = "book-coast-saved";

const panels = [
  "bg-[#d9e6ff] dark:bg-[#24344a]",
  "bg-[#e4e0fb] dark:bg-[#2c2a44]",
  "bg-[#e7eef2] dark:bg-[#24302e]",
  "bg-[#d7f0e8] dark:bg-[#1c3a34]",
  "bg-[#f6e6dc] dark:bg-[#3a2e28]",
];

export function BookList({
  books,
  empty,
}: {
  books: Book[];
  empty: string;
}) {
  const [saved, setSaved] = useState<string[]>([]);

  useEffect(() => {
    setSaved(readSaved());
  }, []);

  function toggleSaved(bookId: string) {
    setSaved((current) => {
      const next = current.includes(bookId)
        ? current.filter((id) => id !== bookId)
        : [...current, bookId];
      localStorage.setItem(SAVED_KEY, JSON.stringify(next));
      return next;
    });
  }

  if (books.length === 0) {
    return <p className="mt-6">{empty}</p>;
  }

  const rows = splitRows(books);

  return (
    <div className="mt-6 space-y-8">
      {rows.map((row, rowIndex) => (
        <BookRow
          key={row.map((book) => book.id).join("-")}
          books={row}
          rowIndex={rowIndex}
          saved={saved}
          onSave={toggleSaved}
        />
      ))}
    </div>
  );
}

function BookRow({
  books,
  rowIndex,
  saved,
  onSave,
}: {
  books: Book[];
  rowIndex: number;
  saved: string[];
  onSave: (bookId: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const copies = loopCopies(books.length);
  const loop = Array.from({ length: copies }, () => books).flat();
  const rowKey = books.map((book) => book.id).join("|");

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const setWidth = () => el.scrollWidth / copies;

    const jumpToMiddle = () => {
      el.scrollLeft = setWidth();
    };

    jumpToMiddle();

    const onScroll = () => {
      const width = setWidth();
      if (width <= 0) return;
      if (el.scrollLeft < width * 0.5) el.scrollLeft += width;
      else if (el.scrollLeft >= width * 1.5) el.scrollLeft -= width;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", jumpToMiddle);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", jumpToMiddle);
    };
  }, [rowKey]);

  return (
    <div
      ref={scrollerRef}
      className="@container touch-pan-x overflow-x-auto overflow-y-hidden"
      aria-label={`Book row ${rowIndex + 1}`}
    >
      <ul className="flex w-max gap-4">
        {loop.map((book, index) => (
          <BookCard
            key={`${book.id}-${index}`}
            book={book}
            panel={panels[(rowIndex + index) % panels.length]}
            saved={saved.includes(book.id)}
            onSave={() => onSave(book.id)}
          />
        ))}
      </ul>
    </div>
  );
}

function BookCard({
  book,
  panel,
  saved,
  onSave,
}: {
  book: Book;
  panel: string;
  saved: boolean;
  onSave: () => void;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <li className="group flex w-[calc((100cqw-2rem)/2.2)] min-w-0 shrink-0 flex-col overflow-hidden md:w-60">
      <Link to={`/books/${book.id}`} className="block w-full min-w-0 text-inherit no-underline">
        <span className={`flex w-full justify-center rounded-2xl px-6 py-8 ${panel}`}>
          <BookCover book={book} className="h-44 w-28 shadow-[0_16px_24px_rgba(28,25,21,0.22)]" />
        </span>
      </Link>
      <div className="mt-3 flex items-start gap-3">
        <Link to={`/books/${book.id}`} className="block min-w-0 flex-1 text-inherit no-underline">
          <span className="block truncate font-semibold">{book.title}</span>
          <span className="mt-0.5 block truncate text-sm text-ink/60 dark:text-[#f3efe6]/60">
            {book.description}
          </span>
        </Link>
        <button
          type="button"
          className="mt-0.5 shrink-0 text-ink/70 dark:text-[#f3efe6]/70"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${book.title} from saved books` : `Save ${book.title}`}
          onClick={onSave}
        >
          <HeartIcon filled={saved} />
        </button>
      </div>
      <p className="mt-2 text-sm">
        {formatMoney(book.price)} · {stockLabel(book)}
      </p>
      <div className="pt-3 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:transition-opacity [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100">
        {book.inStock ? (
          <button
            type="button"
            className="w-full rounded-md bg-clay px-3 py-2 text-sm font-semibold text-white"
            onClick={() => {
              add(book.id);
              setAdded(true);
            }}
          >
            {added ? "Added to cart" : "Add to cart"}
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="w-full rounded-md bg-ink/15 px-3 py-2 text-sm font-semibold text-ink/60 dark:bg-white/10 dark:text-white/50"
          >
            Out of Stock
          </button>
        )}
      </div>
    </li>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        d="M12 20s-7-4.4-7-9a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4.6-7 9-7 9z"
      />
    </svg>
  );
}

function splitRows(books: Book[]): Book[][] {
  const count = Math.min(5, Math.max(1, Math.floor(books.length / 3)));
  const rows = Array.from({ length: count }, () => [] as Book[]);
  books.forEach((book, index) => {
    rows[index % count].push(book);
  });
  return rows;
}

function loopCopies(count: number): number {
  if (count >= 3) return 3;
  if (count === 2) return 6;
  return 12;
}

function readSaved(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    return [];
  }
}
