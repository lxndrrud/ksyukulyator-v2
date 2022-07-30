import { useEffect, useState } from "react"
import {NavLink, useNavigate} from "react-router-dom"

function AddProductPage() {
    let navigate = useNavigate()

    let [categories, setCategories] = useState(null)
    let [title, setTitle] = useState("")
    let [cost, setCost] = useState("")
    let [categoryId, setCategoryId] = useState(0)
    let [error, setError] = useState(null)

    useEffect(() => {
        parseCategories()        
    }, [])

    async function parseCategories() {
        try {
            let result = await loadCategories()
            if (result.error) throw result.error
            setCategories(result.value)
        } catch (e) {
            setError(e)
        }
    }

    async function saveProduct(event) {
        try {
            if (!title) {
                setError("Ксю, ты не ввела название продукта!")
                return
            }
            if (!cost || parseFloat(cost) === 0 ) {
                setError("Ксю, ты не ввела стоимость продукта!")
                return
            }
            let result = await addProduct(title, parseFloat(cost), parseInt(categoryId))
            if (result.error) throw result.error
            if (result.value) navigate('/')
        } catch (e) {
            setError(e)
        }
    }

    return (
        <div className="add-product-page column">
            {
                error 
                ?
                    <span>{error}</span>
                : null
            }
            
            <div className="add-product-page-content">
                <div className="input_group">
                    <label for="#productTitle" >Название продукта</label>
                    <input type="text" id="productTitle" className="input_text" 
                        onChange={(e) => setTitle(e.target.value) } />
                </div>
                
                <div className="input_group">
                    <label for="#productCost">Стоимость продукта, г углеводов / 100 г продукта</label>
                    <input type="text" id="productCost" className="input_text"
                        onChange={(e) => setCost(e.target.value) } />
                </div>
                
                <select className="add-product-page-productCategory" onChange={(e) => setCategoryId(e.target.value) } >
                    <option value="0">
                        Без категории
                    </option>
                    {categories && categories.map(category => (
                        <option value={category.category_id}>
                            {category.category_title}
                        </option>
                    ))}
                </select>
                <button onClick={async() => { await saveProduct() }} className="button">Сохранить</button>
                
                <NavLink to="/" className="button" >Отменить</NavLink>
            </div>
            
        </div>
    )
    
}

export default AddProductPage