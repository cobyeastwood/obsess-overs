package types

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"strings"

	"github.com/go-redis/redis/v7"
)

var (
	s   *sql.Stmt
	err = errors.New("sql querying error")
)

// Driver struct for database connections
type Driver struct {
	DB *sql.DB
}

// Redis struct for storing session storage
type Redis struct {
	RS *redis.Client
}

// NewClient func points to Redis struct
func NewClient(rs *redis.Client) *Redis {

	if _, err := rs.Ping().Result(); err != nil {
		log.Fatal(err)
	}

	return &Redis{
		RS: rs,
	}
}

// NewDriver func points to Driver struct
func NewDriver(db *sql.DB) *Driver {

	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	return &Driver{
		DB: db,
	}
}

// Ping func -- Driver TEST method for database connection
func (d *Driver) Ping() error {
	return d.DB.Ping()
}

// SelectByQuantity func -- Driver SELECT method
func (d *Driver) SelectByQuantity(f string, q int) (*sql.Rows, error) {

	if s, err = d.DB.Prepare(fmt.Sprintf(`%v LIMIT $1`, f)); err != nil {
		log.Fatal(err)
	}

	return s.Query(q)

}

// SelectByQuery func -- Driver SELECT method
func (d *Driver) SelectByQuery(f string, i interface{}) (*sql.Rows, error) {

	if s, err = d.DB.Prepare(fmt.Sprintf(`%v`, f)); err != nil {
		log.Fatal(err)
	}

	return s.Query(i)

}

// SelectBySearch func -- Driver SELECT method
func (d *Driver) SelectBySearch(f, w string, q int, v []string) (*sql.Rows, error) {

	var str string

	for _, n := range v {
		str += fmt.Sprintf(`LIKE '%v%%' AND %v `, n, w)
	}

	i := strings.LastIndex(str, ` AND`)

	if s, err = d.DB.Prepare(fmt.Sprintf(`%v %v LIMIT $1`, f, str[:i])); err != nil {
		log.Fatal(err)
	}

	return s.Query(q)

}

// SelectBySearchExact func -- Driver SELECT method
func (d *Driver) SelectBySearchExact(f, w string, q int, v []string) (*sql.Rows, error) {

	var str string

	for _, n := range v {
		str += fmt.Sprintf("LIKE '%%''%v''%%' AND %v ", n, w)
	}

	i := strings.LastIndex(str, " AND")

	if s, err = d.DB.Prepare(fmt.Sprintf(`%v %v LIMIT $1`, f, str[:i])); err != nil {
		log.Fatal(err)
	}

	return s.Query(q)

}

// InsertWithValues func -- Driver INSERT method
func (d *Driver) InsertWithValues(f string, v ...interface{}) (*sql.Rows, error) {

	fmt.Printf("%v, %d\n", v, len(v))

	var str string

	for i := range v {
		str += fmt.Sprintf("$%d,", i+1)
	}

	if s, err = d.DB.Prepare(fmt.Sprintf(`INSERT INTO %v VALUES (%v)`, f, str[:len(str)-1])); err != nil {
		log.Fatal(err)
	}

	return s.Query(v...)

}

// DeleteWithValues func -- Driver DELETE method
func (d *Driver) DeleteWithValues(f string, v []string) (sql.Result, error) {

	fmt.Printf("%v, %d\n", v, len(v))

	var str string

	for _, id := range v {
		str += fmt.Sprintf("%v,", id)
	}

	if s, err = d.DB.Prepare(fmt.Sprintf(`DELETE FROM %v WHERE id IN (%v) RETURNING id`, f, str[:len(str)-1])); err != nil {
		log.Fatal(err)
	}

	return s.Exec()
}
