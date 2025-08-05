import { useEffect, useState, useCallback } from "react"; // Import useCallback
import { Route, Routes } from "react-router-dom";
import CreatePage from "./pages/CreatePage";
import HomePage from "./pages/HomePage";
import Navbar from "./components/Navbar";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

import "./index.css";

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    const storedUserInfo = localStorage.getItem('userInfo');

    if (storedToken && storedUserInfo) {
      try {
        setUser(JSON.parse(storedUserInfo));
        setToken(storedToken);
      } catch (e) {
        console.error("Failed to parse user info from localStorage", e);
        localStorage.clear();
      }
    }
  }, []);

  // Use useCallback to make handleLogin a stable function
  const handleLogin = useCallback((userObj, userToken) => {
    setUser(userObj);
    setToken(userToken);
    localStorage.setItem('userToken', userToken);
    localStorage.setItem('userInfo', JSON.stringify(userObj));
  }, []); // Empty dependency array means this function is created only once

  // Use useCallback to make handleLogout a stable function
  const handleLogout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
  }, []); // Empty dependency array means this function is created only once

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/profile" element={<ProfilePage user={user} onLogin={handleLogin} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;