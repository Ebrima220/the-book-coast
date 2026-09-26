import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { store } from "../data/store";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/in-stock", label: "In Stock" },
  { to: "/out-of-stock", label: "Out of Stock" },
  { to: "/about", label: "About" },
  { to: "/visit", label: "Visit" },
];

export function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const { count } = useCart();

  return (
    <nav
      aria-label="Store"
      className="flex h-full flex-col bg-sea px-4 py-6 text-foam"
    >
      <NavLink
        to="/"
        end
        onClick={onNavigate}
        className="font-serif text-2xl leading-tight text-foam no-underline"
      >
        {store.name}
      </NavLink>
      <ul className="mt-8 flex flex-col gap-1">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 no-underline ${
                  isActive ? "bg-white/15 font-semibold" : "hover:bg-white/10"
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <NavLink
        to="/cart"
        onClick={onNavigate}
        className={({ isActive }) =>
          `mt-auto flex items-center justify-between rounded-md px-3 py-2 no-underline ${
            isActive ? "bg-white/15 font-semibold" : "hover:bg-white/10"
          }`
        }
      >
        <span className="inline-flex items-center gap-2">
          <CartIcon />
          Cart
        </span>
        {count > 0 ? (
          <span className="rounded-full bg-clay px-2 py-0.5 text-sm text-white">
            {count}
          </span>
        ) : null}
      </NavLink>
    </nav>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
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
