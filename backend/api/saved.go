package api

import (
	"net/http"

	"github.com/aziule/simple-logs-gui/backend/storage"
)

func (api *Api) HandleGetSavedRemoteServers(w http.ResponseWriter, req *http.Request) {
	records, err := storage.GetRemoteServers()

	if err != nil {
		api.writeError(w, err.Error(), 400)
		return
	}

	api.writeJson(w, records)
}
