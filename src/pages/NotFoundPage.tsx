import { useEffect } from "react";
import { Link } from "react-router-dom";
import { store } from "../data/store";

export function NotFoundPage() {
  useEffect(() => {
    document.title = `Page not found · ${store.name}`;
  }, []);

  return (
    <section>
      <h1 className="font-serif text-3xl">Page not found</h1>
      <Link to="/" className="mt-4 inline-block text-clay">
        Back home
      </Link>
    </section>
  );
}
