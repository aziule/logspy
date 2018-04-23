import * as actionsList from '@/store/actions-list'
import httpClient from '@/services/http-client'

var getCurrentTime = () => {
    return Math.trunc(new Date().getTime() / 1000)
}

const types = {
    LOADING: 'LOADING',
    DONE_LOADING: 'DONE_LOADING',
    ACTIVATE: 'ACTIVATE',
    DEACTIVATE: 'DEACTIVATE',
    APPEND_LOGS: 'APPEND_LOGS'
}

const state = {
    isActive: false,
    isLoading: false,
    lastCall: null,
    logs: []
}

const getters = {
    logs: state => {
        return state.logs
    }
}

const mutations = {
    [types.LOADING] (state) {
        state.isLoading = true
        state.lastCall = getCurrentTime()
    },
    [types.DONE_LOADING] (state) {
        state.isLoading = false
    },
    [types.ACTIVATE] (state) {
        state.isActive = true
        state.lastCall = getCurrentTime()
    },
    [types.DEACTIVATE] (state) {
        state.isActive = false
    },
    [types.APPEND_LOGS] (state, logs) {
        state.logs = state.logs.concat(logs)
    }
}

const actions = {
    [actionsList.READ_LOG_FILE] ({ state, commit, dispatch }) {
        if (state.isLoading) return
        if (!state.isActive) commit(types.ACTIVATE)

        var since = state.lastCall

        commit(types.LOADING)

        return new Promise((resolve, reject) => {
            httpClient.get('/api/logs?since=' + since)
                .then((logs) => {
                    var nbLogs = logs.length

                    for (var i = 0; i < nbLogs; i++) {
                        logs[i]['time_ts'] = new Date(logs[i].time)
                    }

                    logs.sort((a, b) => {
                        return b.time_ts - a.time_ts
                    })

                    commit(types.APPEND_LOGS, logs)
                    commit(types.DONE_LOADING)
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
