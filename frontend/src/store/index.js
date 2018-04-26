import Vue from 'vue'
import Vuex from 'vuex'
import fileSelector from '@/store/modules/file-selector'
import logs from '@/store/modules/logs'
import filtering from '@/store/modules/filtering'
import remoteServers from '@/store/modules/remote-servers'

Vue.use(Vuex)

const modules = {
    fileSelector,
    logs,
    filtering,
    remoteServers
}

const store = new Vuex.Store({
    modules
})

export default store
