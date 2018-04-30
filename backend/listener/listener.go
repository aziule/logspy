package listener

import (
	"crypto/sha1"
	"encoding/hex"
	"errors"

	"github.com/aziule/simple-logs-gui/backend/log"
)

const (
	LocalListeningStrategy Strategy = iota
	RemoteListeningStrategy
)

var (
	listenedLogFiles []ListenedLogFile

	ErrInvalidStrategy = errors.New("Invalid strategy")
	ErrCannotOpen      = errors.New("Cannot open this file")
	ErrNotOpened       = errors.New("The file is not opened")
	ErrAlreadyOpened   = errors.New("The file is already opened")
)

type Strategy int
type StrategyConfig map[string]interface{}

// ListenedLogFile is the interface we use to store / fetch logs from a file
type ListenedLogFile interface {
	GetHash() string
	Listen() error
	StopListening()
	GetLogs() []*log.Log
	GetPath() string
}

type logFileInfo struct {
	Hash string     `json:"hash"`
	Path string     `json:"path"`
	Logs []*log.Log `json:"-"`
}

func (f *logFileInfo) GetLogs() []*log.Log {
	return f.Logs
}

func (f *logFileInfo) GetPath() string {
	return f.Path
}

func (f *logFileInfo) GetHash() string {
	return f.Hash
}

// ListenToFile starts listening to a file given its path and its listening strategy
func ListenToFile(path string, strategy Strategy, config StrategyConfig) (ListenedLogFile, error) {
	var file ListenedLogFile

	switch strategy {
	case LocalListeningStrategy:
		file = createLocallyListenedFile(path)
		break
	case RemoteListeningStrategy:
		file = createRemotelyListenedFile(path, config)
		break
	default:
		return nil, ErrInvalidStrategy
	}

	if isFileOpened(file.GetHash()) {
		return nil, ErrAlreadyOpened
	}

	listenedLogFiles = append(listenedLogFiles, file)

	var err error

	go func() {
		err = file.Listen()
	}()

	if err != nil {
		return nil, err
	}

	return file, nil
}

// GetLogs returns the current listened file's logs since a specific id
func GetLogs(hash string, sinceId int) ([]*log.Log, error) {
	logs := make([]*log.Log, 0)

	file, err := getOpenedFileWithHash(hash)

	if err != nil {
		return logs, err
	}

	for _, log := range file.GetLogs() {
		if log.Id > sinceId {
			logs = append(logs, log)
		}
	}

	return logs, nil
}

func isFileOpened(hash string) bool {
	_, err := getOpenedFileWithHash(hash)

	if err != nil {
		return false
	}

	return true
}

func getOpenedFileWithHash(hash string) (ListenedLogFile, error) {
	for _, f := range listenedLogFiles {
		if f.GetHash() == hash {
			return f, nil
		}
	}

	return nil, ErrNotOpened
}

func generateHash(content string) string {
	hasher := sha1.New()
	_, _ = hasher.Write([]byte(content))

	return hex.EncodeToString(hasher.Sum(nil))
}
