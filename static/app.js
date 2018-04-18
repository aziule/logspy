M.AutoInit();

function LocalStorage() {
    this.recentItemsKey = 'recent';
    this.isAvailable = typeof(Storage) !== 'undefined';
};

LocalStorage.prototype.addFile = function(path) {
    if (!this.isAvailable) return;

    var items = this.getRecent();
    var itemExists = false;

    for (var i = 0; i < items.length; i++) {
        if (items[i].path === path) {
            itemExists = true;
            items[i].when = new Date().getTime();
        }
    }

    if (!itemExists) {
        items.push({
            when: new Date().getTime(),
            path: path,
            fileName: path.split('/').pop(),
        });
    }

    localStorage.setItem(this.recentItemsKey, JSON.stringify(items));
}

LocalStorage.prototype.getRecent = function() {
    if (!this.isAvailable) return [];

    var raw = localStorage.getItem(this.recentItemsKey);

    if (!raw) {
        return [];
    }

    return JSON.parse(localStorage.getItem(this.recentItemsKey)).sort(function(a, b) { return b.when - a.when; });
}

function App() {
    this.isRunning = false;

    var apiClient = new ApiClient();
    var localStorage = new LocalStorage();
    this.fileBrowser = new FileBrowser(apiClient, localStorage);
    this.logs = new Logs(apiClient);
}

function FileBrowser(apiClient, storage) {
    this.storage = storage;
    this.currentDirPath = '';
    this.openedFile = '';
    this.dirs = [];
    this.files = [];
    this.apiClient = apiClient;

    this.el = document.getElementById('file-browser');
    this.elError = document.getElementById('file-browser__error');
    this.elWrapper = document.getElementById('file-browser-wrapper');
    this.elFileInputForm = document.getElementById('file-browser__input-form');
    this.elFileInputFormInput = document.getElementById('file-browser__input-form__input');
    this.elCurrentDir = document.getElementById('current-dir');
    this.elGotoParent = document.getElementById('goto-parent');
    this.elRecentFiles = document.getElementById('recent-files');
    this.elFilesExplorer = document.getElementById('files-explorer');

    this.elFileInputForm.onsubmit = function() {
        this.selectFile(this.elFileInputFormInput.value);
        return false;
    }.bind(this);

    this.elGotoParent.onclick = function() {
        var parentDir = this.currentDirPath.split('/');
        parentDir.splice(-1, 1);
        parentDir = parentDir.join('/');
        if (parentDir === '') parentDir = '/';
        this.browseDir(parentDir);
    }.bind(this);
}

FileBrowser.prototype.browseDir = function(path) {
    if (path === undefined) path = '';

    this.apiClient.browseDir(path)
        .then(function(dirInfo) {
            this.currentDirPath = dirInfo.path;
            this.dirs = dirInfo.directories;
            this.files = dirInfo.files.filter(function(file) {
                return file.endsWith('.log');
            });
            this.render();
        }.bind(this))
        .catch(function(response) {
            console.error(response.httpStatus, response.httpStatusText);
        });
}

FileBrowser.prototype.selectFile = function(path) {
    this.apiClient.openFile(path)
        .then(function() {
            this.openedFile = path;

            this.elError.classList.remove('file-browser__error--active');
            this.storage.addFile(path);
            this.render();
        }.bind(this))
        .catch(function(response) {
            this.openedFile = '';
            this.elError.innerHTML = response.httpStatusText;
            this.elError.classList.add('file-browser__error--active');
            console.error(response.httpStatus, response.httpStatusText);
        }.bind(this));
}

