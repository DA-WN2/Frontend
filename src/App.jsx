import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ShippingPage from "./pages/ShippingPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
// --- FUTURE IMPORTS (Uncomment as we build them!) ---
import RegisterPage from "./pages/RegisterPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import OrderPage from "./pages/OrderPage";
import AdminProductListPage from "./pages/AdminProductListPage";
import ProductEditPage from "./pages/ProductEditPage";
function App() {
  return (
    <Router>
      <Navbar />
      <main
        style={{
          padding: "20px",
          minHeight: "80vh",
          backgroundColor: "#f9f9f9",
        }}
      >
        <Routes>
          {/* Public Routes (Anyone can see these) */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/placeorder" element={<PlaceOrderPage />} />
          <Route path="/order/:id" element={<OrderPage />} />
          <Route path="/admin/productlist" element={<AdminProductListPage />} />
          <Route path="/admin/product/:id/edit" element={<ProductEditPage />} />

          {/* Uncomment these as you create the files in your /pages folder!
            Notice the ":id" in the Product route - that allows us to load specific items.
          */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart/:id?" element={<CartPage />} />
          {/* <Route path="/cart" element={<CartPage />} /> */}

          {/* Protected Routes (Logged in users only) */}
          <Route path="/profile" element={<ProfilePage />} />

          {/* Admin Routes (Store owner only) */}
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
