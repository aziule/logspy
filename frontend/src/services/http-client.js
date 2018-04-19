"use strict"

const httpClient = {
    getJSON: (url) => {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open('GET', url);

            xhr.onload = function() {
                var apiData = JSON.parse(this.responseText);

                if (this.status === 200) {
                    resolve(apiData);
                    return;
                }

                reject({
                    code: apiData.code,
                    message: apiData.message
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

export default httpClient;
