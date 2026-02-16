import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
    const location = useLocation();

    const menu = [
    { name: "Dashboard", path: "/ayamgoreng/dashboard" },
    { name: "Kategori", path: "/ayamgoreng/category" },
    { name: "Product", path: "/ayamgoreng/product" },
    ];


    return (
        <div className="w-64 min-h-screen text-white bg-gray-900">
        <div className="p-6 text-xl font-bold border-b border-gray-700">
            Admin Panel
        </div>

        <nav className="p-4 space-y-2">
            {menu.map((item) => {
            const isActive = location.pathname === item.path;

            return (
                <Link
                key={item.name}
                to={item.path}
                className={`block px-4 py-2 rounded-lg transition ${
                    isActive
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
                >
                {item.name}
                </Link>
            );
            })}
        </nav>
        </div>
    );
}
