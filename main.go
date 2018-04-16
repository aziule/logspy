package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"
	"os"
	"io/ioutil"
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
	Path string `json:"path"`
	Files []string `json:"files"`
	Directories []string `json:"directories"`
}

func apiOpenFileAction(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get("path")

	if (path == "") {
		http.Error(w, "Missing parameter \"path\"", 400)
		return
	}

	if _, err := os.Stat(path); err != nil {
		log.Panic(err)
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

	j, err := json.Marshal("ok")

	if err != nil {
		log.Panic(err)
	}

	w.Write(j)
}

func apiBrowseDirAction(w http.ResponseWriter, req *http.Request) {
	path := req.URL.Query().Get("path")

	if (path == "") {
		wd, err := os.Getwd()

		if err != nil {
			log.Panic(err)
		}

		path = wd
	}

	if _, err := os.Stat(path); err != nil {
		log.Panic(err)
		http.Error(w, "Directory does not exist", 400)
		return
	}

	files, err := ioutil.ReadDir(path)

	if err != nil {
		log.Panic(err)
	}

	currentDir := &Directory{
		Path: path,
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

	j, err := json.Marshal(currentDir)

	if err != nil {
		log.Panic(err)
	}

	w.Write(j)
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

	j, err := json.Marshal(logs)

	if err != nil {
		log.Panic(err)
	}

	w.Write(j)
}
