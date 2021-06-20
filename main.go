/*
	OBSESS OVERS PROJECT
	@name: main
	@desc: Obsess Overs a project to help others better organize, sort, and manage favorite leftover home ingredients
	@date: Oct 12, 2020
*/

package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/cobyeastwood/obsessovers/api"
	"github.com/cobyeastwood/obsessovers/types"
	"github.com/gin-contrib/cors"
	"github.com/go-redis/redis/v7"
	"github.com/joho/godotenv"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

var (
	router = gin.Default()
	server = &http.Server{
		Addr:         os.Getenv("SERVER_ADDR"),
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
		IdleTimeout:  50 * time.Second,
		Handler:      router,
	}
	red *redis.Client

	// Global Errors for Debugging
	errDB     error = errors.New("error connecting to database")
	errServer error = errors.New("error connecting to server")
	errTest   error = errors.New("error on test route")
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Fatal(err)
	}

	db, err := sql.Open("postgres", os.Getenv("SQL_URI"))

	defer db.Close()

	if err != nil {
		log.Fatal(errDB)
	}

	d := types.NewDriver(db)

	rs := redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_ADDR"),
		Password: os.Getenv("REDIS_PASSWORD"),
		DB:       0,
	})

	if err != nil {
		log.Fatal(err)
	}

	// Development Debugger
	router.Use(gin.Logger())

	router.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowCredentials: true,
		AllowWildcard:    true,
		AllowMethods:     []string{"*"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"*"},
		MaxAge:           12 * time.Hour,
	}))

	router.MaxMultipartMemory = 8 << 20

	// Optional Subdomain Extensions
	// router.Use(readSubdomain)

	// customSubdomain := router.Group("/", subdomain)

	// {
	// 	customSubdomain.Use(static.Serve("/", static.LocalFile("./ui/build", true)))
	// 	customSubdomain.GET("/find/", subdomainName)
	// }

	a := router.Group("/api/test") // Test GET Route

	{
		a.POST("/test-ingredient", api.PostIngredient(d))
	}

	v1 := router.Group("/api/v1") // Public GET Routes

	{
		v1.GET("/overs/recipes/:quantity", api.AuthMiddleware(), api.GetRecipes(d))
		v1.GET("/overs/ratings/:id", api.AuthMiddleware(), api.GetRatings(d))
		v1.GET("/overs/ingredients/:quantity", api.AuthMiddleware(), api.GetIngredients(d))
		v1.GET("/overs/search/recipes/:ingredient", api.AuthMiddleware(), api.GetRecipesBySearch(d, rs))
		v1.GET("/overs/search/ingredients/:ingredient", api.AuthMiddleware(), api.GetIngredientsBySearch(d))

		v1.GET("/overs/users/pantry", api.AuthMiddleware(), api.GetPantry(d, rs))
	}

	v2 := router.Group("/api/v2") // Public POST Routes

	{
		v2.POST("/upload1", api.AuthMiddleware(), api.PostIngredientByForm(d))
		v2.POST("/upload-recipe-image", api.AuthMiddleware(), api.PostIngredientByImage(d, rs))
		v2.POST("/overs/pantry/update", api.AuthMiddleware(), api.PostPantryIngredient(d, rs))
	}

	v3 := router.Group("/api/v3") // Public DELETE Routes

	{
		v3.DELETE("/overs/pantry/delete/:ingredients_id", api.AuthMiddleware(), api.DeletePantryIngredient(d))
	}

	v4 := router.Group("/api/v4") // Private POST Routes

	{
		v4.POST("/register", api.Register(d, rs))
		v4.POST("/login", api.Login(d, rs))
		v4.POST("/logout", api.AuthMiddleware(), api.Logout(rs))
		v4.POST("/token/refresh", api.Refresh(rs))
	}

	// Graceful Shutdown
	// https://github.com/gin-gonic/gin#using-get-post-put-patch-delete-and-options

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(errServer)
		}
	}()

	quit := make(chan os.Signal)

	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	<-quit

	log.Println("Shutting down server...")

	p, cancel := context.WithTimeout(context.Background(), 5*time.Second)

	defer cancel()

	if err := server.Shutdown(p); err != nil {
		log.Fatal(errServer)
	}

	log.Println("Server exiting")

}

func subdomainName(c *gin.Context) {
	s := c.MustGet("recipes").(string)

	c.String(http.StatusOK, fmt.Sprintf("Uploaded subdomain=%s", s))
}

func subdomain(c *gin.Context) {
	i := strings.IndexRune(c.Request.Host, '.')

	if i > 0 {
		c.Set("recipes", c.Request.Host[0:i])
	} else {
		c.AbortWithStatus(401)
	}
}

func readSubdomain(c *gin.Context) {
	i := strings.IndexRune(c.Request.Host, '.')

	if i > 0 {
		c.Set("recipes", c.Request.Host[0:i])
	}
}

// Relavant Links and Reasources

// Golang Uber Style Guide
// https://github.com/uber-go/guide/blob/master/style.md

// Golang Json
// https://github.com/gin-gonic/gin#blank-gin-without-middleware-by-default
// https://hakaselogs.me/2018-04-20/building-a-web-app-with-go-gin-and-react/

// GoDoc Gin Gonic
// https://github.com/gin-gonic/gin#serving-data-from-reader

// Private SQL Query
// https://github.com/gchaincl/dotsql

// Kaggle DataSet
// https://www.kaggle.com/shuyangli94/food-com-recipes-and-user-interactions
