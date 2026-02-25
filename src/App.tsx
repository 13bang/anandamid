import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/admin_panel/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin_panel/Dashboard";
import CategoryPage from "./pages/admin_panel/CategoryPage";
import AdminProductPage from "./pages/admin_panel/ProductPage";
import LandingPage from "./pages/landing_page/LandingPage";
import ProductUpdatePage from "./pages/admin_panel/ProductUpdatePage";
import ProductUploadPage from "./pages/admin_panel/ProductUploadPage";
import PricelistPage from "./pages/admin_panel/PricelistPage";
import BannerPage from "./pages/admin_panel/BannerPage";
import PublicLayout from "./components/PublicLayout";
import ProductPage from "./pages/landing_page/ProductPage";
import ProductDetailPage from "./pages/landing_page/ProductDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Route>

        <Route path="/ayamgoreng/login" element={<LoginPage />} />

        {/* Protected wrapper */}
        <Route path="/ayamgoreng" element={<ProtectedRoute />}>
          
          {/* Layout wrapper */}
          <Route element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="category" element={<CategoryPage />} />
            <Route path="product" element={<AdminProductPage />} />
            <Route path="update-massal" element={<ProductUpdatePage />} />
            <Route path="upload-massal" element={<ProductUploadPage />} />
            <Route path="pricelist" element={<PricelistPage />} />
            <Route path="banner" element={<BannerPage />} />
          </Route>

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
