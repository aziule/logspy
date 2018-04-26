import * as actionsList from '@/store/actions-list'
import httpClient from '@/services/http-client'

const types = {
    LOADING: 'LOADING',
    DONE_LOADING: 'DONE_LOADING',
    ERROR: 'ERROR',
    OPEN_FILE: 'OPEN_FILE'
}

const state = {
    openedFile: null,
    isLoading: false
}

const getters = {
    openedFile: state => state.openedFile
}

const mutations = {
    [types.LOADING] (state) {
        state.isLoading = true
    },
    [types.DONE_LOADING] (state) {
        state.isLoading = false
    },
    [types.OPEN_FILE] (state, path) {
        state.openedFile = path
    }
}

const actions = {
    [actionsList.OPEN_LOCAL_LOG_FILE] ({ state, commit }, path) {
        if (state.isLoading) return

        commit(types.LOADING)

        return new Promise((resolve, reject) => {
            httpClient.get('/api/open/local?path=' + path)
                .then(() => {
                    commit(types.DONE_LOADING)
                    commit(types.OPEN_FILE, path)
                    resolve()
                }).catch((msg) => {
                    commit(types.DONE_LOADING)
                    reject(new Error(msg))
                })
        })
    },
    [actionsList.OPEN_REMOTE_LOG_FILE] ({ state, commit }, payload) {
        if (state.isLoading) return

        commit(types.LOADING)

        return new Promise((resolve, reject) => {
            httpClient.get(encodeURI('/api/open/remote?host=' + payload.remoteServer.host + '&username=' + payload.remoteServer.username + '&sshKeyPath=' + payload.remoteServer.ssh_key_path + '&path=' + payload.logFilePath))
                .then(() => {
                    commit(types.DONE_LOADING)
                    commit(types.OPEN_FILE, payload.logFilePath)
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
