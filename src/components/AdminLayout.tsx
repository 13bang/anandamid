import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}
