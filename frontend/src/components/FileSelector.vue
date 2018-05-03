<template>
    <section v-if="activeTab !== null" class="file-selector" v-bind:class="{'file-selector--opened': isFileOpened}">
        <div class="row">
            <form @submit="openFile" v-if="!isFileOpened">
                <div class="error s12" v-if="error">{{ error }}</div>
                <div class="input-field col s12 m3">
                    <select v-model="activeTab.file.type">
                        <option value="local">Local file</option>
                        <option value="remote">Remote file</option>
                    </select>
                </div>
                <div class="input-field col s12 m3" v-if="activeTab.file.type === 'remote'">
                    <select v-model="activeTab.file.remoteServer" required>
                        <option value="">Select a remote</option>
                        <option v-for="remoteServer in remoteServers" v-bind:remoteServer="remoteServer" v-bind:key="remoteServer.id" v-bind:value="remoteServer">
                            {{ remoteServer.name }} ({{ remoteServer.host }})
                        </option>
                    </select>
                </div>
                <div class="input-field col s12 m3">
                    <input type="text" placeholder="Path" v-model="activeTab.file.path" required />
                </div>
                <div class="input-field col s12 m3">
                    <button type="submit" class="btn blue z-depth-0">Open</button>
                </div>
            </form>
            <div v-if="isFileOpened">
                <div class="input-field col s12 m3" v-if="activeTab.file.type === 'remote'">
                    {{ activeTab.file.remote.name }}
                </div>
                <div class="input-field col s12 m3">
                    {{ activeTab.file.path }}
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
            return this.openedFiles.indexOf(this.activeTab.file.hash) !== -1
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

            this.$store.dispatch(actionsList.OPEN_LOG_FILE, this.activeTab.file)
                .then(() => {
                    this.error = null
                    this.$store.dispatch(actionsList.READ_LOG_FILE, this.activeTab.file)
                }).catch((err) => {
                    this.error = err.message
                })
        }
    }
}
</script>

<style scoped>
section {
    background-color: white;
    border-bottom: 1px solid #ddd;
}
section.file-selector--opened {
    border-color: #eee;
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
