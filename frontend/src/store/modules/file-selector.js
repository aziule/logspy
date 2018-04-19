import * as actionsList from '@/store/actions-list'

const state = {
    openedFile: null,
    error: null,
    isDisplayed: true
}

const getters = {
    isFileSelectorDisplayed: state => state.isDisplayed
}

const mutations = {
    showFileSelector (state) {
        state.isDisplayed = true
    },
    hideFileSelector (state) {
        state.isDisplayed = false
    }
}

const actions = {
    [actionsList.SHOW_FILE_SELECTOR] ({ commit }) {
        commit('showFileSelector')
    },
    [actionsList.HIDE_FILE_SELECTOR] ({ commit }) {
        commit('hideFileSelector')
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}
