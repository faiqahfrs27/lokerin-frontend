import { Outlet } from "react-router";
import DevSidebar from "./DevSidebar";

function DevLayout() {
  return (
    <div className="admin-shell">
      <DevSidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default DevLayout;