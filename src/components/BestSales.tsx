import { Link } from "react-router-dom";
import { bestSellers } from "../lib/catalog";
import { BookCover } from "./BookCover";

export function BestSales() {
  const sellers = bestSellers();

  return (
    <aside className="rounded-xl border border-line bg-white p-4 dark:border-white/10 dark:bg-[#1c2622]">
      <h2 className="font-serif text-xl">Best Sales</h2>
      {sellers.length === 0 ? (
        <p className="mt-3 text-sm">No sales are recorded.</p>
      ) : (
        <ol className="mt-3 flex flex-col gap-3">
          {sellers.map((book) => (
            <li key={book.id}>
              <Link
                to={`/books/${book.id}`}
                className="flex items-center gap-3 text-inherit no-underline"
              >
                <BookCover book={book} className="h-14 w-10" />
                <span className="min-w-0">
                  <span className="block font-semibold">{book.title}</span>
                  <span className="block text-sm text-ink/70 dark:text-[#f3efe6]/70">
                    {book.unitsSold} sold
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}
