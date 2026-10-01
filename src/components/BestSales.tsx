import { useId, useState } from "react";
import { Link } from "react-router-dom";
import { bestSellers } from "../lib/catalog";
import { BookCover } from "./BookCover";

export function BestSales({ onNavigate }: { onNavigate?: () => void }) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const sellers = bestSellers();

  return (
    <section className="mt-6 flex min-h-0 flex-1 flex-col">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full shrink-0 items-center justify-between rounded-md px-3 py-2 text-left font-serif text-lg text-foam hover:bg-black/15"
      >
        Best Sales
        <Chevron open={open} />
      </button>
      {open ? (
        sellers.length === 0 ? (
          <p id={listId} className="mt-3 px-3 text-sm">
            No sales are recorded.
          </p>
        ) : (
          <ol id={listId} className="mt-3 min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain">
            {sellers.map((book) => (
              <li key={book.id}>
                <Link
                  to={`/books/${book.id}`}
                  onClick={onNavigate}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-foam no-underline hover:bg-black/15"
                >
                  <BookCover book={book} className="h-12 w-8" />
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{book.title}</span>
                    <span className="block text-sm text-foam/90">{book.unitsSold} sold</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )
      ) : null}
    </section>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={`h-4 w-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
