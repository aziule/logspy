const httpClient = {
    get: (url) => {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest()

            xhr.open('GET', url)

            xhr.onload = () => {
                try {
                    var apiData = JSON.parse(xhr.responseText)
                } catch (error) {
                    reject(new Error('Something is going wrong with the API!'))
                    return
                }

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
