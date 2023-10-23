import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Panier() {
  const [panier, setPanier] = useState({})

  useEffect(() => {
    axios.get('http://localhost:8080/panier/afficher-panier')
      .then((response) => {
        setPanier(response.data)
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération du panier :', error)
      })
  }, [])

  const supprimerDuPanier = (produitId) => {
    // Add logic to remove a product from the cart
    // You will need to send a DELETE request to your API
  }

  const ajouterAuPanier = (produitId) => {
    const nouveauPanier = { ...panier }
    nouveauPanier[produitId] = (nouveauPanier[produitId] || 0) + 1
    setPanier(nouveauPanier)
  }

  const afficherProduitsPanier = () => {
    if (Object.keys(panier).length === 0) {
      return (
        <div>
          <p>Votre panier est vide.</p>
          <Link to="/shopping">Retourner aux achats</Link>
        </div>
      )
    }

    return (
      <div>
        <h2>Votre Panier</h2>
        <ul>
          {Object.keys(panier).map((produitId) => (
            <li key={produitId}>
              Produit ID : {produitId}, Quantité : {panier[produitId]}
              <button onClick={() => supprimerDuPanier(produitId)}>Supprimer</button>
            </li>
          ))}
        </ul>
        {/* You can also display the total of the cart here */}
      </div>
    )
  }

  return (
    <div>
      {afficherProduitsPanier()}
    </div>
  )
}

export default Panier
