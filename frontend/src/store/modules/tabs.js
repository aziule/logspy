import * as actionsList from '@/store/actions-list'

const types = {
    ADD_TAB: 'ADD_TAB',
    SELECT_TAB: 'SELECT_TAB'
}

const state = {
    tabs: [],
    activeTabId: 0
}

const getters = {
    tabs: state => state.tabs,
    activeTabId: state => state.activeTabId
}

const mutations = {
    [types.ADD_TAB] (state, tab) {
        state.tabs.push(tab)
    },
    [types.SELECT_TAB] (state, tab) {
        state.activeTabId = tab.id
    }
}

const actions = {
    [actionsList.CREATE_NEW_TAB] ({ commit }) {
        var tab = {
            id: Math.floor((Math.random() * 133742101) + 1),
            name: 'New tab',
            type: 'local'
        }

        commit(types.ADD_TAB, tab)
        commit(types.SELECT_TAB, tab)
    },
    [actionsList.SELECT_TAB] ({ commit }, tab) {
        commit(types.SELECT_TAB, tab)
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}
