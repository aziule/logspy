package listener

import (
	"errors"
	"time"

	"github.com/aziule/simple-logs-gui/log"
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

// ListenedLogFile is the interface we use to store / fetch logs from a file
type ListenedLogFile interface {
	Listen() error
	StopListening()
	GetLogs() []*log.Log
}

// GetLogs returns the current listened file's logs since a specific date
func GetLogs(since time.Time) ([]*log.Log, error) {
	if listenedLogFile == nil {
		return nil, ErrNotListening
	}

	var logs []*log.Log

	for _, log := range listenedLogFile.GetLogs() {
		if since.Before(log.Time) {
			logs = append(logs, log)
		}
	}

	return logs, nil
}

// ListenToFile starts listening to a file given its path and its listening strategy
func ListenToFile(path string, strategy Strategy) error {
	var file ListenedLogFile

	if listenedLogFile != nil {
		listenedLogFile.StopListening()
		listenedLogFile = nil
	}

	switch strategy {
	case LocalListeningStrategy:
		file = createRemotelyListenedFile(path)
		break
	case RemoteListeningStrategy:
		file = createRemotelyListenedFile(path)
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
