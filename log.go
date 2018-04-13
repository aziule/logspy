package main

import (
	"log"
	"os"
	"regexp"
	"time"

	"github.com/hpcloud/tail"
)

var logFile *LogFile

func init() {
	logFile = &LogFile{
		FilePath: "/home/will/work/oss_docker/webapp/symfony/var/logs/dev.log",
	}
}

type LogFile struct {
	FilePath string
	Logs     []*Log
}

type Log struct {
	Raw            string    `json:"raw"`
	Time           time.Time `json:"time"`
	Level          string    `json:"level"`
	Message        string    `json:"message"`
	ContextualInfo string    `json:"contextual_info"`
}

var r, _ = regexp.Compile(`^\[([\d]{4}-[\d]{2}-[\d]{2}\s[\d]{2}:[\d]{2}:[\d]{2})\]\s([a-zA-Z\.]*):\s(.*)\s(\{.*\})\s(\[.*\])$`)

func (f *LogFile) Tail() {
	tailChan, err := tail.TailFile(f.FilePath, tail.Config{
		Follow:   true,
		Location: &tail.SeekInfo{Whence: os.SEEK_END},
	})

	if err != nil {
		log.Panic(err)
	}

	for line := range tailChan.Lines {
		parsedLog := parseLog(line.Text)
		f.Logs = append(f.Logs, parsedLog)
	}
}

func parseLog(content string) *Log {
	parsed := r.FindStringSubmatch(content)

	parsedLog := &Log{
		Raw: content,
	}

	if len(parsed) != 6 {
		return parsedLog
	}

	logTime, err := time.Parse("2006-01-02 15:04:05", parsed[1])

	if err != nil {
		return parsedLog
	}

	parsedLog.Time = logTime
	parsedLog.Level = parsed[2]
	parsedLog.Message = parsed[3]
	parsedLog.ContextualInfo = parsed[4]

	return parsedLog
}
