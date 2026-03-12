import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMenu from "./pages/AdminMenu";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/admin/menu" element={<AdminMenu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;