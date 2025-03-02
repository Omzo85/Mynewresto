import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dishes');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const [dishList, setDishList] = useState(dishes);

  const handleDeleteDish = (id) => {
    setDishList(dishList.filter(dish => dish.id !== id));
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Tableau de bord administrateur</h1>
        <button onClick={handleLogout} className="logout-button">
          Déconnexion
        </button>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`tab-button ${activeTab === 'dishes' ? 'active' : ''}`}
          onClick={() => setActiveTab('dishes')}
        >
          Gestion des plats
        </button>
        <button 
          className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Commandes
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'dishes' ? (
          <div className="dishes-management">
            <div className="section-header">
              <h2>Gestion des plats</h2>
              <button className="add-button">Ajouter un plat</button>
            </div>
            
            <div className="dishes-table">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Catégorie</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dishList.map(dish => (
                    <tr key={dish.id}>
                      <td>
                        <img 
                          src={dish.image} 
                          alt={dish.name} 
                          className="dish-thumbnail"
                        />
                      </td>
                      <td>{dish.name}</td>
                      <td>{dish.price}€</td>
                      <td>{dish.category}</td>
                      <td className="action-buttons">
                        <button className="edit-button">Modifier</button>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteDish(dish.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="orders-management">
            <h2>Commandes récentes</h2>
            <div className="orders-list">
              <p>Aucune commande pour le moment</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;

//  email admin@example.com

// Mot de passe : adminpass
