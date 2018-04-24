package listener

import (
	"bufio"
	"errors"
	"io"

	"github.com/aziule/simple-logs-gui/log"
	"github.com/aziule/simple-logs-gui/ssh"
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
	Client *ssh.Client
}

// Message is the struct used to transfer data from the remote server
type Message struct {
	Host    string
	Content string
}

// createLocallyListenedFile creates an instance of remotelyListenedLogFile and initialises it
// but without starting to listen to it
func createRemotelyListenedFile(path string) ListenedLogFile {
	client := &ssh.Client{
		Host:           "www119.avantiplc.net:22",
		User:           "wclaude",
		PrivateKeyPath: "/home/will/.ssh/id_rsa",
	}

	return &remotelyListenedLogFile{
		logFileInfo: &logFileInfo{
			Path: path,
		},
		Client: client,
	}
}

// Listen starts listening for incoming logs and stores them
func (f *remotelyListenedLogFile) Listen() error {
	if err := f.Client.Connect(); err != nil {
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

	// tail -f /opt/webapp/cd026c6fb3c820bf48aa56cb7fa16010af06da0a69bebf4592d93e113af616f0d3a083c0f51c61760c30380e2a8e6510bd8e4f3cbee365716c8f42019ba539cd/symfony/var/logs/prod.log
	//if err = session.Start("tail -f /tmp/test"); err != nil {
	if err = session.Start("tail -f /opt/webapp/cd026c6fb3c820bf48aa56cb7fa16010af06da0a69bebf4592d93e113af616f0d3a083c0f51c61760c30380e2a8e6510bd8e4f3cbee365716c8f42019ba539cd/symfony/var/logs/prod.log"); err != nil {
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
