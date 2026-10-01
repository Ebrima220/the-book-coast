import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Banner } from "./Banner";
import { SideNav } from "./SideNav";
import { TopBar } from "./TopBar";
import { VisitFooter } from "./VisitFooter";

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="h-dvh overflow-hidden bg-paper text-ink md:grid md:grid-cols-[16rem_1fr] dark:bg-[#121816] dark:text-[#f3efe6]">
      <div className="hidden h-dvh md:block">
        <SideNav />
      </div>
      {menuOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div id="mobile-nav" className="relative h-full w-72 max-w-[80vw]">
            <SideNav onNavigate={() => setMenuOpen(false)} />
          </div>
        </div>
      ) : null}
      <div className="flex h-dvh min-w-0 flex-col">
        <TopBar menuOpen={menuOpen} onMenu={() => setMenuOpen(true)} />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col">
            <div className="px-4 py-6 sm:px-6">
              <Banner />
              <div className="mt-8">
                <Outlet />
              </div>
            </div>
            <div className="mt-auto pt-16">
              <VisitFooter />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
