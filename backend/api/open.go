package api

import (
	"net/http"
	"os"

	"github.com/aziule/simple-logs-gui/backend/listener"
)

// HandleOpenLocalFile starts tailing a local log file
func (api *Api) HandleOpenLocalFile(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get("path")

	if path == "" {
		api.writeError(w, `Missing parameter "path"`, 400)
		return
	}

	if _, err := os.Stat(path); err != nil {
		api.writeError(w, "Could not open file or file does not exist", 400)
		return
	}

	file, err := listener.ListenToFile(path, listener.LocalListeningStrategy, nil)

	if err != nil && err != listener.ErrAlreadyOpened {
		api.writeError(w, err.Error(), 500)
		return
	}

	api.writeJson(w, file)
}

// HandleOpenFile starts tailing a remote log file
func (api *Api) HandleOpenRemoteFile(w http.ResponseWriter, req *http.Request) {
	logFilePath := req.URL.Query().Get("path")

	if logFilePath == "" {
		api.writeError(w, `Missing parameter "path"`, 400)
		return
	}

	host := req.URL.Query().Get("host")

	if host == "" {
		api.writeError(w, `Missing parameter "host"`, 400)
		return
	}

	username := req.URL.Query().Get("username")

	if username == "" {
		api.writeError(w, `Missing parameter "username"`, 400)
		return
	}

	sshKeyPath := req.URL.Query().Get("sshKeyPath")

	if sshKeyPath == "" {
		api.writeError(w, `Missing parameter "sshKeyPath"`, 400)
		return
	}

	var config = make(map[string]interface{})
	config["host"] = host
	config["username"] = username
	config["ssh_key_path"] = sshKeyPath

	file, err := listener.ListenToFile(logFilePath, listener.RemoteListeningStrategy, config)

	if err != nil && err != listener.ErrAlreadyOpened {
		api.writeError(w, err.Error(), 500)
		return
	}

	api.writeJson(w, file)
}
