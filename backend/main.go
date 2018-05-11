package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/aziule/simple-logs-gui/backend/api"
	"github.com/gorilla/mux"
)

func main() {
	var port int
	flag.IntVar(&port, "port", 80, "Port to listen to")
	flag.Parse()

	api := &api.Api{}

	r := mux.NewRouter()
	r.Handle("/", http.FileServer(http.Dir("../frontend/dist")))
	r.HandleFunc("/api/open/local", api.HandleOpenLocalFile)
	r.HandleFunc("/api/open/remote", api.HandleOpenRemoteFile)
	r.HandleFunc("/api/logs", api.HandleGetLogs)
	r.HandleFunc("/api/remote-servers", api.HandleGetRemoteServers).Methods("GET")
	r.HandleFunc("/api/remote-servers", api.HandleCreateRemoteServer).Methods("POST")
	r.HandleFunc("/api/remote-servers/{id}", api.HandleDeleteRemoteServer).Methods("DELETE")

	http.Handle("/", r)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
