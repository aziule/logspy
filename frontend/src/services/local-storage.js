const ls = {
    isAvailable: typeof (Storage) !== 'undefined',
    getRecentFiles () {
        var files = JSON.parse(localStorage.getItem('recentFiles'))

        if (files === null) {
            files = []
        }

        return files
    },
    addRecentFile (file) {
        var files = this.getRecentFiles()
        var exists = false

        for (var i = 0, nbFiles = files.length; i < nbFiles; i++) {
            if (files[i].hash === file.hash) {
                exists = true
                files[i].updatedAt = new Date().getTime()
            }
        }

        if (!exists) {
            file.updatedAt = new Date().getTime()
            files.push(file)
        }

        localStorage.setItem('recentFiles', JSON.stringify(files))
    },
    removeRecentFile (file) {
        var files = this.getRecentFiles()

        for (var i = 0, nbFiles = files.length; i < nbFiles; i++) {
            if (files[i].hash === file.hash) {
                files.splice(i, 1)
                break
            }
        }

        localStorage.setItem('recentFiles', JSON.stringify(files))
    }
}

export default ls
