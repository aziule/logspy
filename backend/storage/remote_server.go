package storage

import (
	"math/rand"
	"time"
)

type remoteServer struct {
	Id         int    `json:"id"`
	Name       string `json:"name"`
	Host       string `json:"host"`
	Username   string `json:"username"`
	SshKeyPath string `json:"ssh_key_path"`
}

// CreateRemoteServer creates a new RemoteServer
func CreateRemoteServer(name, host, username, sshKeyPath string) (*remoteServer, error) {
	rand.Seed(time.Now().UTC().UnixNano())
	rs := &remoteServer{
		Id:         rand.Intn(133742101) + 1,
		Name:       name,
		Host:       host,
		Username:   username,
		SshKeyPath: sshKeyPath,
	}

	s, err := getStorage()

	if err != nil {
		return nil, err
	}

	s.RemoteServers = append(s.RemoteServers, rs)

	err = s.Save()

	if err != nil {
		return nil, err
	}

	return rs, nil
}

// DeleteRemoteServer deletes a remote server based on its id
func DeleteRemoteServer(id int) error {
	s, err := getStorage()

	if err != nil {
		return err
	}

	var idx = -1

	for i, rs := range s.RemoteServers {
		if rs.Id == id {
			idx = i
		}
	}

	if idx == -1 {
		return ErrNotFound
	}

	s.RemoteServers = append(s.RemoteServers[:idx], s.RemoteServers[idx+1:]...)

	return s.Save()
}

// GetRemoteServers returns the list of available remote servers
func GetRemoteServers() ([]*remoteServer, error) {
	s, err := getStorage()

	if err != nil {
		return nil, err
	}

	if s.RemoteServers == nil {
		return make([]*remoteServer, 0), nil
	}

	return s.RemoteServers, nil
}
