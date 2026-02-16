import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Landing Page</div>} />

        <Route path="/ayamgoreng/login" element={<LoginPage />} />

        {/* Protected wrapper */}
        <Route path="/ayamgoreng" element={<ProtectedRoute />}>
          
          {/* Layout wrapper */}
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="category" element={<CategoryPage />} />
            <Route path="product" element={<ProductPage />} />
          </Route>

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
