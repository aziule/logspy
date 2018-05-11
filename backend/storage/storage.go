package storage

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"os"
)

var (
	db            = "azi_db.json"
	canUseStorage = true

	ErrCorruptedDb = errors.New("Corrupted database file")
)

type storage struct {
	RemoteServers []*remoteServer `json:"remote_servers"`
}

// Save updates the storage
func (s *storage) Save() error {
	j, err := json.Marshal(s)

	if err != nil {
		panic(err)
	}

	return ioutil.WriteFile(db, j, 0644)
}

// storage returns the full storage object
func getStorage() (*storage, error) {
	var s storage

	if !canUseStorage {
		return nil, nil
	}

	raw, err := ioutil.ReadFile(db)

	if err != nil {
		return nil, err
	}

	err = json.Unmarshal(raw, &s)

	if err != nil {
		return nil, ErrCorruptedDb
	}

	return &s, nil
}

func createConfigFile() {
	emptyStorage := &storage{}

	err := emptyStorage.Save()

	if err != nil {
		canUseStorage = false
		return
	}
}

// init checks if the db file exists and creates it if it does not
//
// If, for any reason, we can't create / use the DB file, we won't
// panic as we still want to be able to use the application. Simply,
// the storage will not be able to work
func init() {
	_, err := os.Stat(db)

	if err != nil {
		if !os.IsNotExist(err) {
			canUseStorage = false
			return
		}

		createConfigFile()
	}
}
