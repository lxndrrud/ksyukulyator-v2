package storage

import (
	"github.com/jmoiron/sqlx"
	"github.com/lxndrrud/webviewKsyukulyator/dto"
)

type CategoryModel struct {
	db *sqlx.DB
}

func NewCategoryModel(db1 *sqlx.DB) *CategoryModel {
	return &CategoryModel{
		db: db1,
	}
}

func (s *CategoryModel) GetAll() ([]dto.Category, error) {
	categories := make([]dto.Category, 0)
	err := s.db.Select(&categories,
		`
		SELECT * FROM categories
	`)
	if err != nil {
		return []dto.Category{}, err
	}
	return categories, nil
}

func (s *CategoryModel) GetById(id int64) (dto.Category, error) {
	category := dto.Category{}
	err := s.db.Get(&category, `
		SELECT * FROM categories WHERE category_id = ?
	`, id)
	if err != nil {
		return dto.Category{}, err
	}
	return category, nil
}

func (s *CategoryModel) AddCategory(category dto.Category) error {
	tx, err := s.db.Begin()
	if err != nil {
		return err
	}
	_, err = tx.Exec(`
		INSERT INTO categories(category_title) VALUES (?)
	`, category.Title)
	if err != nil {
		errTx := tx.Rollback()
		if errTx != nil {
			return errTx
		}
		return err
	}
	err = tx.Commit()
	if err != nil {
		return err
	}
	return nil
}

func (s *CategoryModel) UpdateCategory(category dto.Category) error {
	tx, err := s.db.Begin()
	if err != nil {
		return err
	}
	_, err = tx.Exec(`
		UPDATE categories
		SET category_title = ?
		WHERE category_id = ?
	`,
		category.Title,
		category.Id)
	if err != nil {
		tx.Rollback()
		return err
	}
	err = tx.Commit()
	if err != nil {
		return err
	}
	return nil
}

func (s *CategoryModel) DeleteCategory(id int64) error {
	tx, err := s.db.Begin()
	if err != nil {
		return err
	}
	_, err = tx.Exec(`
		DELETE FROM categories WHERE categories.category_id = ?
	`, id)
	if err != nil {
		errTx := tx.Rollback()
		if errTx != nil {
			return errTx
		}
		return err
	}
	err = tx.Commit()
	if err != nil {
		return err
	}
	return nil
}
