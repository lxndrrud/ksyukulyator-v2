import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import IconSVG from "../../components/UI/IconSVG";

function CategoriesPage() {
  let [categories, setCategories] = useState([]);
  let [error, setError] = useState(null);
  
  useEffect(() => {
    parseCategories()
  }, []);
  
  async function delCategory(idCategory) {
    try {
      let result = await deleteCategory(idCategory);
      if (result) setCategories(await loadCategories());
    } catch (e) {
      setError(e);
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
                   
  return (
      
        <div className="categories-page column">
          {error ? <span>{error}</span> : null}
          <div className="content">
            <div className="overflow_container">
              <table className="productCategoryTable">
                <thead>
                  <tr>
                    <td>Название категории</td>
                    <td>Контроль</td>
                  </tr>
                </thead>
                <tbody>
                  {categories && categories.map(category => (
                      <tr key={category.category_id}>
                        <td>{category.category_title}</td>
                        <td className="row">
                          <Link to={`/editCategory/${category.category_id}`} className="button">
                            <IconSVG 
                              data="M18.62,1.5C18.11,1.5 17.6,1.69 17.21,2.09L10.75,8.55L14.95,12.74L21.41,6.29C22.2,5.5 22.2,4.24 21.41,3.46L20.04,2.09C19.65,1.69 19.14,1.5 18.62,1.5M9.8,9.5L3.23,16.07L3.93,16.77C3.4,17.24 2.89,17.78 2.38,18.29C1.6,19.08 1.6,20.34 2.38,21.12C3.16,21.9 4.42,21.9 5.21,21.12C5.72,20.63 6.25,20.08 6.73,19.58L7.43,20.27L14,13.7" />
                          </Link>
                          <button
                            onClick={() => {
                              delCategory(category.category_id);
                            }}
                            className="button"
                          >
                            <IconSVG 
                              data="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <NavLink to="/addCategory" className="button">Добавить категорию</NavLink>
          </div>
        </div>
  );
};

export default CategoriesPage;
