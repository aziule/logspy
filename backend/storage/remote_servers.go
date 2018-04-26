package storage

type RemoteServer struct {
	Id         int    `json:"id"`
	Host       string `json:"host"`
	Username   string `json:"username"`
	SshKeyPath string `json:"ssh_key_path"`
}

// GetRemoteServers returns the list of available remote servers
func GetRemoteServers() ([]*RemoteServer, error) {
	s, err := getStorage()

	if err != nil {
		return nil, err
	}

	if s.RemoteServers == nil {
		return make([]*RemoteServer, 0), nil
	}

	return s.RemoteServers, nil
}
