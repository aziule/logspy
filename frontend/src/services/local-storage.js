const ls = {
    isAvailable: typeof (Storage) !== 'undefined',
    getRecentFiles () {
        return JSON.parse(localStorage.getItem('recentFiles'))
    },
    addRecentFile (file) {
        var files = this.getRecentFiles()

        if (files === null) {
            files = []
        }

        files.push(file)

        localStorage.setItem('recentFiles', JSON.stringify(files))
    }
}

export default ls
