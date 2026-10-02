import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { BookList } from "../components/BookList";
import { Filters } from "../components/Filters";
import { store } from "../data/store";
import { filterBooks } from "../lib/catalog";

export function CatalogPage({
  title,
  stock,
  lede,
}: {
  title: string;
  stock?: "in" | "out";
  lede: string;
}) {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";
  const topic = params.get("topic");
  const books = filterBooks({
    stock,
    q,
    category: params.get("category"),
    topic,
  });
  const still =
    topic === "self-development" || topic === "financial-literacy";

  useEffect(() => {
    document.title = `${title} · ${store.name}`;
  }, [title]);

  return (
    <section>
      <h1 className="font-serif text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl">{lede}</p>
      <div className="mt-5">
        <Filters />
      </div>
      <BookList
        books={books}
        still={still}
        empty={q.trim() ? "No books match that search." : "No books in this list."}
      />
    </section>
  );
}
