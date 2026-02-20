import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-white">

      {/* Sidebar wrapper */}
      <div className="p-4">
        <Sidebar />
      </div>

      {/* Main wrapper */}
      <div className="flex-1 p-4">
        <main className="h-full overflow-y-auto bg-white rounded-3xl">
          <Outlet />
        </main>
      </div>

    </div>
  );
}