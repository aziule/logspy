import * as actionsList from '@/store/actions-list'
import httpClient from '@/services/http-client'

const types = {
    REFRESH_REMOTE_SERVERS: 'REFRESH_REMOTE_SERVERS'
}

const state = {
    remoteServers: []
}

const getters = {
    remoteServers: state => state.remoteServers
}

const mutations = {
    [types.REFRESH_REMOTE_SERVERS] (state, remoteServers) {
        state.remoteServers = remoteServers
    }
}

const actions = {
    [actionsList.GET_REMOTE_SERVERS] ({ state, commit, dispatch }) {
        return new Promise((resolve, reject) => {
            httpClient.get('/api/remote-servers')
                .then((remoteServers) => {
                    commit(types.REFRESH_REMOTE_SERVERS, remoteServers)
                    console.log(remoteServers)
                    resolve()
                }).catch((msg) => {
                    reject(new Error(msg))
                })
        })
    }
}

export default {
    state,
    actions,
    mutations,
    getters
}
