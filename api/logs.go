package api

import (
	"net/http"
	"strconv"
	"time"

	"github.com/aziule/simple-logs-gui/listener"
)

func (api *Api) HandleGetLogs(w http.ResponseWriter, req *http.Request) {
	since := req.URL.Query().Get("since")
	sinceTs, err := strconv.Atoi(since)

	if err != nil {
		api.writeError(w, "Could not parse argument \"since\"", 400)
		return
	}

	sinceTime := time.Unix(int64(sinceTs), 0)

	logs, err := listener.GetLogs(sinceTime)

	if err != nil {
		api.writeError(w, err.Error(), 400)
	}

	api.writeJson(w, logs)
}
