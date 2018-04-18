package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

func main() {
	var port int
	flag.IntVar(&port, "port", 80, "Port to listen to")
	flag.Parse()

	http.Handle("/", http.FileServer(http.Dir("static")))
	http.HandleFunc("/api/logs", apiLogsAction)
	http.HandleFunc("/api/open", apiOpenFileAction)
	http.HandleFunc("/api/browse", apiBrowseDirAction)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}

type Directory struct {
	Path        string   `json:"path"`
	Files       []string `json:"files"`
	Directories []string `json:"directories"`
}

func apiOpenFileAction(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get("path")

	if path == "" {
		http.Error(w, "Missing parameter \"path\"", 400)
		return
	}

	if _, err := os.Stat(path); err != nil {
		http.Error(w, "Could not open file or file does not exist", 400)
		return
	}

	if logFile != nil {
		logFile.TailChan.Stop()
	}

	logFile = &LogFile{
		FilePath: path,
	}

	go logFile.Tail()

	writeJson(w, map[string]interface{}{
		"status": "ok",
	})
}

func apiBrowseDirAction(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get("path")

	if path == "" {
		wd, err := os.Getwd()

		if err != nil {
			log.Panic(err)
		}

		path = wd
	}

	if _, err := os.Stat(path); err != nil {
		http.Error(w, "Directory does not exist", http.StatusBadRequest)
		return
	}

	files, err := ioutil.ReadDir(path)

	if err != nil {
		http.Error(w, "Directory not readable", http.StatusInternalServerError)
		return
	}

	currentDir := &Directory{
		Path:  path,
		Files: []string{},
	}

	for _, file := range files {
		if file.IsDir() {
			currentDir.Directories = append(
				currentDir.Directories,
				file.Name(),
			)
		} else {
			currentDir.Files = append(
				currentDir.Files,
				file.Name(),
			)
		}
	}

	writeJson(w, currentDir)
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

	if logFile == nil {
		http.Error(w, "You must open a file first", 400)
		return
	}

	for _, log := range logFile.Logs {
		if sinceTime.Before(log.Time) {
			logs = append(logs, log)
		}
	}

	writeJson(w, logs)
}

func writeJson(w http.ResponseWriter, v interface{}) {
	j, err := json.Marshal(v)

	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Write(j)
}
