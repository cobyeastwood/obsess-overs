package types

import (
	"sync"
	"time"
)

// TokenDetails struct
type TokenDetails struct {
	AccessToken  string
	RefreshToken string
	AccessUUID   string
	RefreshUUID  string
	AtExpires    int64
	RtExpires    int64
}

// Nutrition struct
type Nutrition struct {
	MacroNutrients []string
}

// Ingredient struct
type Ingredient struct {
	ID          int64
	Name        string
	Quantity    int32
	Measurement string
}

// IngredientJSON struct for deserialization
type IngredientJSON struct {
	ID          int32
	Name        string `json:"name"`
	Quantity    string `json:"quantity"`
	Measurement string `json:"measurement"`
}

// SetID func -- IngredientJSON SETTER method
func (i *IngredientJSON) SetID(id int32) {
	(*i).ID = id
}

// Recipe struct
type Recipe struct {
	Minutes     int32
	Tags        []string
	Description []string
	Steps       []string
	Ingredients []Ingredient
	Nutrition
	Submitted time.Time
}

// Data struct manages writes to map with reference to mutex
type Data struct {
	Recipes map[string]Recipe
	mu      sync.Mutex
}

// Adder interface
type Adder interface {
	Add(d Data, key string) ([]Recipe, error)
}

// Getter interface
type Getter interface {
	Get() Recipe
}

// Setter interface
type Setter interface {
	Set(r Recipe)
}

// NewData func points to Data struct
func NewData() *Data {
	return &Data{
		Recipes: make(map[string]Recipe),
	}
}

// Get func -- Data GETTER method
func (d *Data) Get(key string) Recipe {

	d.mu.Lock()
	defer d.mu.Unlock()

	return d.Recipes[key]
}

// Set func -- Data SETTER method
func (d *Data) Set(key string, r Recipe) {

	d.mu.Lock()
	defer d.mu.Unlock()

	d.Recipes[key] = r

}
