const ls = {
    isAvailable: typeof (Storage) !== 'undefined',
    getRecent () {
        return JSON.parse(localStorage.getItem('recentFiles'))
    },
    addRecent (file) {
        var items = this.getRecent()

        if (items === null) {
            items = []
        }

        items.push(file)
        localStorage.setItem('recentFiles', JSON.stringify(items))
    }
}

export default ls
