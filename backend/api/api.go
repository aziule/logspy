package api

import (
	"encoding/json"
	"net/http"
)

// Api is the struct responsible for containing any import Api-related information
type Api struct{}

// jsonError is the struct returned when an error happens
type jsonError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

// writeJson returns a JSON-formatted interface
func (api *Api) writeJson(w http.ResponseWriter, v interface{}) {
	j, err := json.Marshal(v)

	if err != nil {
		api.writeError(w, "Internal server error", http.StatusInternalServerError)
		return
	}

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

	w.Write(j)
}
