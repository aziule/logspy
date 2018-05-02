import * as actionsList from '@/store/actions-list'
import fileSelector from '@/store/modules/file-selector'
import logs from '@/store/modules/logs'

const modules = {
    fileSelector,
    logs
}

const types = {
    ADD_TAB: 'ADD_TAB',
    SELECT_TAB: 'SELECT_TAB',
    CLOSE_TAB: 'CLOSE_TAB',
    ATTACH_FILE_TO_CURRENT_TAB: 'ATTACH_FILE_TO_CURRENT_TAB'
}

const state = {
    tabs: [],
    activeTab: null
}

const getters = {
    tabs: state => state.tabs,
    activeTab: (state) => state.activeTab
}

const mutations = {
    [types.ADD_TAB] (state, tab) {
        state.tabs.push(tab)
    },
    [types.SELECT_TAB] (state, tab) {
        state.activeTab = tab
    },
    [types.CLOSE_TAB] (state, tab) {
        // Closing a tab will delete it and select the newest tab
        var nbTabs = state.tabs.length

        for (var i = 0; i < nbTabs; i++) {
            if (state.tabs[i].id === tab.id) {
                state.tabs.splice(i, 1)
                break
            }
        }

        if (state.activeTab.id === tab.id) {
            if (state.tabs.length > 0) {
                state.activeTab = state.tabs[state.tabs.length - 1]
            } else {
                state.activeTab = null
            }
        }
    },
    [types.ATTACH_FILE_TO_CURRENT_TAB] (state, hash) {
        state.activeTab.hash = hash
    }
}

const actions = {
    [actionsList.CREATE_NEW_TAB] ({ commit }) {
        var tab = {
            id: Math.floor((Math.random() * 133742101) + 1),
            name: 'New tab',
            fileSelector: {
                path: '',
                remote: '',
                type: 'local'
            },
            hash: ''
        }

        commit(types.ADD_TAB, tab)
        commit(types.SELECT_TAB, tab)
    },
    [actionsList.SELECT_TAB] ({ commit }, tab) {
        commit(types.SELECT_TAB, tab)
    },
    [actionsList.CLOSE_TAB] ({ commit }, tab) {
        commit(types.CLOSE_TAB, tab)
    },
    [actionsList.ATTACH_FILE_TO_CURRENT_TAB] ({ commit }, hash) {
        commit(types.ATTACH_FILE_TO_CURRENT_TAB, hash)
    }
}

export default {
    state,
    getters,
    actions,
    mutations,
    modules
}
