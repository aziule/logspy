package listener

import (
	"errors"

	"github.com/aziule/simple-logs-gui/backend/log"
)

const (
	LocalListeningStrategy Strategy = iota
	RemoteListeningStrategy
)

var (
	listenedLogFile ListenedLogFile

	ErrInvalidStrategy = errors.New("Invalid strategy")
	ErrCannotListen    = errors.New("Cannot listen to this file")
	ErrNotListening    = errors.New("No file is currently being listened to")
)

type Strategy int
type StrategyConfig map[string]interface{}

// ListenedLogFile is the interface we use to store / fetch logs from a file
type ListenedLogFile interface {
	Listen() error
	StopListening()
	GetLogs() []*log.Log
	GetPath() string
}

type logFileInfo struct {
	Logs []*log.Log
	Path string
}

func (f *logFileInfo) GetLogs() []*log.Log {
	return f.Logs
}

func (f *logFileInfo) GetPath() string {
	return f.Path
}

// GetLogs returns the current listened file's logs since a specific id
func GetLogs(sinceId int) ([]*log.Log, error) {
	if listenedLogFile == nil {
		return nil, ErrNotListening
	}

	var logs []*log.Log

	for _, log := range listenedLogFile.GetLogs() {
		if log.Id > sinceId {
			logs = append(logs, log)
		}
	}

	return logs, nil
}

// ListenToFile starts listening to a file given its path and its listening strategy
func ListenToFile(path string, strategy Strategy, config StrategyConfig) error {
	var file ListenedLogFile

	if listenedLogFile != nil {
		listenedLogFile.StopListening()
		listenedLogFile = nil
	}

	switch strategy {
	case LocalListeningStrategy:
		file = createLocallyListenedFile(path)
		break
	case RemoteListeningStrategy:
		file = createRemotelyListenedFile(path, config)
		break
	default:
		return ErrInvalidStrategy
	}

	listenedLogFile = file

	var err error

	go func() {
		err = listenedLogFile.Listen()
	}()

	if err != nil {
		return err
	}

	return nil
}
