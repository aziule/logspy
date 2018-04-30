package listener

import (
	"bufio"
	"errors"
	"io"
	"fmt"

	"github.com/aziule/simple-logs-gui/backend/log"
	"github.com/aziule/simple-logs-gui/backend/ssh"
	cssh "golang.org/x/crypto/ssh"
)

var (
	ErrCannotCreateSession = errors.New("Cannot create session")
	ErrCannotCreatePty     = errors.New("Cannot create PTY")
	ErrRedirectFailed      = errors.New("Std redirect failed")
	ErrCannotExecuteTail   = errors.New("Cannot execute tail on remote server")
)

type remotelyListenedLogFile struct {
	*logFileInfo
	Client *ssh.Client `json:"-"`
}

// Message is the struct used to transfer data from the remote server
type Message struct {
	Host    string
	Content string
}

// createLocallyListenedFile creates an instance of remotelyListenedLogFile and initialises it
// but without starting to listen to it
func createRemotelyListenedFile(path string, config StrategyConfig) ListenedLogFile {
	host := config["host"].(string)
	username := config["username"].(string)
	privateKeyPath := config["ssh_key_path"].(string)

	hash := generateHash(fmt.Sprintf("remote-%s-%s", host, path))

	client := &ssh.Client{
		Host:           host,         //"www119.avantiplc.net:22",
		User:           username,     //"wclaude",
		PrivateKeyPath: privateKeyPath, //"/home/will/.ssh/id_rsa",
	}

	return &remotelyListenedLogFile{
		logFileInfo: &logFileInfo{
			Hash: hash,
			Path: path,
		},
		Client: client,
	}
}

// Listen starts listening for incoming logs and stores them
func (f *remotelyListenedLogFile) Listen() error {
	if err := f.Client.Connect(); err != nil {
		fmt.Sprintf(err.Error())
		return err
	}

	defer f.Client.Close()

	session, err := f.Client.NewSession()

	if err != nil {
		return ErrCannotCreateSession
	}

	defer session.Close()

	if err := session.RequestPty("xterm", 80, 40, cssh.TerminalModes{
		cssh.ECHO:          0,
		cssh.TTY_OP_ISPEED: 14400,
		cssh.TTY_OP_OSPEED: 14400,
	}); err != nil {
		return ErrCannotCreatePty
	}

	stdout, err := session.StdoutPipe()

	if err != nil {
		return ErrRedirectFailed
	}

	go func() {
		err = f.readFile(&stdout)
	}()

	if err != nil {
		return err
	}

	if err = session.Start(fmt.Sprintf("tail -f %s", f.Path)); err != nil {
		return ErrCannotExecuteTail
	}

	if err = session.Wait(); err != nil {
		return ErrCannotExecuteTail
	}

	return nil
}

// readFile reads a file line by line and appends logs to the main struct
func (f *remotelyListenedLogFile) readFile(input *io.Reader) error {
	reader := bufio.NewReader(*input)

	for {
		line, _, err := reader.ReadLine()

		if err != nil || io.EOF == err {
			if err != io.EOF {
				return ErrCannotExecuteTail
			}
			break
		}

		parsedLog := log.ParseString(string(line))
		parsedLog.Id = len(f.Logs) + 1

		f.Logs = append(f.Logs, parsedLog)
	}

	return nil
}

func (f *remotelyListenedLogFile) StopListening() {
	f.Client.Close()
}
