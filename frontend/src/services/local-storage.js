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

        files.push(file)

        localStorage.setItem('recentFiles', JSON.stringify(files))
    }
}

export default ls
