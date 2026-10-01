import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookCover } from "../components/BookCover";
import { useCart } from "../context/CartContext";
import { store } from "../data/store";
import { formatMoney, getBook, whatsAppChatUrl } from "../lib/catalog";
import { orderPdfFile } from "../lib/orderPdf";

export function CartPage() {
  const { items, setQuantity, remove, clear } = useCart();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [homeDelivery, setHomeDelivery] = useState<boolean | null>(null);
  const [note, setNote] = useState("");
  const [sending, setSending] = useState(false);
  const [sendNote, setSendNote] = useState("");

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
  const canSend =
    name.trim().length > 0 &&
    address.trim().length > 0 &&
    homeDelivery !== null &&
    lines.length > 0;

  async function sendOrder() {
    if (!canSend || homeDelivery === null || sending) return;
    setSending(true);
    setSendNote("");
    const file = orderPdfFile({
      name,
      address,
      homeDelivery,
      note,
      lines: lines.map((line) => ({
        title: line.book.title,
        quantity: line.quantity,
        price: line.book.price,
        lineTotal: line.lineTotal,
      })),
      total,
    });
    const share = { files: [file], title: `${store.name} order` };
    try {
      if (navigator.canShare?.(share)) {
        await navigator.share(share);
        setSendNote("Choose WhatsApp in the share menu. The receipt goes as a PDF file.");
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    } finally {
      setSending(false);
    }
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    window.open(whatsAppChatUrl(), "_blank", "noopener,noreferrer");
    setSendNote(
      "The PDF is saved on this device. Attach it in the WhatsApp chat that opened. The books and prices stay in the file.",
    );
  }

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
                    {line.book.inStock ? (
                      <button
                        type="button"
                        className="rounded-md border border-line px-3 py-1 dark:border-white/15"
                        aria-label={`Increase quantity of ${line.book.title}`}
                        onClick={() => setQuantity(line.book.id, line.quantity + 1)}
                      >
                        +
                      </button>
                    ) : null}
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
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={clear}
              className="rounded-md border border-line px-4 py-2 text-sm font-semibold dark:border-white/15"
            >
              Clear all
            </button>
            <p className="text-xl font-semibold">Total: {formatMoney(total)}</p>
          </div>
          <form
            className="mt-6 max-w-lg"
            onSubmit={(event) => event.preventDefault()}
          >
            <p className="leading-7">
              Thank you for shopping with us. Add your name and the address where we should send the books, then choose whether you want home delivery. Home delivery may cost extra fees. We will confirm the order with you on WhatsApp.
            </p>
            <label className="mt-4 block font-semibold" htmlFor="order-name">
              Your name
            </label>
            <input
              id="order-name"
              required
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={fieldClass}
            />
            <label className="mt-4 block font-semibold" htmlFor="order-address">
              Address
            </label>
            <textarea
              id="order-address"
              required
              rows={3}
              autoComplete="street-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className={fieldClass}
            />
            <fieldset className="mt-4">
              <legend className="font-semibold">Home delivery</legend>
              <p className="mt-1">
                Please choose one. Home delivery may cost extra fees.
              </p>
              <label className="mt-3 flex items-start gap-2">
                <input
                  type="radio"
                  name="home-delivery"
                  checked={homeDelivery === true}
                  onChange={() => setHomeDelivery(true)}
                />
                <span>Home delivery (extra fees may apply)</span>
              </label>
              <label className="mt-2 flex items-start gap-2">
                <input
                  type="radio"
                  name="home-delivery"
                  checked={homeDelivery === false}
                  onChange={() => setHomeDelivery(false)}
                />
                <span>Without home delivery</span>
              </label>
            </fieldset>
            <label className="mt-4 block font-semibold" htmlFor="order-note">
              Note <span className="font-normal">(optional)</span>
            </label>
            <textarea
              id="order-note"
              rows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className={fieldClass}
            />
            {canSend ? (
              <>
                <button
                  type="button"
                  onClick={sendOrder}
                  disabled={sending}
                  className="mt-4 rounded-md bg-clay px-4 py-2 font-semibold text-white"
                >
                  Send order on WhatsApp
                </button>
                <p className="mt-2 text-sm">
                  The order is a PDF receipt. The books, prices, and address are in that file, so they cannot be edited in the chat.
                </p>
                {sendNote ? <p className="mt-2 text-sm">{sendNote}</p> : null}
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled
                  className="mt-4 rounded-md bg-ink/20 px-4 py-2 font-semibold text-ink/60 dark:bg-white/10 dark:text-white/50"
                >
                  Send order on WhatsApp
                </button>
                <p className="mt-2 text-sm">
                  Enter your name and address, and choose home delivery, to send the order.
                </p>
              </>
            )}
          </form>
        </>
      )}
    </section>
  );
}

const fieldClass =
  "order-field mt-2 w-full resize-none rounded-md border border-line bg-white px-3 py-2 text-ink dark:border-white/15 dark:bg-[#1c2622] dark:text-[#f3efe6]";

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
