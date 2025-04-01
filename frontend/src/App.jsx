import { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import Signup from "./pages/Signup";
import SingIn from "./pages/SingIn";
import Dashboard from "./pages/Dashboard";
import SendMoney from "./pages/SendMoney";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && token !== "") {
      if (
        location.pathname === "/" ||
        location.pathname === "/signin" ||
        location.pathname === "/signup"
      ) {
        navigate("/dashboard");
      }
    } else {
      if (location.pathname !== "/signup" && location.pathname !== "/signin") {
        navigate("/signin");
      }
    }
  }, [navigate, location]);

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<SingIn />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/send" element={<SendMoney />} />
    </Routes>
  );
}

export default App;
