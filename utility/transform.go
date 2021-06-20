package utility

import (
	"database/sql"
	"encoding/base64"
	"errors"
	"log"
	"sync"

	"github.com/cobyeastwood/obsessovers/types"
	"golang.org/x/crypto/bcrypt"
)

var (
	mu       sync.Mutex
	count    int32
	leng     int
	errEmpty = errors.New("data interface is empty")
)

type convert struct {
	scan []interface{}
}

func (c *convert) set(count int) {
	c.scan = make([]interface{}, count)
}

// StructFromJSON func -- SQL deserialization
func StructFromJSON(rows *sql.Rows) ([]interface{}, error) {
	var c convert

	columnTypes, err := rows.ColumnTypes()

	if err != nil {
		log.Fatal(err)
	}

	count := len(columnTypes)
	finalRows := []interface{}{}

	for rows.Next() {

		c.set(count)

		for i, v := range columnTypes {

			switch v.DatabaseTypeName() {
			case "VARCHAR", "TEXT", "UUID", "TIMESTAMP":
				c.scan[i] = new(sql.NullString)
				break
			case "BOOL":
				c.scan[i] = new(sql.NullBool)
				break
			case "INT4":
				c.scan[i] = new(sql.NullInt64)
				break
			default:
				c.scan[i] = new(sql.NullString)
			}
		}

		err := rows.Scan(c.scan...)

		if err != nil {
			log.Fatal(err)
		}

		masterData := map[string]interface{}{}

		for i, v := range columnTypes {

			if z, ok := (c.scan[i]).(*sql.NullBool); ok {
				masterData[v.Name()] = z.Bool
				continue
			}

			if z, ok := (c.scan[i]).(*sql.NullString); ok {
				masterData[v.Name()] = z.String
				continue
			}

			if z, ok := (c.scan[i]).(*sql.NullInt64); ok {
				masterData[v.Name()] = z.Int64
				continue
			}

			if z, ok := (c.scan[i]).(*sql.NullFloat64); ok {
				masterData[v.Name()] = z.Float64
				continue
			}

			if z, ok := (c.scan[i]).(*sql.NullInt32); ok {
				masterData[v.Name()] = z.Int32
				continue
			}

			masterData[v.Name()] = c.scan[i]

		}

		finalRows = append(finalRows, masterData)

	}

	if len(finalRows) == 0 {
		return finalRows, errEmpty
	}

	return finalRows, nil

}

// GoRatings func -- SELECT MULTIPLE statement
func GoRatings(d *types.Driver, id []interface{}) ([]interface{}, error) {

	s, _ := d.DB.Prepare("SELECT AVG(rating) FROM raw_interactions WHERE recipe_id = $1 AND rating <> 0 LIMIT 10")

	rows, e := s.Query(id...)

	defer rows.Close()

	if e != nil {
		log.Fatal(e)
	}

	return StructFromJSON(rows)

}

// HashPassword func -- Password hashing
func HashPassword(password string) (string, error) {
	hb, err := bcrypt.GenerateFromPassword([]byte(password), 10)

	if err != nil {
		log.Fatal(err)
	}

	str := base64.StdEncoding.EncodeToString(hb)

	return str, nil
}

// ComparePassword func -- Password hash to password string
func ComparePassword(hash, password string) bool {

	b, err := base64.StdEncoding.DecodeString(hash)

	if err != nil {
		return false
	}

	err = bcrypt.CompareHashAndPassword(b, []byte(password))

	return err == nil

}

// Increment func -- COUNT INCREMENT method
func Increment() int32 {
	count++
	return count
}
