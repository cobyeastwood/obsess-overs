package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/cobyeastwood/obsessovers/types"
	"github.com/cobyeastwood/obsessovers/utility"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v7"
	"github.com/twinj/uuid"
)

type user struct {
	UserEmail    string `json:"user_email"`
	UserPassword string `json:"user_password"`
}

// CreateToken func
func CreateToken(userID uint64) (*types.TokenDetails, error) {

	td := &types.TokenDetails{}

	td.AtExpires = time.Now().Add(time.Minute * 40).Unix()
	td.AccessUUID = uuid.NewV4().String()

	td.RtExpires = time.Now().Add(time.Hour * 24 * 7).Unix()
	td.RefreshUUID = uuid.NewV4().String()

	var err error

	// os.Setenv("ACCESS_SECRET", "")
	atClaims := jwt.MapClaims{}
	atClaims["authorized"] = true
	atClaims["access_UUID"] = td.AccessUUID
	atClaims["user_id"] = userID
	atClaims["exp"] = time.Now().Add(time.Minute * 40).Unix()
	at := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims)

	if td.AccessToken, err = at.SignedString([]byte(os.Getenv("ACCESS_SECRET"))); err != nil {
		return nil, err
	}

	// os.Setenv("REFRESH_SECRET", "")
	rtClaims := jwt.MapClaims{}
	rtClaims["refresh_UUID"] = td.RefreshUUID
	rtClaims["user_id"] = userID
	rtClaims["exp"] = td.RtExpires
	rt := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims)

	if td.RefreshToken, err = rt.SignedString([]byte(os.Getenv("REFRESH_SECRET"))); err != nil {
		log.Fatal(err)
	}

	if err != nil {
		return nil, err
	}

	return td, nil

}

// CreateAuth func
func CreateAuth(userID uint64, td *types.TokenDetails, r *redis.Client) error {
	at := time.Unix(td.AtExpires, 0)
	rt := time.Unix(td.RtExpires, 0)

	now := time.Now()

	errAccess := r.Set(td.AccessUUID, strconv.Itoa(int(userID)), at.Sub(now)).Err()

	if errAccess != nil {
		return errAccess
	}

	errRefresh := r.Set(td.RefreshUUID, strconv.Itoa(int(userID)), rt.Sub(now)).Err()

	if errRefresh != nil {
		return errRefresh
	}

	return nil

}

// ExtractToken func
func ExtractToken(r *http.Request) string {
	bt := r.Header.Get("Authorization")

	strArr := strings.Split(bt, " ")

	if len(strArr) == 2 {
		return strArr[1]
	}

	return ""

}

// VerifyToken func
func VerifyToken(r *http.Request) (*jwt.Token, error) {
	tokenString := ExtractToken(r)
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signin method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("ACCESS_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	return token, nil
}

// TokenValid func
func TokenValid(r *http.Request) error {
	token, err := VerifyToken(r)
	if err != nil {
		return err
	}
	if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
		return err
	}
	return nil
}

// AccessDetails struct
type AccessDetails struct {
	AccessUUID string
	UserID     uint64
}

// ExtractTokenMetadata func
func ExtractTokenMetadata(r *http.Request) (*AccessDetails, error) {
	token, err := VerifyToken(r)
	if err != nil {
		return nil, err
	}
	claims, ok := token.Claims.(jwt.MapClaims)
	if ok && token.Valid {
		accessUUID, ok := claims["access_UUID"].(string)
		if !ok {
			return nil, err
		}
		userID, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 64)
		if err != nil {
			return nil, err
		}
		return &AccessDetails{
			AccessUUID: accessUUID,
			UserID:     userID,
		}, nil
	}
	return nil, err
}

// FetchAuth func
func FetchAuth(authD *AccessDetails, r *redis.Client) (uint64, error) {
	id, err := r.Get(authD.AccessUUID).Result()
	if err != nil {
		return 0, err
	}
	userID, _ := strconv.ParseUint(id, 10, 64)
	return userID, nil
}

// AuthMiddleware func
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		err := TokenValid(c.Request)
		if err != nil {
			c.JSON(http.StatusUnauthorized, err.Error())
			c.Abort()
			return
		}
		c.Next()
	}
}

// DeleteAuth func
func DeleteAuth(givenUUID string, r *redis.Client) (int64, error) {
	deleted, err := r.Del(givenUUID).Result()
	if err != nil {
		return 0, err
	}
	return deleted, nil
}

