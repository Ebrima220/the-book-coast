import type { Book } from "../types";

export function BookCover({
  book,
  className = "h-24 w-16",
}: {
  book: Book;
  className?: string;
}) {
  return (
    <img
      src={book.cover}
      alt=""
      className={`shrink-0 rounded-sm bg-sea object-cover ${className}`}
    />
  );
}
