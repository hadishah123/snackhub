import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menu from "./pages/Menu";
import GoogleSuccess from "./pages/GoogleSuccess";
import Navbar from "./components/Navbar";
import AuthProvider from "./context/AuthProvider";
import Cart from "./pages/Cart";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/google-success" element={<GoogleSuccess />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;