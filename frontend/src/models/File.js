class File {
    constructor (type, path, remoteServer, hash = '') {
        this.type = type
        this.path = path
        this.remoteServer = remoteServer
        this.hash = hash
    }
}

export default File
