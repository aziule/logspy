package log

import (
	"regexp"
	"time"
)

var regex, _ = regexp.Compile(`^\[([\d]{4}-[\d]{2}-[\d]{2}\s[\d]{2}:[\d]{2}:[\d]{2})\]\s([a-zA-Z\.]*):\s(.*)\s(\{.*\})\s(\[.*\])$`)

//var regex, _ = regexp.Compile(`^\[([\d]{4}-[\d]{2}-[\d]{2}\s[\d]{2}:[\d]{2}:[\d]{2})\]\s([a-zA-Z\.]*):\s(.*)\s(\{?\[?.*\{?\]?)\s(\[.*\])$`)

// ParseString parses content and returns a Log struct
func ParseString(content string) *Log {
	parsed := regex.FindStringSubmatch(content)

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
