import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BookCover } from "../components/BookCover";
import { useCart } from "../context/CartContext";
import { store } from "../data/store";
import { categoryLabel, formatMoney, getBook, stockLabel } from "../lib/catalog";

export function BookPage() {
  const { id } = useParams();
  const book = id ? getBook(id) : undefined;
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    document.title = book ? `${book.title} · ${store.name}` : `Book · ${store.name}`;
  }, [book]);

  if (!book) {
    return (
      <section>
        <h1 className="font-serif text-3xl">Book not found</h1>
        <p className="mt-3">That title is not in the catalog.</p>
        <Link to="/shop" className="mt-4 inline-block text-clay">
          Back to the shop
        </Link>
      </section>
    );
  }

  return (
    <article className="flex flex-col gap-6 sm:flex-row">
      <BookCover book={book} className="h-64 w-44" />
      <div>
        <p className="text-sm font-semibold tracking-wide text-clay uppercase">
          {categoryLabel(book)}
        </p>
        <h1 className="mt-2 font-serif text-3xl">{book.title}</h1>
        <p className="mt-2 text-lg">{book.author}</p>
        <p className="mt-4 text-xl">{formatMoney(book.price)}</p>
        <p className="mt-2">{stockLabel(book)}</p>
        <p className="mt-4 max-w-xl">{book.description}</p>
        {book.inStock ? (
          <button
            type="button"
            className="mt-6 rounded-md bg-clay px-4 py-2 font-semibold text-white"
            onClick={() => {
              add(book.id);
              setAdded(true);
            }}
          >
            Add to cart
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="mt-6 rounded-md bg-ink/20 px-4 py-2 font-semibold text-ink/60 dark:bg-white/10 dark:text-white/50"
          >
            Out of Stock
          </button>
        )}
        {added ? (
          <p className="mt-3">
            Added to cart.{" "}
            <Link to="/cart" className="text-clay">
              View cart
            </Link>
          </p>
        ) : null}
      </div>
    </article>
  );
}
