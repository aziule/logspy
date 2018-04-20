const httpClient = {
    get: (url) => {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest()

            xhr.open('GET', url)

            xhr.onload = () => {
                var apiData = JSON.parse(xhr.responseText)

                if (xhr.status === 200) {
                    resolve(apiData)
                    return
                }

                reject(new Error(apiData.message))
            }

            xhr.onerror = () => {
                reject(new Error(xhr.statusText))
            }

            xhr.send()
        })
    }
}

export default httpClient
