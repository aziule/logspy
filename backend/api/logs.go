package api

import (
	"net/http"
	"strconv"

	"github.com/aziule/simple-logs-gui/backend/listener"
)

func (api *Api) HandleGetLogs(w http.ResponseWriter, req *http.Request) {
	since := req.URL.Query().Get("since")
	sinceId, err := strconv.Atoi(since)

	if err != nil {
		api.writeError(w, `Could not parse argument "since"`, 400)
		return
	}

	hash := req.URL.Query().Get("hash")

	if hash == "" {
		api.writeError(w, `Missing parameter "hash"`, 400)
		return
	}

	logs, err := listener.GetLogs(hash, sinceId)

	if err != nil {
		api.writeError(w, err.Error(), 400)
		return
	}

	api.writeJson(w, logs)
}
