package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"

	"github.com/aziule/simple-logs-gui/api"
)

func main() {
	var port int
	flag.IntVar(&port, "port", 80, "Port to listen to")
	flag.Parse()

	api := &api.Api{}

	http.Handle("/", http.FileServer(http.Dir("static")))
	http.HandleFunc("/api/open", api.HandleOpenFile)
	http.HandleFunc("/api/logs", api.HandleGetLogs)
	//http.HandleFunc("/api/browse", api.HandleBrowse)

	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}
