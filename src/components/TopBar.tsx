import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartIcon } from "./CartSummary";
import { ThemeToggle } from "./ThemeToggle";

export function TopBar({
  menuOpen,
  onMenu,
}: {
  menuOpen: boolean;
  onMenu: () => void;
}) {
  const [params] = useSearchParams();
  const location = useLocation();
  const query = params.get("q") ?? "";
  const [value, setValue] = useState(query);
  const navigate = useNavigate();
  const { count } = useCart();
  const showSearch =
    location.pathname === "/shop" ||
    location.pathname === "/in-stock" ||
    location.pathname === "/out-of-stock";

  useEffect(() => {
    setValue(query);
  }, [query]);

  function submitSearch(nextValue: string) {
    const trimmed = nextValue.trim();
    const next =
      location.pathname === "/shop"
        ? new URLSearchParams(params)
        : new URLSearchParams();
    if (trimmed) next.set("q", trimmed);
    else next.delete("q");
    navigate({ pathname: "/shop", search: next.toString() });
  }

  return (
    <header className="flex items-center gap-3 border-b border-line bg-paper px-4 py-3 dark:border-white/10 dark:bg-[#121816]">
      <button
        type="button"
        className="rounded-md border border-line px-3 py-2 text-sm md:hidden dark:border-white/15"
        onClick={onMenu}
        aria-expanded={menuOpen}
        aria-controls="mobile-nav"
      >
        Menu
      </button>
      {showSearch ? (
        <form
          className="flex min-w-0 flex-1 gap-2"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            submitSearch(value);
          }}
        >
          <label className="sr-only" htmlFor="book-search">
            Search books
          </label>
          <input
            id="book-search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Search by title or author"
            className="min-w-0 flex-1 rounded-md border border-line bg-white px-3 py-2 text-ink outline-none focus:outline-none focus-visible:outline-none dark:border-white/15 dark:bg-[#1c2622] dark:text-[#f3efe6]"
          />
          <button
            type="submit"
            className="search-submit rounded-md bg-sea px-4 py-2 font-semibold text-foam outline-none focus:outline-none focus-visible:outline-none"
          >
            Search
          </button>
          {value ? (
            <button
              type="button"
              className="rounded-md border border-line px-3 py-2 dark:border-white/15"
              onClick={() => {
                setValue("");
                submitSearch("");
              }}
            >
              Clear
            </button>
          ) : null}
        </form>
      ) : (
        <div className="flex-1" />
      )}
      <Link
        to="/cart"
        className="relative rounded-md border border-line p-2 text-ink no-underline md:hidden dark:border-white/15 dark:text-[#f3efe6]"
        aria-label={count > 0 ? `Cart, ${count} items` : "Cart"}
      >
        <CartIcon />
        {count > 0 ? (
          <span className="absolute -top-1 -right-1 rounded-full bg-clay px-1.5 text-xs text-white">
            {count}
          </span>
        ) : null}
      </Link>
      <ThemeToggle className="hidden rounded-md border border-line p-2 md:inline-flex dark:border-white/15" />
    </header>
  );
}
