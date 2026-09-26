import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { books } from "../data/books";
import { quotes } from "../data/quotes";
import { BookCover } from "./BookCover";

export function Banner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches || quotes.length < 2) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % quotes.length);
    }, 15000);
    return () => window.clearInterval(id);
  }, []);

  if (quotes.length === 0) return null;

  const quote = quotes[index % quotes.length];
  const stocked = books.find(
    (book) => book.title.toLowerCase() === quote.book.toLowerCase(),
  );

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Lines from books"
      className="rounded-xl border border-line bg-white p-5 dark:border-white/10 dark:bg-[#1c2622]"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {stocked ? (
          <Link to={`/books/${stocked.id}`} className="shrink-0">
            <BookCover book={stocked} className="h-40 w-28" />
          </Link>
        ) : null}
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-wide text-clay uppercase">
            From the books
          </p>
          <blockquote className="mt-3">
            <p className="font-serif text-xl leading-snug italic">“{quote.text}”</p>
            <footer className="mt-3 text-sm">
              — {quote.author}, <cite className="not-italic">{quote.book}</cite>
            </footer>
          </blockquote>
          {stocked ? (
            <Link to={`/books/${stocked.id}`} className="mt-3 inline-block text-sm text-clay">
              This book is in the shop
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
