package log

import "time"

// Log is the main struct of a log file. It contains information
// we parse from log files and that are returned to the frontend
type Log struct {
	Raw            string    `json:"raw"`
	Time           time.Time `json:"time"`
	Level          string    `json:"level"`
	Message        string    `json:"message"`
	ContextualInfo string    `json:"contextual_info"`
}
