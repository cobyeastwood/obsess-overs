package api

import (
	"log"
	"net/http"
	"strings"

	"github.com/cobyeastwood/obsessovers/types"
	"github.com/gin-gonic/gin"
)

// DeletePantryIngredient func -- delete controller
func DeletePantryIngredient(d *types.Driver) gin.HandlerFunc {
	return func(c *gin.Context) {

		ids := strings.Split(c.Params.ByName("ingredients_id"), ",")

		r, errSQL := d.DeleteWithValues(`user_pantry`, ids)

		if errSQL != nil {
			log.Fatal(errSQL)
		}

		c.JSON(http.StatusAccepted, r)

	}
}
