import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaHome, FaPlus, FaBars, FaTimes, FaUser } from "react-icons/fa";
import icon from "../../assets/icon.png";

const Navbar = ({ user, onLogout }) => { 
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <img src={icon} alt="RippleRise Logo" className="logo" />
      </div>

      <div className={`nav-right ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          <FaHome style={{ marginRight: "6px" }} />
          Home
        </Link>
        {isLoggedIn ? (
          <>
            <Link to="/create" onClick={() => setMenuOpen(false)}>
              <FaPlus style={{ marginRight: "6px" }} />
              Create
            </Link>
            <Link to="/profile" onClick={() => setMenuOpen(false)}>
              <FaUser style={{ marginRight: "6px" }} />
              Profile
            </Link>
            <button onClick={handleLogout} className="btn btn-secondary">Logout</button> 
          </>
        ) : (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </>
        )}
      </div>
      <div className="hamburger" onClick={toggleMenu}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </nav>
  );
};

export default Navbar;