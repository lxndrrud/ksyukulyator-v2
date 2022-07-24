package window_controllers

import (
	"database/sql"

	"github.com/jchv/go-webview-selector"
	"github.com/jmoiron/sqlx"
	"github.com/lxndrrud/webviewKsyukulyator/controllers"
	"github.com/lxndrrud/webviewKsyukulyator/dto"
	"github.com/lxndrrud/webviewKsyukulyator/storage"
)

func NewWindowController(db *sqlx.DB) *WindowController {
	return &WindowController{
		productStorage:  storage.NewProductModel(db),
		categoryStorage: storage.NewCategoryModel(db),
		calcController:  controllers.NewCalculationController(),
	}
}

type WindowController struct {
	Window          webview.WebView
	productStorage  *storage.ProductModel
	categoryStorage *storage.CategoryModel
	calcController  *controllers.CalculationController
	//server          *httptest.Server
}

func (c *WindowController) LoadBindings() {
	// Products
	c.Window.Bind("loadProducts", c.LoadProducts)
	c.Window.Bind("getProduct", c.GetProduct)
	c.Window.Bind("addProduct", c.AddProduct)
	c.Window.Bind("editProduct", c.EditProduct)
	c.Window.Bind("deleteProduct", c.DeleteProduct)

	// Categories
	c.Window.Bind("loadCategories", c.LoadCategories)
	c.Window.Bind("getCategory", c.GetCategory)
	c.Window.Bind("addCategory", c.AddCategory)
	c.Window.Bind("editCategory", c.EditCategory)
	c.Window.Bind("deleteCategory", c.DeleteCategory)

	// Amounts
	c.Window.Bind("addAmountToCalc", c.AddProductToCalculation)
	c.Window.Bind("deleteAmountFromCalc", c.DeleteProductFromCalculation)
	c.Window.Bind("getAmounts", c.GetProductsAmounts)
	c.Window.Bind("filterByCategory", c.productStorage.GetByCategoryId)
}

func (c *WindowController) SetupWindow() {
	//c.server = srv
	url := "http://localhost:8083/index.html"
	c.Window = webview.New(false)
	defer c.Window.Destroy()

	c.Window.SetTitle("Ксюкулятор")
	c.Window.SetSize(1200, 800, webview.HintNone)
	c.LoadBindings()
	c.Window.Navigate(url)
	c.Window.Run()
}

func (c *WindowController) LoadProducts() dto.Result {
	products, err := c.productStorage.GetAll()
	if err != nil {
		return dto.Result{
			Value: []dto.ProductFull{},
			Error: err,
		}
	}
	return dto.Result{
		Value: products,
		Error: nil,
	}
}

func (c *WindowController) GetProduct(idProduct int64) dto.Result {
	product, err := c.productStorage.GetById(idProduct)
	if err != nil {
		return dto.Result{
			Error: err,
		}
	}
	return dto.Result{
		Value: product,
		Error: nil,
	}
}

func (c *WindowController) AddProduct(title string, cost float32, categoryId int64) dto.Result {
	idCategory := sql.NullInt64{}
	if categoryId != 0 {
		idCategory.Valid = true
		idCategory.Int64 = categoryId
	}
	err := c.productStorage.AddProduct(dto.Product{
		Title:      title,
		Cost:       cost,
		IdCategory: idCategory,
	})
	if err != nil {
		return dto.Result{
			Error: err,
		}
	}
	return dto.Result{
		Value: true,
		Error: nil,
	}
}

func (c *WindowController) EditProduct(id int64, title string, cost float32, categoryId int64) dto.Result {
	idCategory := sql.NullInt64{}
	if categoryId != 0 {
		idCategory.Valid = true
		idCategory.Int64 = categoryId
	}
	err := c.productStorage.UpdateProduct(dto.Product{
		Id:         id,
		Title:      title,
		Cost:       cost,
		IdCategory: idCategory,
	})
	if err != nil {
		return dto.Result{
			Error: err,
		}
	}
	return dto.Result{
		Value: true,
		Error: nil,
	}
}

func (c *WindowController) DeleteProduct(id int64) dto.Result {
	err := c.productStorage.DeleteProduct(id)
	if err != nil {
		return dto.Result{
			Error: err,
		}
	}
	return dto.Result{
		Value: true,
		Error: nil,
	}
}

func (c *WindowController) LoadCategories() dto.Result {
	categories, err := c.categoryStorage.GetAll()
	if err != nil {
		return dto.Result{
			Value: []dto.Category{},
			Error: err,
		}
	}
	return dto.Result{
		Value: categories,
		Error: nil,
	}

}

func (c *WindowController) GetCategory(idCategory int64) dto.Result {
	category, err := c.categoryStorage.GetById(idCategory)
	if err != nil {
		return dto.Result{
			Error: err,
		}
	}
	return dto.Result{
		Value: category,
		Error: nil,
	}
}

func (c *WindowController) AddCategory(title string) dto.Result {
	err := c.categoryStorage.AddCategory(dto.Category{
		Title: title,
	})
	if err != nil {
		return dto.Result{
			Value: false,
			Error: err,
		}
	}
	return dto.Result{
		Value: true,
		Error: nil,
	}
}

func (c *WindowController) EditCategory(id int64, title string) dto.Result {
	err := c.categoryStorage.UpdateCategory(dto.Category{
		Id:    id,
		Title: title,
	})
	if err != nil {
		return dto.Result{
			Error: err,
		}
	}
	return dto.Result{
		Value: true,
		Error: nil,
	}
}

func (c *WindowController) DeleteCategory(idCategory int64) dto.Result {
	err := c.categoryStorage.DeleteCategory(idCategory)
	if err != nil {
		return dto.Result{
			Value: false,
			Error: err,
		}
	}
	return dto.Result{
		Value: true,
		Error: nil,
	}
}

func (c *WindowController) AddProductToCalculation(idProduct int64, amount float32, amountCost float32) dto.Result {
	product, err := c.productStorage.GetById(idProduct)
	if err != nil {
		return dto.Result{
			Value: dto.ProductAmountTable{},
			Error: err,
		}
	}
	return dto.Result{
		Value: c.calcController.AddProductAmount(&dto.ProductAmount{
			Product:    product.Product,
			Amount:     amount,
			AmountCost: amountCost,
		}),
		Error: nil,
	}
}

func (c *WindowController) DeleteProductFromCalculation(idProductAmount int64) dto.Result {
	return dto.Result{
		Value: c.calcController.DeleteProductAmount(idProductAmount),
		Error: nil,
	}
}

func (c *WindowController) GetProductsAmounts() dto.Result {
	return dto.Result{
		Value: c.calcController.GetProducts(),
		Error: nil,
	}
}

func (c *WindowController) FilterByCategory(idCategory int64) dto.Result {
	products, err := c.productStorage.GetByCategoryId(idCategory)
	if err != nil {
		return dto.Result{
			Value: []dto.ProductFull{},
			Error: err,
		}
	}
	return dto.Result{
		Value: products,
		Error: nil,
	}
}
