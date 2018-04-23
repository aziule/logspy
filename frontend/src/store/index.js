import Vue from 'vue'
import Vuex from 'vuex'
import fileSelector from '@/store/modules/file-selector'
import logs from '@/store/modules/logs'

Vue.use(Vuex)

const modules = {
    fileSelector,
    logs
}

const store = new Vuex.Store({
    modules
})

export default store
