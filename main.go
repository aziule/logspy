package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
)

func main() {
	var port int
	flag.IntVar(&port, "port", 80, "Port to listen to")
	flag.Parse()

	go logFile.Tail()

	http.Handle("/", http.FileServer(http.Dir("static")))
	http.HandleFunc("/api/logs", apiLogsAction)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}

func apiLogsAction(w http.ResponseWriter, req *http.Request) {
	since := req.URL.Query().Get("since")
	sinceTs, err := strconv.Atoi(since)

	if err != nil {
		http.Error(w, "Could not parse argument \"since\"", 400)
		return
	}

	sinceTime := time.Unix(int64(sinceTs), 0)
	logs := []*Log{}

	for _, log := range logFile.Logs {
		if sinceTime.Before(log.ParsedAt) {
			logs = append(logs, log)
		}
	}

	j, err := json.Marshal(logs)

	if err != nil {
		log.Panic(err)
	}

	w.Write(j)
}
