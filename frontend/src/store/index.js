import Vue from 'vue'
import Vuex from 'vuex'
import remoteServers from '@/store/modules/remote-servers'
import tabs from '@/store/modules/tabs'

Vue.use(Vuex)

const modules = {
    tabs,
    remoteServers
}

const store = new Vuex.Store({
    modules
})

export default store
