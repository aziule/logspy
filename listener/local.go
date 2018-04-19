package listener

import (
	"os"

	"github.com/aziule/simple-logs-gui/log"
	"github.com/hpcloud/tail"
)

// TODO: add some inheritance for Path and Logs
type locallyListenedLogFile struct {
	*logFileInfo
	TailChan *tail.Tail
}

// createLocallyListenedFile creates an instance of locallyListenedLogFile and initialises it
// but without starting to listen to it
func createLocallyListenedFile(path string) ListenedLogFile {
	return &locallyListenedLogFile{
		logFileInfo: &logFileInfo{
			Path: path,
		},
	}
}

// Listen starts listening for incoming logs and stores them
func (f *locallyListenedLogFile) Listen() error {
	tailChan, err := tail.TailFile(f.Path, tail.Config{
		Follow:   true,
		Location: &tail.SeekInfo{Whence: os.SEEK_END},
	})

	if err != nil {
		return ErrCannotListen
	}

	f.TailChan = tailChan

	for line := range f.TailChan.Lines {
		parsedLog := log.ParseString(line.Text)
		f.Logs = append(f.Logs, parsedLog)
	}

	return nil
}

func (f *locallyListenedLogFile) StopListening() {
	f.TailChan.StopAtEOF()
}
