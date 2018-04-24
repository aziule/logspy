package api

import (
	"net/http"
	"strconv"

	"github.com/aziule/simple-logs-gui/listener"
	"github.com/aziule/simple-logs-gui/log"
)

func (api *Api) HandleGetLogs(w http.ResponseWriter, req *http.Request) {
	since := req.URL.Query().Get("since")
	sinceId, err := strconv.Atoi(since)

	if err != nil {
		api.writeError(w, "Could not parse argument \"since\"", 400)
		return
	}

	logs, err := listener.GetLogs(sinceId)

	if err != nil {
		api.writeError(w, err.Error(), 400)
		return
	}

	if logs == nil {
		logs = make([]*log.Log, 0)
	}

	api.writeJson(w, logs)
}
