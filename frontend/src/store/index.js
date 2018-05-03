import Vue from 'vue'
import Vuex from 'vuex'
import recentFiles from '@/store/modules/recent-files'
import remoteServers from '@/store/modules/remote-servers'
import tabs from '@/store/modules/tabs'

Vue.use(Vuex)

const modules = {
    tabs,
    remoteServers,
    recentFiles
}

const store = new Vuex.Store({
    modules
})

export default store
