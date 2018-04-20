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
    async [actionsList.OPEN_LOCAL_LOG_FILE] ({ state, commit, dispatch }, path) {
        if (state.isLoading) return

        commit(types.LOADING)

        return new Promise((resolve, reject) => {
            httpClient.get('/api/open?path=' + path)
                .then(() => {
                    commit(types.DONE_LOADING)
                    commit(types.OPEN_FILE, path)
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
    mutations
}
