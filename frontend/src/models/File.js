class File {
    constructor (type, path, remoteServer, hash = '') {
        this.type = type
        this.path = path
        this.remoteServer = remoteServer
        this.hash = hash
        this.createdAt = new Date().getTime()
    }
}

export default File
