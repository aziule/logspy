package ssh

import (
	"errors"
	"io/ioutil"
	"os"
	"path/filepath"

	cssh "golang.org/x/crypto/ssh"
)

var (
	ErrCannotConnect             = errors.New("Unable to connect")
	ErrCannotParsePrivateKeyFile = errors.New("Cannot parse the private key")
)

// Client is the struct used to connect to a remote host
type Client struct {
	*cssh.Client
	Host           string
	User           string
	PrivateKeyPath string
}

// Connect establishes a connection to the remote server
func (c *Client) Connect() error {
	conf := cssh.ClientConfig{
		User:            c.User,
		HostKeyCallback: cssh.InsecureIgnoreHostKey(),
	}

	if privateKey, err := c.getPrivateKey(); err == nil {
		conf.Auth = append(conf.Auth, privateKey)
	}

	client, err := cssh.Dial("tcp", c.Host, &conf)

	if err != nil {
		return ErrCannotConnect
	}

	c.Client = client

	return nil
}

func (c *Client) Close() {
	c.Client.Close()
}

// getPrivateKey returns an cssh.AuthMethod using the client's private key file
func (c *Client) getPrivateKey() (cssh.AuthMethod, error) {
	if c.PrivateKeyPath == "" {
		c.PrivateKeyPath = filepath.Join(os.Getenv("HOME"), ".ssh/id_rsa")
	}

	key, err := ioutil.ReadFile(c.PrivateKeyPath)

	if err != nil {
		return nil, ErrCannotParsePrivateKeyFile
	}

	signer, err := cssh.ParsePrivateKey(key)

	if err != nil {
		return nil, ErrCannotParsePrivateKeyFile
	}

	return cssh.PublicKeys(signer), nil
}
