import React from 'react';
import { useParams } from 'react-router-dom';
import { dishes } from '../data/Dishes';
import { useCart } from '../context/CartContext'; // Ajout de l'import
import './DishDetail.css';

function DishDetail() {
  const { id } = useParams();
  const { addToCart } = useCart(); // Utilisation du hook useCart
  const dish = dishes.find(d => d.id === id);

  if (!dish) {
    return <div className="dish-not-found">Plat non trouvé</div>;
  }

  // Fonction pour gérer l'ajout au panier
  const handleAddToCart = () => {
    addToCart(dish);
  };

  return (
    <div className="dish-detail">
      <div className="dish-image-container">
        <img src={`/${dish.image}`} alt={dish.name} className="dish-image" />
      </div>
      <div className="dish-info">
        <h1>{dish.name}</h1>
        <p className="dish-description">{dish.description}</p>
        <div className="dish-details">
          <p className="dish-ingredients"><strong>Ingrédients:</strong> {dish.ingredients}</p>
          <p className="dish-price"><strong>Prix:</strong> {dish.price}€</p>
        </div>
        <button 
          className="add-to-cart"
          onClick={handleAddToCart} // Ajout du gestionnaire d'événement
        >
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}

export default DishDetail;