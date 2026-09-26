import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { AboutPage } from "./pages/AboutPage";
import { BookPage } from "./pages/BookPage";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { VisitPage } from "./pages/VisitPage";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="shop"
          element={
            <CatalogPage
              title="Shop"
              lede="Every title in the shop. In stock books can be ordered. Out of stock books stay listed."
            />
          }
        />
        <Route
          path="in-stock"
          element={
            <CatalogPage
              title="In Stock"
              stock="in"
              lede="These books can be added to your cart."
            />
          }
        />
        <Route
          path="out-of-stock"
          element={
            <CatalogPage
              title="Out of Stock"
              stock="out"
              lede="These books are unavailable. You can still open them and read about them."
            />
          }
        />
        <Route path="books/:id" element={<BookPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="visit" element={<VisitPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
