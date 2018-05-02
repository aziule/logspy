import * as actionsList from '@/store/actions-list'
import httpClient from '@/services/http-client'
import RemoteServer from '@/models/RemoteServer'

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
                    var newRemoteServers = []

                    for (var i = 0, nb = remoteServers.length; i < nb; i++) {
                        newRemoteServers.push(new RemoteServer(
                            remoteServers[i].id,
                            remoteServers[i].name,
                            remoteServers[i].host,
                            remoteServers[i].username,
                            remoteServers[i].sshKeyPath
                        ))
                    }

                    commit(types.REFRESH_REMOTE_SERVERS, remoteServers)
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
