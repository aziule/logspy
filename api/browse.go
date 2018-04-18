package api

//import (
//	"io/ioutil"
//	"net/http"
//	"os"
//)
//
//type Directory struct {
//	Path        string   `json:"path"`
//	Files       []string `json:"files"`
//	Directories []string `json:"directories"`
//}
//
//func (api *Api) HandleBrowse(w http.ResponseWriter, req *http.Request) {
//	path := req.URL.Query().Get("path")
//
//	if path == "" {
//		wd, err := os.Getwd()
//
//		if err != nil {
//			log.Panic(err)
//		}
//
//		path = wd
//	}
//
//	if _, err := os.Stat(path); err != nil {
//		api.writeError(w, "Directory does not exist", http.StatusBadRequest)
//		return
//	}
//
//	files, err := ioutil.ReadDir(path)
//
//	if err != nil {
//		api.writeError(w, "Directory not readable", http.StatusInternalServerError)
//		return
//	}
//
//	currentDir := &Directory{
//		Path:  path,
//		Files: []string{},
//	}
//
//	for _, file := range files {
//		if file.IsDir() {
//			currentDir.Directories = append(
//				currentDir.Directories,
//				file.Name(),
//			)
//		} else {
//			currentDir.Files = append(
//				currentDir.Files,
//				file.Name(),
//			)
//		}
//	}
//
//	api.writeJson(w, currentDir)
//}
