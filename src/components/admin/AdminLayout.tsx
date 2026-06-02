import { Outlet } from "react-router";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;