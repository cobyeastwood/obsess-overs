package api

import (
	"database/sql"
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/cobyeastwood/obsessovers/types"
	"github.com/cobyeastwood/obsessovers/utility"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v7"
)

// Global Errors for Debugging
var (
	errDB   error = errors.New("error connecting to database")
	errConv error = errors.New("error during conversion process")
	errAuth error = errors.New("not authorized")
)

// GetRecipes func -- get controller
func GetRecipes(d *types.Driver) gin.HandlerFunc {
	return func(c *gin.Context) {

		var q int

		if q, errConv = strconv.Atoi(c.Param("quantity")); errConv != nil {
			log.Fatal(errConv)
		}

		rows, err := d.SelectByQuantity(`SELECT * FROM raw_recipes WHERE LENGTH(description) >= 100 ORDER BY id`, q)

		defer rows.Close()

		if err != nil {
			log.Fatal(errDB)
		}

		rowsOut, _ := utility.StructFromJSON(rows)

		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": rowsOut})
	}

}

// GetRecipesBySearch func -- Driver method
func GetRecipesBySearch(d *types.Driver, r *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {

		var q int = 5

		i := strings.Split(c.Param("ingredient"), ",")

		rows, _ := d.SelectBySearchExact(`SELECT * FROM raw_recipes WHERE raw_recipes.ingredients`, "raw_recipes.ingredients", q, i)

		defer rows.Close()

		rowsOut, errJSON := utility.StructFromJSON(rows)

		if errJSON != nil {
			c.JSON(http.StatusOK, gin.H{"status": http.StatusNoContent, "data": "content not found"})
		}

		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": rowsOut})

	}
}

// GetRatings func -- get controller
func GetRatings(d *types.Driver) gin.HandlerFunc {
	var id int

	return func(c *gin.Context) {

		if id, errConv = strconv.Atoi(c.Param("id")); errConv != nil {
			log.Fatal(errConv)
		}

		var rows *sql.Rows

		rows, errDB = d.SelectByQuery(`SELECT AVG(rating) FROM raw_interactions WHERE recipe_id = $1 AND rating <> 0`, id)

		if errDB != nil {
			log.Fatal(errDB)
		}

		defer rows.Close()

		rowsOut, _ := utility.StructFromJSON(rows)

		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": rowsOut})
	}

}

// GetPantry func -- get controller
func GetPantry(d *types.Driver, r *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {

		t, errToken := ExtractTokenMetadata(c.Request)

		if errToken != nil {
			log.Fatal(errToken)
		}

		var userID uint64

		userID, errAuth = FetchAuth(t, r)

		if errAuth != nil {
			log.Fatal("not authorized")
		}

		var rows *sql.Rows

		rows, errDB = d.SelectByQuery(`SELECT * FROM user_pantry WHERE user_id = $1`, userID)

		if errDB != nil {
			log.Fatal(errDB)
		}

		defer rows.Close()

		rowsOut, _ := utility.StructFromJSON(rows)

		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": rowsOut})

	}
}

// GetIngredients func -- get controller
func GetIngredients(d *types.Driver) gin.HandlerFunc {
	return func(c *gin.Context) {

		var q int

		if q, errConv = strconv.Atoi(c.Param("quantity")); errConv != nil {
			log.Fatal(errConv)
		}

		var rows *sql.Rows

		rows, errDB = d.SelectByQuantity(`map_ingredients`, q)

		if errDB != nil {
			log.Fatal(errDB)
		}

		defer rows.Close()

		rowsOut, _ := utility.StructFromJSON(rows)

		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": rowsOut})
	}
}

// GetIngredientsBySearch func -- Driver method
func GetIngredientsBySearch(d *types.Driver) gin.HandlerFunc {
	return func(c *gin.Context) {

		var q int = 5

		i := []string{c.Param("ingredient")}

		rows, _ := d.SelectBySearch(`SELECT DISTINCT id, processed FROM map_ingredients WHERE map_ingredients.processed !~ '[ \t\v\b\r\n\u00a0]' AND map_ingredients.processed`, `map_ingredients.processed`, q, i)

		defer rows.Close()

		rowsOut, err := utility.StructFromJSON(rows)

		if err != nil {
			c.JSON(http.StatusOK, gin.H{"status": http.StatusNoContent, "data": "content not found"})
		}

		c.JSON(http.StatusOK, gin.H{"status": http.StatusOK, "data": rowsOut})

	}
}

// @name: v1
// @desc: Holds all v1 sub controllers
// @date: Oct 13, 2020
