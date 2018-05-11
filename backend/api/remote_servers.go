package api

import (
	"net/http"

	"github.com/aziule/simple-logs-gui/backend/storage"
)

// HandleGetRemoteServers returns the list of persisted remote servers
func (api *Api) HandleGetRemoteServers(w http.ResponseWriter, req *http.Request) {
	records, err := storage.GetRemoteServers()

	if err != nil {
		api.writeError(w, err.Error(), 400)
		return
	}

	api.writeJson(w, records)
}

// HandleCreateRemoteServer creates a new remote server
func (api *Api) HandleCreateRemoteServer(w http.ResponseWriter, req *http.Request) {
	req.ParseForm()

	name, err := api.getMandatoryFormData(req, "name")

	if err != nil {
		api.writeError(w, err.Error(), 400)
		return
	}

	host, err := api.getMandatoryFormData(req, "host")

	if err != nil {
		api.writeError(w, err.Error(), 400)
		return
	}

	username, err := api.getMandatoryFormData(req, "username")

	if err != nil {
		api.writeError(w, err.Error(), 400)
		return
	}

	sshKeyPath, err := api.getMandatoryFormData(req, "sshKeyPath")

	if err != nil {
		api.writeError(w, err.Error(), 400)
		return
	}

	remoteServer, err := storage.CreateRemoteServer(name, host, username, sshKeyPath)

	if err != nil {
		api.writeError(w, err.Error(), 400)
		return
	}

	api.writeJson(w, remoteServer)
}
