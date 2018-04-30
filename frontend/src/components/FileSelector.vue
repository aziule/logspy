<template>
    <section class="file-selector" v-if="tab !== null">
        <form @submit="openFile">
            <div class="error" v-if="error">{{ error }}</div>
            <div class="input-field">
                <select v-model="tab.fileSelector.type">
                    <option value="local">Local file</option>
                    <option value="remote">Remote file</option>
                </select>
            </div>
            <div class="input-field" v-if="tab.fileSelector.type === 'remote'">
                <select v-model="tab.fileSelector.remote" required>
                    <option value="">Select a remote</option>
                    <option v-for="remoteServer in remoteServers" v-bind:remoteServer="remoteServer" v-bind:key="remoteServer.id" v-bind:value="remoteServer">
                        {{ remoteServer.name }} ({{ remoteServer.host }})
                    </option>
                </select>
            </div>
            <div class="input-field">
                <input type="text" placeholder="Path" v-model="tab.fileSelector.path" required />
            </div>
            <button type="submit" class="btn blue">Open</button>
        </form>
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import * as actionsList from '@/store/actions-list'

export default {
    name: 'FileSelector',
    data: () => {
        return {
            'error': null
        }
    },
    props: [
        'tab'
    ],
    computed: {
        ...mapGetters([
            'remoteServers'
        ])
    },
    methods: {
        openFile (e) {
            e.preventDefault()

            switch (this.tab.fileSelector.type) {
            case 'local':
                this.$store.dispatch(actionsList.OPEN_LOCAL_LOG_FILE, this.tab.fileSelector.path)
                    .then(() => {
                        this.error = null
                        // this.$store.dispatch(actionsList.READ_LOG_FILE)
                    }).catch((err) => {
                        this.error = err.message
                    })
                break
            case 'remote':
                this.$store.dispatch(actionsList.OPEN_REMOTE_LOG_FILE, {
                    remoteServer: this.tab.fileSelector.remote.host,
                    logFilePath: this.tab.fileSelector.path
                }).then(() => {
                    this.error = null
                    // this.$store.dispatch(actionsList.READ_LOG_FILE)
                }).catch((err) => {
                    this.error = err.message
                })
                break
            }
        }
    }
}
</script>

<style scoped>
.file-selector {
    padding: 15px;
}

form {
    background-color: #eee;
    padding: 15px;
}
</style>
