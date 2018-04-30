<template>
    <section>
        <p>Open a file located on a remote server using SSH</p>
        <form v-on:submit="openRemoteFile">
            <div class="input-field">
                <select v-model="remoteServer">
                    <option value="">Select a remote</option>
                    <option v-for="remoteServer in remoteServers" v-bind:remoteServer="remoteServer" v-bind:key="remoteServer.id" v-bind:value="remoteServer">
                        {{ remoteServer.name }} ({{ remoteServer.host }})
                    </option>
                </select>
                <button class="btn grey btn-small lighten-3 grey-text text-darken-2 add-remote" type="button">Manage remotes</button>
                <input placeholder="/path/to/file.log" id="file_path" type="text" class="validate" v-model="remoteFilePath" required />
                <button class="btn right" type="submit">Open</button>
            </div>
        </form>
    </section>
</template>

<script>
import * as actionsList from '@/store/actions-list'
import { mapGetters } from 'vuex'

export default {
    name: 'TabRemoteFile',
    data: () => {
        return {
            remoteServer: '',
            remoteFilePath: ''
        }
    },
    computed: {
        ...mapGetters([
            'remoteServers'
        ])
    },
    methods: {
        openRemoteFile (e) {
            e.preventDefault()

            this.$store.dispatch(actionsList.OPEN_REMOTE_LOG_FILE, {
                remoteServer: this.remoteServer,
                logFilePath: this.remoteFilePath
            }).then(() => {
                this.$emit('onLogFileOpened')
                this.$store.dispatch(actionsList.READ_LOG_FILE)
            }).catch((e) => {
                this.$emit('onError', e)
            })
        }
    }
}
</script>

<style scoped>
select {
    width: 100%!important;
    margin-bottom: 15px;
    border-color: #9e9e9e;
}
</style>
