package dto

type Result struct {
	Value interface{} `json:"value"`
	Error error       `json:"error"`
}
