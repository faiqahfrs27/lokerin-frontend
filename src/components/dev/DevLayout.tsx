import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Menu } from "lucide-react";
import DevSidebar from "./DevSidebar";

function DevLayout() {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Tutup drawer otomatis pas pindah halaman
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <div className="dev-layout">
      <DevSidebar isMobileOpen={isMobileOpen} onClose={() => setMobileOpen(false)} />
      {isMobileOpen && (
        <div
          className="dev-layout__backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <main className="dev-layout__main">
        <MobileTopBar onMenuClick={() => setMobileOpen(true)} />
        <Outlet />
      </main>
    </div>
  );
}

function MobileTopBar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <div className="dev-topbar">
      <button
        className="dev-topbar__menu"
        onClick={onMenuClick}
        type="button"
        aria-label="Buka menu"
      >
        <Menu size={20} strokeWidth={2} />
      </button>
      <span className="dev-topbar__brand">lokerin</span>
    </div>
  );
}

export default DevLayout;