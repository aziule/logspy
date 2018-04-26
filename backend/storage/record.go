package storage

import "encoding/json"

// record is our base struct for storing records
type record struct {
	Id   int             `json:"id"`
	Data json.RawMessage `json:"data"`
}
