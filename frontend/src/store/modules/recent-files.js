import * as actionsList from '@/store/actions-list'
import localStorage from '@/services/local-storage'

const types = {
    REFRESH_RECENT_FILES: 'REFRESH_RECENT_FILES',
    ADD_RECENT_FILE: 'ADD_RECENT_FILE',
    REMOVE_RECENT_FILE: 'REMOVE_RECENT_FILE'
}

const state = {
    recentFiles: []
}

const getters = {
    recentFiles: state => state.recentFiles
}

const mutations = {
    [types.REFRESH_RECENT_FILES] (state) {
        state.recentFiles = localStorage.getRecentFiles()
    },
    [types.ADD_RECENT_FILE] (state, file) {
        localStorage.addRecentFile(file)
        state.recentFiles = localStorage.getRecentFiles()
    },
    [types.REMOVE_RECENT_FILE] (state, file) {
        localStorage.removeRecentFile(file)
        state.recentFiles = localStorage.getRecentFiles()
    }
}

const actions = {
    [actionsList.GET_RECENT_FILES] ({ commit }) {
        commit(types.REFRESH_RECENT_FILES)
    },
    [actionsList.ADD_RECENT_FILE] ({ commit }, file) {
        commit(types.ADD_RECENT_FILE, file)
    },
    [actionsList.REMOVE_RECENT_FILE] ({ commit }, file) {
        commit(types.REMOVE_RECENT_FILE, file)
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}
