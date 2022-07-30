import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes,NavLink} from "react-router-dom"
import './css/main.css'
import AddCategoryPage from './pages/addCategory/addCategory'
import AddProductPage from './pages/addProduct/addProduct'
import CategoriesPage from './pages/categories/categories'
import EditCategoryPage from './pages/editCategory/editCategory'
import EditProductPage from './pages/editProduct/editProduct'
import MainPage from './pages/main/main'


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <div className="main">
                <h1 className='ksyu'>Ксюкулятор</h1>
                <nav>
                    <NavLink to="/" className="link" >Калькулятор</NavLink>
                    <NavLink to="/categories" className="link" >Категории</NavLink>
                </nav>
                <div className="anchor">
                    <Routes>
                        <Route path="/" element={<MainPage  />} />    
                        <Route path="/categories" element={<CategoriesPage/>} />
                        <Route path="/addProduct" element={<AddProductPage />} />
                        <Route path="/editProduct/:idProduct" element={<EditProductPage />} />
                        <Route path="/addCategory" element={<AddCategoryPage />} />
                        <Route path="/editCategory/:idCategory" element={<EditCategoryPage />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    </React.StrictMode>
)
