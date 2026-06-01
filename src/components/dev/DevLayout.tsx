import { Outlet } from "react-router";
import DevSidebar from "./DevSidebar";

function DevLayout() {
  return (
    <div className="dev-layout">
      <DevSidebar />
      <main className="dev-layout__main">
        <Outlet />
      </main>
    </div>
  );
}

export default DevLayout;