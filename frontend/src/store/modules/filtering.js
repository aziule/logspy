import * as actionsList from '@/store/actions-list'

const types = {
    ADD_LEVEL: 'ADD_LEVEL',
    SET_FILTER_LEVEL: 'SET_FILTER_LEVEL',
    SET_FILTER_MESSAGE: 'SET_FILTER_MESSAGE'
}

const state = {
    levels: [],
    filters: {
        level: null,
        message: ''
    }
}

const getters = {
    levels: state => state.levels,
    filters: state => state.filters
}

const mutations = {
    [types.ADD_LEVEL] (state, level) {
        state.levels.push(level)
    },
    [types.SET_FILTER_LEVEL] (state, level) {
        state.filters.level = level
    },
    [types.SET_FILTER_MESSAGE] (state, message) {
        state.filters.message = message
    }
}

const actions = {
    [actionsList.NEW_LOGS] ({ state, commit }, logs) {
        var nbLogs = logs.length

        for (var i = 0; i < nbLogs; i++) {
            if (logs[i].level && state.levels.indexOf(logs[i].level) === -1) commit(types.ADD_LEVEL, logs[i].level)
        }
    },
    [actionsList.FILTER_BY_LEVEL] ({ commit }, level) {
        commit(types.SET_FILTER_LEVEL, level)
    },
    [actionsList.FILTER_BY_MESSAGE] ({ commit }, message) {
        commit(types.SET_FILTER_MESSAGE, message)
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}
