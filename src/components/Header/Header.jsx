import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="Header">
      <div className="Navbar">
        <button onClick={toggleMenu} className="menu-toggle">
          <i className="fas fa-bars"></i>
        </button>
        <Link to="/" className="NomDuRestaurant">
          <i className="fas fa-utensils"></i>
          Chez Khadija
        </Link>
        <div className="header-icons">
          {user ? (
            <>
              <span className="user-email">{user.email}</span>
              <button onClick={logout} className="logout-button">
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </>
          ) : (
            <Link to="/login" className="profile-icon">
              <i className="fas fa-user"></i>
            </Link>
          )}
          <Link to="/cart" className="cart-icon">
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-count">{getCartCount()}</span>
          </Link>
        </div>
      </div>
      
      <div className={`dropdown-menu ${isMenuOpen ? 'show' : ''}`}>
        <Link to="/" onClick={toggleMenu}><i className="fas fa-home"></i> Accueil</Link>
        {user ? (
          <button onClick={logout} className="dropdown-item">
            <i className="fas fa-sign-out-alt"></i> Déconnexion
          </button>
        ) : (
          <Link to="/login" onClick={toggleMenu}>
            <i className="fas fa-user"></i> Connexion
          </Link>
        )}
        <Link to="/cart" onClick={toggleMenu}>
          <i className="fas fa-shopping-cart"></i> Panier
        </Link>
        <a href="#contact" onClick={toggleMenu}>
          <i className="fas fa-envelope"></i> Contact
        </a>
      </div>
    </header>
  );
}

export default Header;