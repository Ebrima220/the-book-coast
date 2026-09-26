import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

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
  const { theme, toggle } = useTheme();
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
      <button
        type="button"
        className="rounded-md border border-line p-2 dark:border-white/15"
        onClick={toggle}
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8" />
      </g>
    </svg>
  );
}
