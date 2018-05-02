class RemoteServer {
    constructor (id, name, host, username, sshKeyPath) {
        this.id = id
        this.name = name
        this.host = host
        this.username = username
        this.sshKeyPath = sshKeyPath
    }
}

export default RemoteServer
