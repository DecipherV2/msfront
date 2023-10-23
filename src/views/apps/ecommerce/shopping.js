import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardText, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { ShoppingCart, Heart, ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'

function Shopping() {
  const [produits, setProduits] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [pageNumber, setPageNumber] = useState(0)
  const [sortBy, setSortBy] = useState(null)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const productsPerPage = 9
  const pagesVisited = pageNumber * productsPerPage

  useEffect(() => {
    axios.get('http://localhost:8088/SpringMVC/produits')
      .then((response) => {
        setProduits(response.data)
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
      })
  }, [])

  const filteredProduits = produits.filter(produit => produit.designation.toLowerCase().includes(searchTerm.toLowerCase()))

  if (sortBy === 'highest') {
    filteredProduits.sort((a, b) => b.prix - a.prix)
  } else if (sortBy === 'lowest') {
    filteredProduits.sort((a, b) => a.prix - b.prix)
  }

  const displayProduits = filteredProduits
    .slice(pagesVisited, pagesVisited + productsPerPage)
    .map(produit => (
      <div key={produit.id} className="col">
        <Card className="ecommerce-card" style={{ border: '1px solid #e1e5eb', borderRadius: '0.25rem', marginBottom: '20px', transition: 'all 0.3s ease-in-out' }}>
          <div className="item-img text-center mx-auto" style={{ padding: '20px' }}>
            <Link to={`/apps/ecommerce/product-detail/${produit.image}`}>
              <img className="img-fluid card-img-top" src={produit.image} alt={produit.designation} />
            </Link>
          </div>
          <CardBody>
            <div className="item-wrapper">
              <h6 className="item-price" style={{ color: '#28c76f', fontSize: '1.25rem', fontWeight: '500', marginBottom: '0.5rem' }}>€{produit.prix}</h6>
            </div>
            <h6 className="item-name" style={{ fontSize: '1rem', fontWeight: '500', marginBottom: '0.5rem' }}>
              <Link className="text-body" to={`/apps/ecommerce/product-detail/${produit.slug}`}>
                {produit.designation}
              </Link>
              <CardText tag="span" className="item-company" style={{ color: '#6c757d', fontSize: '0.875rem' }}>
                By{' '}
                <a className="company-name" href="/" onClick={e => e.preventDefault()}>
                  {produit.brand}
                </a>
              </CardText>
            </h6>
            <CardText className="item-description" style={{ color: '#6c757d', fontSize: '0.875rem', marginBottom: '1rem' }}>{produit.description}</CardText>
          </CardBody>
          <div className="item-options text-center" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
            <Button className="btn-wishlist" color="light" style={{ borderRadius: '0.25rem', padding: '0.375rem 0.75rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
              <Heart className="me-50" size={14} />
              <span>Ajouter à la liste de souhaits</span>
            </Button>
            <Button className="btn-cart move-cart" color="primary" style={{ borderRadius: '0.25rem', padding: '0.375rem 0.75rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center' }}>
              <ShoppingCart className="me-50" size={14} />
              <span>Ajouter au panier</span>
            </Button>
          </div>
        </Card>
      </div>
    ))

  const pageCount = Math.ceil(filteredProduits.length / productsPerPage)

  const changePage = ({ selected }) => {
    setPageNumber(selected)
  }

  const toggle = () => setDropdownOpen(prevState => !prevState)

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Products</h1>
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by designation"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ flex: 1, marginRight: '10px', padding: '12px', borderRadius: '5px', border: '1px solid #e6e6e6', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', fontSize: '16px' }}
        />
        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle caret color="light">
            Sort by Price <ChevronDown size={15} />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => setSortBy('highest')}>Highest Price</DropdownItem>
            <DropdownItem onClick={() => setSortBy('lowest')}>Lowest Price</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div className="card-container row row-cols-1 row-cols-md-3 g-4">
        {displayProduits}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <ReactPaginate
          previousLabel={<span style={{ display: 'inline-block', color: 'white', background: '#9370DB', borderRadius: '50%', width: '30px', height: '30px', lineHeight: '30px', textAlign: 'center', margin: '0 5px', cursor: 'pointer' }}>{'<'}</span>}
          nextLabel={<span style={{ display: 'inline-block', color: 'white', background: '#9370DB', borderRadius: '50%', width: '30px', height: '30px', lineHeight: '30px', textAlign: 'center', margin: '0 5px', cursor: 'pointer' }}>{'>'}</span>}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={'pagination'}
          previousLinkClassName={'pagination-link'}
          nextLinkClassName={'pagination-link'}
          disabledClassName={'pagination-link disabled'}
          activeClassName={'pagination-link active'}
        />
      </div>
    </div>
  )
}

export default Shopping
