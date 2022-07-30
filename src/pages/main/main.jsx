import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import IconSVG from "../../components/UI/IconSVG";

function MainPage() {
  let navigate = useNavigate()
  let [amount, setAmount] = useState(0.0);
  let [amountCost, setAmountCost] = useState(0.0);
  let [sum, setSum] = useState(0.0);
  let [error, setError] = useState(null);
  let [products, setProducts] = useState([]);
  let [productsAmounts, setProductsAmounts] = useState([]);
  let [isAmountDisabled, setIsAmountDisabled] = useState(true);
  let [categories, setCategories] = useState([])
  let [selectedIdCategory, setSelectedIdCategory] = useState(-1)
  let [productEntry, setProductEntry] = useState('')

  useEffect(() => {
    parseProducts();
    parseCategories()
    parseProductsAmounts();
  }, []);

  async function parseProducts() {
    try {
      let productsLocal = await loadProducts();
      if (productsLocal.error) throw products.error
      setProducts(productsLocal.value);
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
  async function parseProductsAmounts() {
    try {
      let productsAmountsLocal = await getAmounts();
      if (productsAmountsLocal.error) throw productsAmountsLocal.error
      setProductsAmounts(productsAmountsLocal.value.products);
      setSum(productsAmountsLocal.value.sum);
    } catch (e) {
      setError(e);
    }
  }
  async function calculate(idProduct) {
    try {
      let table = await addAmountToCalc(
        parseInt(idProduct),
        parseFloat(amount),
        parseFloat(amountCost)
      );
      if (table.error) throw table.error
      setProductsAmounts(table.value.products);
      setSum(table.value.sum);
      //await parseProductsAmounts()
    } catch (e) {
      setError(e);
    }
  }
  async function delProduct(idProduct) {
    try {
      let result = await deleteProduct(idProduct);
      if (result.error) throw result.error
      if (result.value) await parseProducts();
    } catch (e) {
      setError(e);
    }
  }
  async function removeFromCalc(idProduct) {
    try {
      let table = await deleteAmountFromCalc(parseInt(idProduct));
      if (table.error) throw table.error
      setSum(table.value.sum);
      setProductsAmounts(table.value.products);
      //await parseProductsAmounts()
    } catch (e) {
      setError(e);
    }
  }
  async function filterProductsLocal(idCategory, entry='') {
    try {
      let products = await filterProducts(parseInt(idCategory), entry);
      if (products.error) throw products.error
      setProducts(products.value)
    } catch(e) {
      setError(e)
    }
  }

  
  return (
    <div className="main-page column">
      {error && <span>{error}</span>}
      <div className="main-page-content">
        <div className="column">
          <h3>Продукты</h3>
          <div className="overflow_container">
            <table id="productsTable">
              <thead>
                <tr>
                  <td>Название продукта</td>
                  <td>Количество углеводов, г / 100 г продукта</td>
                  <td>Название категории</td>
                  <td>Контроль</td>
                </tr>
              </thead>
              <tbody>
                {products &&
                  products.map((product) => (
                    <tr>
                      <td>{product.product_title}</td>
                      <td>{product.product_cost}</td>
                      <td>{product.category_title}</td>
                      <td className="row">
                        <button
                          
                          style={{border: "1px solid lightgreen"}}
                          onClick={async (e) => {
                            await calculate(product.product_id);
                          }}
                        >
                          <IconSVG 
                            color="lightgreen"
                            data="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3M19 19H5V5H19V19M6.2 7.7H11.2V9.2H6.2V7.7M13 15.8H18V17.3H13V15.8M13 13.2H18V14.7H13V13.2M8 18H9.5V16H11.5V14.5H9.5V12.5H8V14.5H6V16H8V18M14.1 10.9L15.5 9.5L16.9 10.9L18 9.9L16.6 8.5L18 7.1L16.9 6L15.5 7.4L14.1 6L13 7.1L14.4 8.5L13 9.9L14.1 10.9Z" />
                        </button>
                        <button
                          
                          style={{border: "1px solid #e9c46a"}}
                          onClick={() => {
                            navigate(`/editProduct/${product.product_id}`)
                          }}
                        >
                          <IconSVG
                            color="#e9c46a" 
                            data="M18.62,1.5C18.11,1.5 17.6,1.69 17.21,2.09L10.75,8.55L14.95,12.74L21.41,6.29C22.2,5.5 22.2,4.24 21.41,3.46L20.04,2.09C19.65,1.69 19.14,1.5 18.62,1.5M9.8,9.5L3.23,16.07L3.93,16.77C3.4,17.24 2.89,17.78 2.38,18.29C1.6,19.08 1.6,20.34 2.38,21.12C3.16,21.9 4.42,21.9 5.21,21.12C5.72,20.63 6.25,20.08 6.73,19.58L7.43,20.27L14,13.7" />
                        </button>
                        <button
                          
                          style={{border: "1px solid #e76f51", color: "#e76f51"}}
                          onClick={async (e) => {
                            await delProduct(product.product_id);
                          }}
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
        </div>
        <div className="column">
          <h3>Контроль продуктов</h3>
          <div className="main-page-controlButtons">
            <button
              onClick={async (e) => {
                await parseProducts();
              }}
              className="button"
            >
              Обновить список
            </button>
            <NavLink to="/addProduct" className="button">Добавить продукт</NavLink>

            <h3 style={{ marginTop: "20px" }}>Фильтр</h3>
            <select
              id="productCategory"
              onChange={(e) => {
                setSelectedIdCategory(parseInt(e.target.value))
                //await filterProductsByCategory(e.target.value);
              }}
            >
              <option value={-1} >Все</option>
              <option value={0} >Без категории</option>
              {
                categories && categories.map(category => (
                  <option key={category.category_id} value={category.category_id}>{category.category_title}</option>
                ))
              }
            </select>
            <input 
              className="input_text" 
              placeholder="Название продукта для поиска" 
              type="text" 
              onChange={(e) => { setProductEntry(e.target.value) }} />
            <button className="button" onClick={() => filterProductsLocal(selectedIdCategory, productEntry) } >
              Поиск
            </button>
          </div>
        </div>
        <div className="column">
            <h3>Продукты на расчёт</h3>
            <div className="overflow_container">
              <table id="amountsTable">
                <thead>
                  <tr>
                    <td>Название продукта</td>
                    <td>Количество продукта, г</td>
                    <td>Стоимость количества продукта, х.е.</td>
                    <td>Контроль</td>
                  </tr>
                </thead>
                <tbody>
                  {productsAmounts &&
                    productsAmounts.map((amount) => (
                      <tr key={amount.product_amount_id}>
                        <td>{amount.product_amount_product.product_title}</td>
                        <td>{amount.product_amount_amount}</td>
                        <td>{amount.product_amount_cost}</td>
                        <td>
                          <button
                            onClick={async () => {
                              await removeFromCalc(amount.product_amount_id);
                            }}
                            className="button"
                          >
                            Убрать из расчёта
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
          </div>
        </div>
        <div className="column">
          <h3>Контроль расчёта продуктов</h3>
          <div className="main-page-calculateControllers">
            <h4 style={{ marginTop: "2px", marginBottom: "10px;" }}>
              Выбрать тип расчёта
            </h4>
            <label for="#amount">Количество продукта, г</label>
            <input
              type="number"
              id="amount"
              className="input_text"
              disabled={isAmountDisabled}
              defaultValue={0}
              onChange={(e) => {
                setAmount(e.target.value);
              }}
              value={amount}
            />
            <button
              onClick={(e) => {
                setIsAmountDisabled(false);
                setAmountCost(0);
              }}
              className="button"
            >
              Расчитать стоимость в хлебных единицах
            </button>
            <label for="#amountCost">Количество хлебных единиц, х.е.</label>
            <input
              type="number"
              id="amountCost"
              className="input_text"
              disabled={!isAmountDisabled}
              defaultValue={0}
              onChange={(e) => {
                setAmountCost(e.target.value);
              }}
              value={amountCost}
            />
            <button
              onClick={(e) => {
                setIsAmountDisabled(true);
                setAmount(0.0);
              }}
              className="button"
            >
              Рассчитать количество продукта
            </button>
          </div>
        </div>
        
        
        <span className="ksyu">
          ИТОГО: <span id="sum">{sum}</span> хлебных единиц
        </span>
      </div>
    </div>
  );
}

export default MainPage;
