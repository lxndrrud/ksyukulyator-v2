import { useState } from "react"
import {Link, useNavigate} from "react-router-dom"

function AddCategoryPage() {
    const navigate = useNavigate()
    let [error, setError] = useState(null)
    let [categoryTitle, setCategoryTitle] = useState("")

    async function saveCategory(event) {
        try {
            if (!categoryTitle) {
                setError("Ксю, ты не ввела название категории!") 
                return
            }
            let result = await addCategory(categoryTitle)
            if (result && !result.error) navigate('/categories')
            else throw 'Произошла ошибка: ' + result.error
            //if (result) window.location.href = "/pages/categories/categories.html"
        } catch(e) {
            setError(e)
        }
    }
    // <a href="/pages/categories/categories.html" className="button">Отменить</a>
    return (
        <div className="add-category-page column">
            {
                error 
                ?
                    <span>{error}</span>
                : null
            }
            <div className="content">
                <div className="input_group">
                    <label htmlFor="#categoryTitle">Название категории</label> 
                    <input type="text" className="input_text" id="categoryTitle" 
                        onChange={(e) => setCategoryTitle(e.target.value) }/>
                </div>
                
                <button onClick={saveCategory} className="button">Сохранить</button>
                <Link to="/categories" className="button">Отменить</Link>
            </div>
        </div>
    )
} 

export default AddCategoryPage
//ReactDOM.render(<AddCategoryPage />, document.getElementById('root'))