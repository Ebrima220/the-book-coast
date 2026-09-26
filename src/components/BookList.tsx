import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { categoryLabel, formatMoney, stockLabel } from "../lib/catalog";
import type { Book } from "../types";
import { BookCover } from "./BookCover";

export function BookList({
  books,
  empty,
}: {
  books: Book[];
  empty: string;
}) {
  if (books.length === 0) {
    return <p className="mt-6">{empty}</p>;
  }

  return (
    <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </ul>
  );
}

function BookCard({ book }: { book: Book }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <li className="group flex flex-col rounded-xl border border-line bg-white dark:border-white/10 dark:bg-[#1c2622]">
      <Link to={`/books/${book.id}`} className="flex flex-1 flex-col text-inherit no-underline">
        <span className="flex justify-center px-4 pt-4">
          <BookCover book={book} className="h-48 w-32" />
        </span>
        <span className="flex flex-1 flex-col px-4 pt-3">
          <span className="font-serif text-lg leading-snug">{book.title}</span>
          <span className="mt-1 text-sm">{book.author}</span>
          <span className="mt-2 text-sm">
            {formatMoney(book.price)} · {stockLabel(book)}
          </span>
          <span className="mt-1 text-xs text-ink/70 dark:text-[#f3efe6]/70">
            {categoryLabel(book)}
          </span>
          <span className="mt-3 text-sm leading-6">{book.description}</span>
        </span>
      </Link>
      <div className="px-4 pt-3 pb-4 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:transition-opacity [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-within:opacity-100">
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
