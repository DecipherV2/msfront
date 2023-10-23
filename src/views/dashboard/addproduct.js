import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Table, Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap'
import { X, Plus } from 'react-feather'

const AddProduct = () => {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [product, setProduct] = useState({
    id: null,
    refPdt: 0,
    designation: '',
    description: '',
    prix: 0.0,
    image: '',
    qteStock: 0,
    errorMsg: ''
  })
  const [errors, setErrors] = useState({
    refPdt: '',
    designation: '',
    description: '',
    prix: '',
    image: '',
    qteStock: ''
  })

  useEffect(() => {
    axios.get('http://localhost:8088/SpringMVC/produits')
      .then((response) => {
        setProducts(response.data)
      })
      .catch((error) => {
        console.error('Error fetching products:', error)
      })
  }, [])

  const toggleForm = () => {
    setShowForm(!showForm)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    let errorMsg = ''

    if (name === 'designation' && !value.trim()) {
      errorMsg = 'This field is required'
    } else if (name === 'prix' && !/^\d+(?:\.\d{0,2})?$/.test(value)) {
      errorMsg = 'Please enter a valid price'
    } else if (name === 'refPdt' && !/^\d+$/.test(value)) {
      errorMsg = 'Please enter a valid reference number'
    } else if (name === 'qteStock' && !/^\d+$/.test(value)) {
      errorMsg = 'Please enter a valid quantity'
    } else if (name === 'description' && !value.trim()) {
      errorMsg = 'This field is required'
    }

    setErrors({ ...errors, [name]: errorMsg })
    setProduct({ ...product, [name]: value, errorMsg })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!product.designation || !product.prix || !product.refPdt || !product.qteStock || !product.description) {
      return
    }
    if (product.id) {
      axios
        .put(`http://localhost:8088/SpringMVC/produits/${product.id}`, product)
        .then(() => {
          setProducts(products.map(p => (p.id === product.id ? product : p)))
          setProduct({
            id: null,
            refPdt: 0,
            designation: '',
            description: '',
            prix: 0.0,
            image: '',
            qteStock: 0,
            errorMsg: ''
          })
        })
        .catch((error) => {
          console.error('Error updating product:', error)
        })
    } else {
      axios
        .post('http://localhost:8088/SpringMVC/produits', product)
        .then(response => {
          setProducts([...products, response.data])
          setProduct({
            id: null,
            refPdt: 0,
            designation: '',
            description: '',
            prix: 0.0,
            image: '',
            qteStock: 0,
            errorMsg: ''
          })
        })
        .catch((error) => {
          console.error('Error adding product:', error)
        })
    }
  }

  const handleEdit = (p) => {
    setProduct(p)
    toggleForm()
  }

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8088/SpringMVC/produits/${id}`)
      .then(() => {
        setProducts(products.filter((product) => product.id !== id))
      })
      .catch((error) => {
        console.error('Error deleting product:', error)
      })
  }

  return (
    <div>
      <Button color="primary" onClick={toggleForm} style={{ marginBottom: '20px' }}>
        Add Product
      </Button>

      {products.length > 0 && (
        <Table striped>
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>RefPdt</th>
              <th>Designation</th>
              <th>Description</th>
              <th>Prix</th>
              
              <th>QteStock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item, index) => (
              <tr key={index}>
                <th scope="row">{index + 1}</th>
                <td>
                  <img src={item.image} alt="Product" style={{ width: '50px', height: '50px' }} />
                </td>
                <td>{item.refPdt}</td>
                <td>{item.designation}</td>
                <td>{item.description}</td>
                <td>{item.prix}</td>
                
                <td>{item.qteStock}</td>
                <td>
                  <Button color="info" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>{' '}
                  <Button color="danger" onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal isOpen={showForm} toggle={toggleForm}>
        <ModalHeader toggle={toggleForm}>Add Product</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="refPdt">RefPdt</Label>
              <Input type="number" id="refPdt" placeholder="Product Reference" name="refPdt" value={product.refPdt} onChange={handleChange} required />
              {errors.refPdt && <span style={{ color: 'red' }}>{errors.refPdt}</span>}
            </FormGroup>
            <FormGroup>
              <Label for="designation">Designation</Label>
              <Input type="text" id="designation" placeholder="Product Designation" name="designation" value={product.designation} onChange={handleChange} required />
              {errors.designation && <span style={{ color: 'red' }}>{errors.designation}</span>}
            </FormGroup>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input type="textarea" id="description" placeholder="Product Description" name="description" value={product.description} onChange={handleChange} required />
              {errors.description && <span style={{ color: 'red' }}>{errors.description}</span>}
            </FormGroup>
            <FormGroup>
              <Label for="prix">Prix</Label>
              <Input type="number" id="prix" placeholder="Product Price" name="prix" value={product.prix} onChange={handleChange} required />
              {errors.prix && <span style={{ color: 'red' }}>{errors.prix}</span>}
            </FormGroup>
            <FormGroup>
              <Label for="image">Image</Label>
              <Input type="text" id="image" placeholder="Product Image URL" name="image" value={product.image} onChange={handleChange} />
              {errors.image && <span style={{ color: 'red' }}>{errors.image}</span>}
            </FormGroup>
            <FormGroup>
              <Label for="qteStock">QteStock</Label>
              <Input type="number" id="qteStock" placeholder="Product Quantity" name="qteStock" value={product.qteStock} onChange={handleChange} required />
              {errors.qteStock && <span style={{ color: 'red' }}>{errors.qteStock}</span>}
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit" onClick={handleSubmit}>
            {product.id ? 'Update Product' : 'Add Product'}
          </Button>
          <Button color="secondary" onClick={toggleForm}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default AddProduct
