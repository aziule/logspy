<template>
    <section v-if="activeTab !== null" class="file-selector" v-bind:class="{'file-selector--opened': isFileOpened}">
        <div class="row">
            <form @submit="openFile" v-if="!isFileOpened">
                <div class="error s12" v-if="error">{{ error }}</div>
                <div class="input-field col s12 m3">
                    <select v-model="activeTab.fileSelector.type">
                        <option value="local">Local file</option>
                        <option value="remote">Remote file</option>
                    </select>
                </div>
                <div class="input-field col s12 m3" v-if="activeTab.fileSelector.type === 'remote'">
                    <select v-model="activeTab.fileSelector.remote" required>
                        <option value="">Select a remote</option>
                        <option v-for="remoteServer in remoteServers" v-bind:remoteServer="remoteServer" v-bind:key="remoteServer.id" v-bind:value="remoteServer">
                            {{ remoteServer.name }} ({{ remoteServer.host }})
                        </option>
                    </select>
                </div>
                <div class="input-field col s12 m3">
                    <input type="text" placeholder="Path" v-model="activeTab.fileSelector.path" required />
                </div>
                <div class="input-field col s12 m3">
                    <button type="submit" class="btn blue z-depth-0">Open</button>
                </div>
            </form>
            <div v-if="isFileOpened">
                <div class="input-field col s12 m3" v-if="activeTab.fileSelector.type === 'remote'">
                    {{ activeTab.fileSelector.remote.name }}
                </div>
                <div class="input-field col s12 m3">
                    {{ activeTab.fileSelector.path }}
                </div>
            </div>
        </div>
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
    computed: {
        ...mapGetters([
            'remoteServers',
            'openedFiles',
            'activeTab'
        ]),
        isFileOpened () {
            return this.openedFiles.indexOf(this.activeTab.hash) !== -1
        }
    },
    filters: {
        type: (type) => {
            switch (type) {
            case 'local':
                return 'Local file'
            case 'remote':
                return 'Remote file'
            }
        }
    },
    methods: {
        openFile (e) {
            e.preventDefault()

            switch (this.activeTab.fileSelector.type) {
            case 'local':
                this.$store.dispatch(actionsList.OPEN_LOCAL_LOG_FILE, this.activeTab.fileSelector.path)
                    .then(() => {
                        this.error = null
                        this.$store.dispatch(actionsList.READ_LOG_FILE, this.activeTab.hash)
                    }).catch((err) => {
                        this.error = err.message
                    })
                break
            case 'remote':
                this.$store.dispatch(actionsList.OPEN_REMOTE_LOG_FILE, {
                    remoteServer: this.activeTab.fileSelector.remote,
                    logFilePath: this.activeTab.fileSelector.path
                }).then(() => {
                    this.error = null
                    this.$store.dispatch(actionsList.READ_LOG_FILE, this.activeTab.hash)
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
section {
    background-color: white;
}
.error {
    margin: 15px 15px 0;
}
.input-field {
    line-height: 3rem;
}
form {
    margin: 0;
}
section {
    border-bottom: 1px solid #eee;
}
input {
    margin-bottom: 0!important;
}
.file-selector--opened .row {
    margin-bottom: 0!important;
}
.file-selector--opened .input-field {
    margin-top: 0!important;
}
</style>
