import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

function EditProductPage() {
  let navigate = useNavigate()
  const { idProduct } = useParams()
  let [error, setError] = useState(null)
  let [productTitle, setProductTitle] = useState('')
  let [productCost, setProductCost] = useState(0)
  let [idCategory, setIdCategory] = useState(0)
  let [categories, setCategories] = useState([])

  useEffect(() => {
    loadProduct()
    parseCategories()
  }, [])
  async function loadProduct() {
    try {
      let result = await getProduct(parseInt(idProduct))
      if (result.error) throw result.error
      setProductTitle(result.value.product_title)
      setProductCost(result.value.product_cost)
      setIdCategory(result.value.category_id)
    } catch (e) {
      setError(e)
    }
  }
  async function parseCategories() {
    try {
      let categories = await loadCategories()
      if (categories.error) throw categories.error
      setCategories(categories.value)
    } catch(e) {
      setError(e)
    }
  }
    
  async function edit() {
    try {
      let result = await editProduct(parseInt(idProduct), productTitle, parseFloat(productCost), parseInt(idCategory))
      if (result.error) throw result.error
      else navigate('/calculator')
    } catch (e) {
      setError(e)
    }
  }
  return (
    <div className="edit-product-page column">
      {
        error
        ? <span>{error}</span>
        : null
      }
      <div className="content">
        <div className="input_group">
          <label htmlFor="productTitle">Название продукта</label>
          <input type="text" name="productTitle" id="productTitle" className='input_text'
            onChange={(event) => {setProductTitle(event.target.value) }} value={productTitle} />
        </div>
        <div className="input_group">
          <label htmlFor="productCost">Стоимость продукта</label>
          <input type="text" name="productCost" id="productCost" className='input_text'
            onChange={(event) => {setProductCost(event.target.value) }} value={productCost} />
        </div>
        <div className="input_group">
          <label htmlFor="productCategory">Категория продукта</label>
          <select id="productCategory" onChange={(event) => {setIdCategory(event.target.value)}} value={idCategory}>
          <option value={0}>Без категории</option>
          {categories && categories.map(category => (
            <option key={category.category_id}
              value={category.category_id}>
                {category.category_title}
            </option>
          ))}
        </select>
        </div>
        
        <button onClick={edit} className="button">Сохранить</button>
        <Link to="/calculator" className='button' >Отменить</Link>
      </div>
    </div>
  )
}

export default EditProductPage