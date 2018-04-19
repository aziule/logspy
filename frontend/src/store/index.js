import Vue from 'vue'
import Vuex from 'vuex'
import fileSelector from '@/store/modules/file-selector'

Vue.use(Vuex)

const modules = {
    fileSelector
}

const store = new Vuex.Store({
    modules
})

export default store
