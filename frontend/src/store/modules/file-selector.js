import * as actionsList from '@/store/actions-list'
import httpClient from '@/services/http-client'

const types = {
    LOADING: 'LOADING',
    DONE_LOADING: 'DONE_LOADING',
    ERROR: 'ERROR',
    OPEN_FILE: 'OPEN_FILE'
}

const state = {
    isLoading: false,
    openedFiles: []
}

const getters = {
    openedFiles: state => state.openedFiles
}

const mutations = {
    [types.LOADING] (state) {
        state.isLoading = true
    },
    [types.DONE_LOADING] (state) {
        state.isLoading = false
    },
    [types.OPEN_FILE] (state, file) {
        state.openedFiles.push(file)
    }
}

const actions = {
    [actionsList.OPEN_LOG_FILE] ({ state, commit, dispatch }, file) {
        if (state.isLoading) return

        commit(types.LOADING)

        return new Promise((resolve, reject) => {
            var url = ''

            if (file.type === 'local') {
                url = encodeURI('/api/open/local?path=' + file.path)
            } else if (file.type === 'remote') {
                url = encodeURI('/api/open/remote?host=' + file.remoteServer.host + '&username=' + file.remoteServer.username + '&sshKeyPath=' + file.remoteServer.ssh_key_path + '&path=' + file.path)
            } else {
                reject(new Error('Invalid strategy'))
            }

            httpClient.get(url)
                .then((data) => {
                    commit(types.DONE_LOADING)

                    file.hash = data.hash

                    commit(types.OPEN_FILE, file)
                    dispatch(actionsList.ATTACH_FILE_TO_CURRENT_TAB, file)
                    resolve()
                }).catch((msg) => {
                    commit(types.DONE_LOADING)
                    reject(new Error(msg))
                })
        })
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}
