import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

function EditCategoryPage() {
  const navigate = useNavigate()
  const { idCategory } = useParams()
  let [error, setError] = useState(null)
  let [categoryTitle, setCategoryTitle] = useState('')

  useEffect(() => {
    loadCategory()
  }, [])
  
  async function loadCategory() {
    try {
      let result = await getCategory(parseInt(idCategory))
      if (result.error) throw result.error
      setCategoryTitle(result.value.category_title)
    } catch (e) {
      setError(e)
    }
  }

  async function edit() {
    try {
      let result = await editCategory(parseInt(idCategory), categoryTitle)
      if (result.error) throw result.error
      else navigate('/categories')
    } catch (e) {
      setError(e)
    }
  }

  return (
    <div className="edit-category-page column">
      {
        error 
        ? <span>{error}</span>
        : null
      }
      <div className="content">
        <div className="input_group">
          <label htmlFor="productTitle">Название категории</label>
          <input type="text" name="productTitle" id="productTitle" className="input_text"
            onChange={(event) => {setCategoryTitle(event.target.value)} } value={categoryTitle} />
        </div>
        <button onClick={edit} className="button">Сохранить</button>
        <Link to='/categories' className="button">Отменить</Link>
      </div>
    </div>
  )
}

export default EditCategoryPage