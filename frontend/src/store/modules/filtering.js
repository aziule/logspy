import * as actionsList from '@/store/actions-list'

const types = {
    ADD_LEVEL: 'ADD_LEVEL',
    SET_FILTER_LEVEL: 'SET_FILTER_LEVEL'
}

const state = {
    levels: [],
    filters: {
        level: null
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
    }
}

const actions = {
    [actionsList.NEW_LOGS] ({ state, commit }, logs) {
        var nbLogs = logs.length

        for (var i = 0; i < nbLogs; i++) {
            if (logs[i].level && state.levels.indexOf(logs[i].level) === -1) commit(types.ADD_LEVEL, logs[i].level)
        }
    },
    [actionsList.FILTER_BY_LEVEL] ({ state, commit }, level) {
        commit(types.SET_FILTER_LEVEL, level)
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}
