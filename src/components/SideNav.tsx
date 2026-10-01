import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { store } from "../data/store";
import { BestSales } from "./BestSales";
import { CartIcon } from "./CartSummary";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { to: "/shop", label: "Shop" },
  { to: "/in-stock", label: "In Stock" },
  { to: "/out-of-stock", label: "Out of Stock" },
  { to: "/about", label: "About" },
];

export function SideNav({ onNavigate }: { onNavigate?: () => void }) {
  const { count } = useCart();

  return (
    <nav
      aria-label="Store"
      className="flex h-full flex-col bg-sea-bright px-4 py-6 text-foam"
    >
      <NavLink
        to="/"
        end
        onClick={onNavigate}
        className="font-serif text-2xl leading-tight text-foam no-underline"
      >
        {store.name}
      </NavLink>
      <ul className="mt-6 flex shrink-0 flex-col gap-1">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 no-underline ${
                  isActive ? "bg-black/20 font-semibold" : "hover:bg-black/15"
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
      <BestSales onNavigate={onNavigate} />
      <NavLink
        to="/cart"
        onClick={onNavigate}
        className={({ isActive }) =>
          `mt-4 hidden items-center justify-between rounded-md px-3 py-2 no-underline md:flex ${
            isActive ? "bg-black/20 font-semibold" : "hover:bg-black/15"
          }`
        }
      >
        <span className="inline-flex items-center gap-2">
          <CartIcon />
          Cart
        </span>
        {count > 0 ? (
          <span className="rounded-full bg-clay px-2 py-0.5 text-sm text-white">{count}</span>
        ) : null}
      </NavLink>
      <ThemeToggle
        showLabel
        className="mt-4 flex items-center gap-2 rounded-md px-3 py-2 hover:bg-black/15 md:hidden"
      />
    </nav>
  );
}
