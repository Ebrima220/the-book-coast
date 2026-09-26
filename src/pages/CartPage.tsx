import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookCover } from "../components/BookCover";
import { useCart } from "../context/CartContext";
import { store } from "../data/store";
import { buildOrderMessage, buildWhatsAppUrl, formatMoney, getBook } from "../lib/catalog";

export function CartPage() {
  const { items, setQuantity, remove } = useCart();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    document.title = `Cart · ${store.name}`;
  }, []);

  const lines = useMemo(
    () =>
      items.flatMap((item) => {
        const book = getBook(item.bookId);
        if (!book) return [];
        return [
          {
            book,
            quantity: item.quantity,
            lineTotal: book.price * item.quantity,
          },
        ];
      }),
    [items],
  );

  const total = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const canSend = name.trim().length > 0 && lines.length > 0;
  const message = buildOrderMessage(
    name,
    note,
    lines.map((line) => ({
      title: line.book.title,
      quantity: line.quantity,
      price: line.book.price,
      lineTotal: line.lineTotal,
    })),
    total,
  );
  const whatsappUrl = buildWhatsAppUrl(message);

  return (
    <section>
      <h1 className="flex items-center gap-3 font-serif text-3xl">
        <CartIcon />
        Cart
      </h1>
      {lines.length === 0 ? (
        <p className="mt-4">
          Your cart is empty.{" "}
          <Link to="/shop" className="text-clay">
            Browse the shop
          </Link>
        </p>
      ) : (
        <>
          <ul className="mt-4 divide-y divide-line dark:divide-white/10">
            {lines.map((line) => (
              <li key={line.book.id} className="flex gap-4 py-4">
                <BookCover book={line.book} />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/books/${line.book.id}`}
                    className="font-serif text-xl text-inherit"
                  >
                    {line.book.title}
                  </Link>
                  <p className="mt-1">{formatMoney(line.book.price)} each</p>
                  {!line.book.inStock ? (
                    <p className="mt-1 text-sm">
                      This title is now out of stock. You can still send it, and the shop will confirm.
                    </p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-line px-3 py-1 dark:border-white/15"
                      aria-label={`Decrease quantity of ${line.book.title}`}
                      onClick={() => setQuantity(line.book.id, line.quantity - 1)}
                    >
                      −
                    </button>
                    <span aria-live="polite">{line.quantity}</span>
                    <button
                      type="button"
                      className="rounded-md border border-line px-3 py-1 dark:border-white/15"
                      aria-label={`Increase quantity of ${line.book.title}`}
                      onClick={() => setQuantity(line.book.id, line.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="rounded-md px-3 py-1 text-sm text-clay"
                      onClick={() => remove(line.book.id)}
                    >
                      Remove
                    </button>
                    <span className="ml-auto font-semibold">
                      {formatMoney(line.lineTotal)}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xl font-semibold">Total: {formatMoney(total)}</p>
          <form
            className="mt-6 max-w-lg"
            onSubmit={(event) => event.preventDefault()}
          >
            <label className="block font-semibold" htmlFor="order-name">
              Your name
            </label>
            <input
              id="order-name"
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-ink dark:border-white/15 dark:bg-[#1c2622] dark:text-[#f3efe6]"
            />
            <label className="mt-4 block font-semibold" htmlFor="order-note">
              Note <span className="font-normal">(optional)</span>
            </label>
            <textarea
              id="order-note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="mt-2 w-full rounded-md border border-line bg-white px-3 py-2 text-ink dark:border-white/15 dark:bg-[#1c2622] dark:text-[#f3efe6]"
            />
            {canSend ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block rounded-md bg-clay px-4 py-2 font-semibold text-white no-underline"
              >
                Send order on WhatsApp
              </a>
            ) : (
              <>
                <button
                  type="button"
                  disabled
                  className="mt-4 rounded-md bg-ink/20 px-4 py-2 font-semibold text-ink/60 dark:bg-white/10 dark:text-white/50"
                >
                  Send order on WhatsApp
                </button>
                <p className="mt-2 text-sm">Enter your name to send the order.</p>
              </>
            )}
          </form>
        </>
      )}
    </section>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        d="M6 7h15l-1.5 9h-12z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 7 5 4H2"
      />
      <circle cx="9" cy="20" r="1.2" fill="currentColor" />
      <circle cx="18" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}
