package api

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
)

var ErrMissingFormData = func(key string) error {
	return errors.New(fmt.Sprintf("Missing field %s", key))
}

// Api is the struct responsible for containing any import Api-related information
type Api struct{}

// jsonError is the struct returned when an error happens
type jsonError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// jsonSuccess is the struct returned when an operation succeeds and does not return any resource
type jsonSuccess struct {
	Msg string `json:"msg"`
}

// writeJson returns a JSON-formatted interface
func (api *Api) writeJson(w http.ResponseWriter, v interface{}) {
	if v == nil {
		v = &jsonSuccess{"ok"}
	}

	j, err := json.Marshal(v)

	if err != nil {
		api.writeError(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(j)
}

// writeError returns a JSON-formatted error
func (api *Api) writeError(w http.ResponseWriter, msg string, code int) {
	w.WriteHeader(code)
	j, err := json.Marshal(&jsonError{
		Code:    code,
		Message: msg,
	})

	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(j)
}

func (api *Api) getMandatoryFormData(req *http.Request, key string) (string, error) {
	val := req.Form.Get(key)

	if val == "" {
		return "", ErrMissingFormData(key)
	}

	return val, nil
}
