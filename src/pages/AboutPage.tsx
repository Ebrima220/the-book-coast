import { useEffect } from "react";
import { Link } from "react-router-dom";
import { store } from "../data/store";

export function AboutPage() {
  useEffect(() => {
    document.title = `About · ${store.name}`;
  }, []);

  return (
    <article className="max-w-2xl">
      <h1 className="font-serif text-4xl">About</h1>
      <p className="mt-6 text-lg leading-8">{store.about.lead}</p>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">The mission</h2>
        <div className="mt-4 space-y-4 leading-7">
          {store.about.mission.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">Why ordering from abroad is hard</h2>
        <div className="mt-4 space-y-4 leading-7">
          {store.about.why.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">The shelves</h2>
        <div className="mt-4 space-y-4 leading-7">
          {store.about.shelves.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ul className="mt-6 space-y-4">
          {store.about.categories.map((category) => (
            <li key={category.name}>
              <p className="font-semibold">{category.name}</p>
              <p className="mt-1 leading-7 text-ink/80 dark:text-[#f3efe6]/80">
                {category.detail}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-serif text-2xl">How to order</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7">
          {store.about.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <p className="mt-10 flex flex-wrap gap-4">
        <Link
          to="/shop"
          className="rounded-md bg-clay px-4 py-2 font-semibold text-white no-underline"
        >
          Browse the shop
        </Link>
        <Link
          to="/visit"
          className="rounded-md border border-line px-4 py-2 font-semibold no-underline dark:border-white/15"
        >
          Visit
        </Link>
      </p>
    </article>
  );
}
