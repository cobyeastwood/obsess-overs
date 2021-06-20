package api

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/cobyeastwood/obsessovers/types"
	"github.com/cobyeastwood/obsessovers/utility"
	"github.com/fogleman/gg"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v7"
	"github.com/otiai10/gosseract"
)

// Global Errors for Debugging
var (
	errImage error = errors.New("error loading image file")
)

// Pantry struct -- json support
type Pantry struct {
	ID       int64 `json:"id"`
	UserID   uint64
	Name     string `json:"ingredient_name"`
	Quantity int    `json:"quantity"`
	Cost     int    `json:"cost"`
}

// PostPantryIngredient func -- get controller
func PostPantryIngredient(d *types.Driver, r *redis.Client) gin.HandlerFunc {
	var p Pantry
	return func(c *gin.Context) {

		t, errToken := ExtractTokenMetadata(c.Request)

		userID, err := FetchAuth(t, r)

		if errToken != nil {
			log.Fatal(errToken)
		}

		b, err := c.GetRawData()

		json.Unmarshal(b, &p)

		p.UserID = userID

		if err != nil {
			log.Fatal(err)
		}

		r, errSQL := d.InsertWithValues(`user_pantry (id, user_id, ingredient_name, quantity, cost)`, p.ID, p.UserID, p.Name, p.Quantity, p.Cost)

		if errSQL != nil {
			log.Fatal(errSQL)
		}

		c.JSON(http.StatusCreated, r)

	}
}

// PostIngredient func -- post controller
func PostIngredient(d *types.Driver) gin.HandlerFunc {

	var i types.IngredientJSON

	return func(c *gin.Context) {

		b, _ := c.GetRawData()

		json.Unmarshal(b, &i)

		i.SetID(utility.Increment())

		cy := strconv.Itoa(int(i.ID))

		d.InsertWithValues(`food (category, food_name, cost, quanity)`, cy, i.Name, i.Measurement, i.Quantity)

		c.JSON(http.StatusCreated, i)

	}

}

// PostIngredientByForm func -- post controller
func PostIngredientByForm(d *types.Driver) gin.HandlerFunc {
	return func(c *gin.Context) {
		n := c.PostForm("name")
		p := c.PostForm("price")
		q := c.PostForm("quantity")
		m := c.PostForm("measurement")

		i, _ := strconv.Atoi(q)

		r, err := d.InsertWithValues(`food (food_name, price, quanity, measurement)`, n, p, i, m)

		if err != nil {
			log.Fatal(errDB)
		}

		// Send Goroutine to fetch recipe recommendations

		c.JSON(http.StatusCreated, r)

	}

}

// RemoveDups func
func RemoveDups(str []string) string {

	var strs string

	keys := make(map[string]bool)

	for _, c := range str {
		if len(c) > 2 {
			if _, v := keys[c]; !v {
				keys[c] = true
				s := fmt.Sprintf("'%v',", c)
				strs += s
			}
		}
	}

	return strs
}

// StringClean func
func StringClean(str string) string {
	space := regexp.MustCompile(`\s+`)
	chars := regexp.MustCompile(`\W`)
	digit := regexp.MustCompile(`\d`)

	words := strings.TrimSpace(digit.ReplaceAllString(chars.ReplaceAllString(str, " "), ""))

	s := strings.Split(space.ReplaceAllString(strings.ToLower(
		words), " "), " ")

	return RemoveDups(s)
}

// PostIngredientByImage func -- post images
func PostIngredientByImage(d *types.Driver, r *redis.Client) gin.HandlerFunc {

	return func(c *gin.Context) {
		var str string

		c.Request.ParseMultipartForm(10 << 20)

		file, h, err := c.Request.FormFile("myFile")

		if err != nil {
			log.Fatal(errImage)
		}

		defer file.Close()

		i := strings.LastIndex(h.Filename, ".")

		if i > 0 {
			str = fmt.Sprintf("upload-*%s", h.Filename[i:len(h.Filename)])
		}

		t, err := ioutil.TempFile("temp-images", str)

		if err != nil {
			log.Fatal(errImage)
		}

		defer t.Close()

		b, err := ioutil.ReadAll(file)

		if err != nil {
			log.Fatal(errImage)
		}

		s, _ := BytesToString(b)

		strs := StringClean(s)

		rows, _ := d.DB.Query(fmt.Sprintf(`SELECT DISTINCT processed FROM map_ingredients WHERE processed in (%v)`, strs[:len(strs)-1]))

		rowsOut, _ := utility.StructFromJSON(rows)

		token, _ := ExtractTokenMetadata(c.Request)

		userID, _ := FetchAuth(token, r)

		var p Pantry
		var row *sql.Rows

		for _, v := range rowsOut {

			s := v.(map[string]interface{})

			p.ID = time.Now().UnixNano()
			p.UserID = userID
			p.Name = s["processed"].(string)
			p.Cost = 0
			p.Quantity = 0

			row, _ = d.InsertWithValues(`user_pantry (id, user_id, ingredient_name, quantity, cost)`, p.ID, userID, p.Name, p.Cost, p.Quantity)

		}

		_, errW := t.Write(b)

		if errW != nil {
			log.Fatal(errW)
		}

		c.JSON(http.StatusCreated, row)

		// Image Upload
		// https://tutorialedge.net/golang/go-file-upload-tutorial/

	}

}

// WriteToImage func
func WriteToImage() {
	const S = 1024
	im, err := gg.LoadImage("temp-images/upload-609936680.jpeg")
	if err != nil {
		log.Fatal(err)
	}

	dc := gg.NewContext(S, S)
	dc.SetRGB(1, 1, 1)
	dc.Clear()
	dc.SetRGB(0, 0, 0)
	if err := dc.LoadFontFace("/Library/Fonts/Arial.ttf", 96); err != nil {
		panic(err)
	}
	dc.DrawStringAnchored("Hello, world!", S/2, S/2, 0.5, 0.5)

	dc.DrawRoundedRectangle(0, 0, 512, 512, 0)
	dc.DrawImage(im, 0, 0)
	dc.DrawStringAnchored("Hello, world!", S/2, S/2, 0.5, 0.5)
	dc.Clip()
	dc.SavePNG("out.png")
}

// ORC func
func ORC() {
	ImageToString("temp-images/upload-609936680.jpeg")
}

// ImageToString func
func ImageToString(imagePath string) (string, error) {
	c := gosseract.NewClient()
	defer c.Close()

	c.SetLanguage()
	c.SetImage(imagePath)

	return c.Text()
}

// BytesToString func
func BytesToString(b []byte) (string, error) {
	c := gosseract.NewClient()
	defer c.Close()

	c.SetLanguage()
	c.SetImageFromBytes(b)

	return c.Text()
}

// @name: v2
// @desc: Holds all v2 sub controllers
// @date: Oct 13, 2020
