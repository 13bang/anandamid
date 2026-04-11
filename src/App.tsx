import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

import LoginPage from "./pages/admin_panel/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./pages/admin_panel/Dashboard";
import CategoryPage from "./pages/admin_panel/CategoryPage";
import AdminProductPage from "./pages/admin_panel/ProductPage";
import LandingPage from "./pages/landing_page/LandingPage";
import ProductUpdatePage from "./pages/admin_panel/ProductUpdatePage";
import ProductUploadPage from "./pages/admin_panel/ProductUploadPage";
import AdminPricelistPage from "./pages/admin_panel/PricelistPage";
import BannerPage from "./pages/admin_panel/BannerPage";
import CertificatePage from "./pages/admin_panel/CertificatePage";
import PublicLayout from "./components/PublicLayout";
import ProductKatalogPage from "./pages/landing_page/ProductKatalogPage";
import CategoriesPage from "./pages/landing_page/Categories";
import ProductDetailPage from "./pages/landing_page/ProductDetailPage";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/CornerActions";
import CompanyProfile from "./pages/landing_page/company_profile/ProfilLandingPage";
import TermsPage from "./pages/landing_page/company_profile/TermsPage";
import PageLoader from "./components/PageLoader";
import GroupingPage from "./pages/landing_page/GroupingPage";
import CertificateVerifyPage from "./pages/landing_page/CertificateVerifyPage";
import SearchResultPage from "./pages/landing_page/SearchResultPage";
import { initIdleTimer } from "./services/idleTimer";
import BrandSection from "./pages/admin_panel/BrandPage";
import PCBuilderPage from "./pages/landing_page/PCBuilderPage";
import PublicPricelistPage from "./pages/landing_page/PricelistPage";
import ServerBusyPage from "./pages/ServerBusyPage";
import TiktokPage from "./pages/admin_panel/TiktokPage";


// ================= ROUTES =================
function AppRoutes() {
  const location = useLocation()

  return (
    <Routes location={location} key={location.pathname}>

      <Route path="/server-busy" element={<ServerBusyPage />} />

      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product-katalog" element={<ProductKatalogPage />} />
        <Route path="/product-categories" element={<CategoriesPage />} />
        <Route path="/product-katalog/:id" element={<ProductDetailPage />} />
        {/* <Route path="/categories" element={<CategoriesPage />} /> */}
        <Route path="/product-grouping" element={<GroupingPage />} />
        <Route path="/company-profile" element={<CompanyProfile />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/certificate" element={<CertificateVerifyPage />} />
        <Route path="/certificate/:id" element={<CertificateVerifyPage />} />
        <Route path="/search" element={<SearchResultPage />} />
        <Route path="/pc-builder" element={<PCBuilderPage />} />
        <Route path="/price-list" element={<PublicPricelistPage />} />
      </Route>

      <Route path="/ayamgoreng/login" element={<LoginPage />} />

      <Route path="/ayamgoreng" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="category" element={<CategoryPage />} />
          <Route path="product" element={<AdminProductPage />} />
          <Route path="update-massal" element={<ProductUpdatePage />} />
          <Route path="upload-massal" element={<ProductUploadPage />} />
          <Route path="admin-pricelist" element={<AdminPricelistPage />} />
          <Route path="banner" element={<BannerPage />} />
          <Route path="certificate" element={<CertificatePage />} />
          <Route path="brand" element={<BrandSection />} />
          <Route path="tiktok" element={<TiktokPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  )
}

function AppContent() { 
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 80
    })
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (
      token &&
      location.pathname.startsWith("/ayamgoreng")
    ) {
      initIdleTimer();
    }
  }, [location.pathname])

  return (
    <>
      <PageLoader/>
      <ScrollToTop/>
      <ScrollToTopButton/>
      <AppRoutes/>
    </>
  )
}

export default function App() { 
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}