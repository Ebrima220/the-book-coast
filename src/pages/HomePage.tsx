import { useEffect } from "react";
import { Link } from "react-router-dom";
import { store } from "../data/store";

export function HomePage() {
  useEffect(() => {
    document.title = store.name;
  }, []);

  return (
    <section>
      <h1 className="font-serif text-3xl">How to order</h1>
      <ol className="mt-4 list-decimal space-y-2 pl-5">
        <li>Add the books you want to your cart.</li>
        <li>Send the order on WhatsApp with your name and address. The shop confirms the details in that chat.</li>
      </ol>
      <Link
        to="/shop"
        className="mt-6 inline-block rounded-md bg-clay px-4 py-2 font-semibold text-white no-underline"
      >
        Browse the shop
      </Link>
    </section>
  );
}