FileBrowser.prototype.render = function() {
    var self = this;

    this.elCurrentDir.innerHTML = self.currentDirPath;
    this.elFilesExplorer.innerHTML = '';
    this.elRecentFiles.innerHTML = '';

    for (var index in this.dirs) {
        var dir = document.createElement('div');
        dir.className = 'dir';
        dir.appendChild(document.createTextNode(this.dirs[index]));
        dir.onclick = function() {
            var dirToBrowse = (self.currentDirPath + '/' + this.innerHTML).replace('//', '/');
            self.browseDir(dirToBrowse);
        }
        this.elFilesExplorer.appendChild(dir);
    }

    for (var index in this.files) {
        var file = document.createElement('div');
        file.className = 'file';
        file.appendChild(document.createTextNode(this.files[index]));
        this.elFilesExplorer.appendChild(file);
        file.onclick = function() {
            var fileToSelect = (self.currentDirPath + '/' + this.innerHTML).replace('//', '');
            self.selectFile(fileToSelect);
        }
    }

    var recentFiles = this.storage.getRecent();

    for (var index in recentFiles) {
        var recentWrapper = document.createElement('div');
        recentWrapper.className = 'recent-files__file';
        recentWrapper.setAttribute('data-path', recentFiles[index].path);
        recentWrapper.onclick = function() {
            var path = this.getAttribute('data-path');
            self.selectFile(path);
        };

        var recentFileName = document.createElement('div');
        recentFileName.className = 'recent-files__file-name';
        recentFileName.innerHTML = recentFiles[index].fileName;

        var recentFilePath = document.createElement('div');
        recentFilePath.className = 'recent-files__file-path';
        recentFilePath.innerHTML = recentFiles[index].path;

        recentWrapper.appendChild(recentFileName);
        recentWrapper.appendChild(recentFilePath);
        this.elRecentFiles.appendChild(recentWrapper);
    }

    this.elWrapper.className = this.openedFile ? 'hide' : '';
}

App.prototype.run = function() {
    if (this.isRunning) return;

    this.fileBrowser.browseDir();

    setInterval(function() {
        if (!this.fileBrowser.openedFile) return;
        this.logs.fetchNewLogs();
    }.bind(this), 1000);
}

function ApiClient() {
    this.get = function(url) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', url);

            xhr.onload = function() {
                if (this.status === 200) {
                    var apiData = JSON.parse(this.responseText);

                    resolve(apiData);
                    return;
                }

                reject({
                    httpStatus: this.status,
                    httpStatusText: this.statusText
                });
            };

            xhr.onerror = function() {
                reject({
                    httpStatus: this.status,
                    httpStatusText: this.statusText
                });
            };

            xhr.send();
        });
    }
}

ApiClient.prototype.openFile = function(path) {
    return this.get('/api/open?path='+path);
}

ApiClient.prototype.browseDir = function(path) {
    return this.get('/api/browse?path='+path);
}

ApiClient.prototype.fetchNewLogs = function(since) {
    return this.get('/api/logs?since='+since);
}

function Logs(apiClient) {
    this.newestLogTimestamp =Math.trunc(Date.now() / 1000);
    this.logs = [];
    this.el = document.getElementById('logs');
    this.apiClient = apiClient;
}

Logs.prototype.fetchNewLogs = function() {
    this.apiClient.fetchNewLogs(this.newestLogTimestamp)
        .then(function(logs) {
            newestTimestamp = 0;

            for (var index in logs) {
                var date = new Date(logs[index].time);
                var contextualInfo = logs[index].contextual_info;
                try {
                    contextualInfo = JSON.stringify(JSON.parse(logs[index].contextual_info), undefined, 2);
                } catch (error) {
                }

                var dateTimestamp = date.getTime() / 1000;
                if (dateTimestamp > newestTimestamp) newestTimestamp = dateTimestamp;

                this.append(
                    new Log(
                        date.toLocaleString(),
                        logs[index].level,
                        logs[index].message,
                        contextualInfo,
                        logs[index].raw
                    )
                );
            }

            if (newestTimestamp > this.newestLogTimestamp) this.newestLogTimestamp = newestTimestamp;

            this.render();
        }.bind(this))
        .catch(function(response) {
            console.error(response.httpStatus, response.httpStatusText);
        });
}

Logs.prototype.append = function(log) {
    this.logs.push(log);
}

Logs.prototype.render = function() {
    for (var index in this.logs) {
        if (this.logs[index].rendered) continue;

        var row = this.el.insertRow(1);
        row.insertCell().innerHTML = this.logs[index].time == '' ? '' : this.logs[index].time;
        row.insertCell().innerHTML = this.logs[index].level == '' ? '' : this.logs[index].level;
        row.insertCell().innerHTML = this.logs[index].message == '' ? this.logs[index].raw : this.logs[index].message;
        row.insertCell().innerHTML = this.logs[index].contextualInfo == '' ? '' : '<pre>'+this.logs[index].contextualInfo+'</pre>';

        this.logs[index].rendered = true;
    }
}

function Log(time, level, message, contextualInfo, raw) {
    this.time = time;
    this.level = level;
    this.message = message;
    this.contextualInfo = contextualInfo;
    this.raw = raw;
    this.rendered = false;
}

var app = new App();
app.run();
