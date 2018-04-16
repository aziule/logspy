function App() {
    this.isRunning = false;

    var apiClient = new ApiClient();
    this.fileBrowser = new FileBrowser(apiClient);
    this.logs = new Logs(apiClient);
}

function FileBrowser(apiClient) {
    this.currentDirPath = '';
    this.dirs = [];
    this.files = [];
    this.apiClient = apiClient;
    this.el = document.getElementById('file-browser');
    this.elCurrentDir = document.getElementById('current-dir');
    this.elGotoParent = document.getElementById('goto-parent');
    this.elFilesExplorer = document.getElementById('files-explorer');

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
        .catch(function(response) {
            console.error(response.httpStatus, response.httpStatusText);
        })
        .then(function(dirInfo) {
            this.currentDirPath = dirInfo.path;
            this.dirs = dirInfo.directories;
            this.files = dirInfo.files;
            this.render();
        }.bind(this));
}

FileBrowser.prototype.selectFile = function(path) {
    this.apiClient.openFile(path)
        .catch(function(response) {
            console.error(response.httpStatus, response.httpStatusText);
        })
        .then(function() {
            this.render();
        }.bind(this));
}

FileBrowser.prototype.render = function() {
    var self = this;

    this.elCurrentDir.innerHTML = self.currentDirPath;
    this.elFilesExplorer.innerHTML = '';

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
}

App.prototype.run = function() {
    if (this.isRunning) return;

    this.fileBrowser.browseDir();

    setInterval(function() {
        this.logs.fetchNewLogs();
    }.bind(this), 1000);
}

function ApiClient() {}

ApiClient.prototype.openFile = function(path) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', '/api/open?path='+path);

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

ApiClient.prototype.browseDir = function(path) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', '/api/browse?path='+path);

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

ApiClient.prototype.fetchNewLogs = function(since) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', '/api/logs?since='+since);

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

function Logs(apiClient) {
    this.newestLogTimestamp =Math.trunc(Date.now() / 1000);
    this.logs = [];
    this.el = document.getElementById('logs');
    this.apiClient = apiClient;
}

Logs.prototype.fetchNewLogs = function() {
    this.apiClient.fetchNewLogs(this.newestLogTimestamp)
        .catch(function(response) {
            console.error(response.httpStatus, response.httpStatusText);
        })
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
        }.bind(this));
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
