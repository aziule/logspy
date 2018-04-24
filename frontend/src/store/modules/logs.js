import * as actionsList from '@/store/actions-list'
import httpClient from '@/services/http-client'

const types = {
    LOADING: 'LOADING',
    DONE_LOADING: 'DONE_LOADING',
    ACTIVATE: 'ACTIVATE',
    DEACTIVATE: 'DEACTIVATE',
    APPEND_LOGS: 'APPEND_LOGS',
    SET_HIGHEST_ID: 'SET_HIGHEST_ID'
}

const state = {
    isActive: false,
    isLoading: false,
    highestId: 0,
    logs: []
}

const getters = {
    logs: state => {
        return state.logs.sort((a, b) => {
            return b.id - a.id
        })
    }
}

const mutations = {
    [types.LOADING] (state) {
        state.isLoading = true
    },
    [types.DONE_LOADING] (state) {
        state.isLoading = false
    },
    [types.ACTIVATE] (state) {
        state.isActive = true
    },
    [types.DEACTIVATE] (state) {
        state.isActive = false
    },
    [types.APPEND_LOGS] (state, logs) {
        state.logs = state.logs.concat(logs)
    },
    [types.SET_HIGHEST_ID] (state, id) {
        state.highestId = id
    }
}

const actions = {
    [actionsList.READ_LOG_FILE] ({ state, commit, dispatch }) {
        if (state.isLoading) return
        if (!state.isActive) commit(types.ACTIVATE)

        commit(types.LOADING)

        return new Promise((resolve, reject) => {
            httpClient.get('/api/logs?since=' + state.highestId)
                .then((logs) => {
                    var nbLogs = logs.length
                    var highestId = state.highestId

                    for (var i = 0; i < nbLogs; i++) {
                        if (logs[i].id > state.highestId) highestId = logs[i].id

                        logs[i]['time_ts'] = new Date(logs[i].time)
                    }

                    if (highestId > state.highestId) commit(types.SET_HIGHEST_ID, highestId)

                    commit(types.APPEND_LOGS, logs)
                    commit(types.DONE_LOADING)

                    dispatch(actionsList.NEW_LOGS, logs)

                    resolve()
                }).catch((msg) => {
                    commit(types.DONE_LOADING)
                    reject(new Error(msg))
                }).then(() => {
                    setTimeout(() => {
                        dispatch(actionsList.READ_LOG_FILE)
                    }, 1000)
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
