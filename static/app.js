function App() {
    this.isRunning = false;
    this.logs = new Logs();
}

App.prototype.run = function() {
    if (this.isRunning) return;

    setInterval(function() {
        this.logs.fetchNewLogs();
    }.bind(this), 1000);
}

function ApiClient() {}

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

function Logs() {
    this.newestLogTimestamp =Math.trunc(Date.now() / 1000);
    this.logs = [];
    this.el = document.getElementById('logs');
    this.apiClient = new ApiClient();
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