// Refresh func
func Refresh(r *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {

		mapToken := map[string]string{}
		if err := c.ShouldBindJSON(&mapToken); err != nil {
			c.JSON(http.StatusUnprocessableEntity, err.Error())
			return
		}
		refreshToken := mapToken["refresh_token"]

		token, err := jwt.Parse(refreshToken, func(token *jwt.Token) (interface{}, error) {
			//Make sure that the token method conform to "SigningMethodHMAC"
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(os.Getenv("REFRESH_SECRET")), nil
		})
		//if there is an error, the token must have expired
		if err != nil {
			c.JSON(http.StatusUnauthorized, "Refresh token expired")
			return
		}
		//is token valid?
		if _, ok := token.Claims.(jwt.Claims); !ok && !token.Valid {
			c.JSON(http.StatusUnauthorized, err)
			return
		}
		//Since token is valid, get the uuid:
		claims, ok := token.Claims.(jwt.MapClaims) //the token claims should conform to MapClaims
		if ok && token.Valid {
			refreshUUID, ok := claims["refresh_UUID"].(string) //convert the interface to string
			if !ok {
				c.JSON(http.StatusUnprocessableEntity, err)
				return
			}
			userID, err := strconv.ParseUint(fmt.Sprintf("%.f", claims["user_id"]), 10, 64)
			if err != nil {
				c.JSON(http.StatusUnprocessableEntity, "Error occurred")
				return
			}
			//Delete the previous Refresh Token
			deleted, delErr := DeleteAuth(refreshUUID, r)
			if delErr != nil || deleted == 0 { //if any goes wrong
				c.JSON(http.StatusUnauthorized, "unauthorized")
				return
			}
			//Create new pairs of refresh and access tokens
			ts, createErr := CreateToken(userID)
			if createErr != nil {
				c.JSON(http.StatusForbidden, createErr.Error())
				return
			}
			//save the tokens metadata to redis
			saveErr := CreateAuth(userID, ts, r)
			if saveErr != nil {
				c.JSON(http.StatusForbidden, saveErr.Error())
				return
			}
			tokens := map[string]string{
				"access_token":  ts.AccessToken,
				"refresh_token": ts.RefreshToken,
			}
			c.JSON(http.StatusCreated, tokens)
		} else {
			c.JSON(http.StatusUnauthorized, "refresh expired")
		}
	}
}

// Logout func
func Logout(r *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		au, err := ExtractTokenMetadata(c.Request)
		if err != nil {
			c.JSON(http.StatusUnauthorized, "unauthorized")
			return
		}
		deleted, delErr := DeleteAuth(au.AccessUUID, r)
		if delErr != nil || deleted == 0 { //if any goes wrong
			c.JSON(http.StatusUnauthorized, "unauthorized")
			return
		}
		c.JSON(http.StatusOK, "Successfully logged out")
	}

}

// Login func -- post handler
func Login(d *types.Driver, r *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var u user

		b, _ := c.GetRawData()

		json.Unmarshal(b, &u)

		rows, err := d.DB.Query(fmt.Sprintf(`SELECT id, email, password_hash FROM registered_users WHERE registered_users.email = '%v'`, u.UserEmail))

		if err != nil {
			log.Fatal(err)
		}

		rowsOut, errJSON := utility.StructFromJSON(rows)

		var p string
		var i string

		for _, v := range rowsOut {

			s := v.(map[string]interface{})

			p = s["password_hash"].(string)
			i = s["id"].(string)

		}

		if errJSON != nil {
			log.Fatal(errJSON)
		}

		userID, _ := strconv.Atoi(i)

		auth := utility.ComparePassword(p, u.UserPassword)

		ts, _ := CreateToken(uint64(userID))

		if saveErr := CreateAuth(uint64(userID), ts, r); saveErr != nil {
			c.JSON(http.StatusUnprocessableEntity, saveErr.Error())
		}

		tokens := map[string]string{
			"access_token":  ts.AccessToken,
			"refresh_token": ts.RefreshToken,
		}

		if auth {
			c.JSON(http.StatusAccepted, tokens)
			return
		}

		c.JSON(http.StatusUnauthorized, "Unauthorized")

	}

}

// NewUser struct -- json decoding
type NewUser struct {
	FirstName  string `json:"first_name"`
	LastName   string `json:"last_name"`
	Password   string `json:"password"`
	Hash       string
	CreatedAt  time.Time
	Email      string `json:"email"`
	AddressOne string `json:"address_one"`
	AddressTwo string `json:"address_two"`
	City       string `json:"city"`
	ZipCode    string `json:"zip_code"`
}

// Register func -- post controller
func Register(d *types.Driver, r *redis.Client) gin.HandlerFunc {

	return func(c *gin.Context) {

		var u NewUser

		b, _ := c.GetRawData()

		json.Unmarshal(b, &u)

		u.CreatedAt = time.Now().Round(time.Second)

		if u.Hash, errConv = utility.HashPassword(u.Password); errConv != nil {
			log.Fatal(errConv)
		}

		rows, err := d.InsertWithValues(`registered_users (first_name, last_name, created_at, email, password_hash, address1, address2, city, zip)`, u.FirstName, u.LastName, u.CreatedAt, u.Email, u.Hash, u.AddressOne, u.AddressTwo, u.City, u.ZipCode)

		if err != nil {
			log.Fatal(err)
		}

		rowsOut, errJSON := utility.StructFromJSON(rows)

		var i string

		for _, v := range rowsOut {

			s := v.(map[string]interface{})

			i = s["id"].(string)

		}

		if errJSON != nil {
			log.Fatal(errJSON)
		}

		userID, _ := strconv.Atoi(i)

		ts, _ := CreateToken(uint64(userID))

		if saveErr := CreateAuth(uint64(userID), ts, r); saveErr != nil {
			c.JSON(http.StatusUnprocessableEntity, saveErr.Error())
		}

		tokens := map[string]string{
			"access_token":  ts.AccessToken,
			"refresh_token": ts.RefreshToken,
		}

		c.JSON(http.StatusCreated, tokens)

	}
}
