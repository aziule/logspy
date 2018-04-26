package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/aziule/simple-logs-gui/backend/api"
)

func main() {
	var port int
	flag.IntVar(&port, "port", 80, "Port to listen to")
	flag.Parse()

	api := &api.Api{}

	http.Handle("/", http.FileServer(http.Dir("../frontend/dist")))
	http.HandleFunc("/api/open/local", api.HandleOpenLocalFile)
	http.HandleFunc("/api/open/remote", api.HandleOpenRemoteFile)
	http.HandleFunc("/api/logs", api.HandleGetLogs)

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
