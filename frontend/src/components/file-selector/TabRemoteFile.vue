<template>
    <div>
        <p>Open a file located on a remote server using SSH</p>
        <form v-on:submit="openRemoteFile">
            <div class="input-field">
                <input placeholder="Host" id="host" type="text" class="validate" v-model="host" required />
                <input placeholder="Username" id="username" type="text" class="validate" v-model="username" required />
                <input placeholder="/path/to/ssh_key" id="ssh_key_path" type="text" class="validate" v-model="sshKeyPath" required />
                <input placeholder="/path/to/file.log" id="file_path" type="text" class="validate" v-model="remoteFilePath" required />
                <button class="btn right" type="submit">Open</button>
            </div>
        </form>
    </div>
</template>

<script>
import * as actionsList from '@/store/actions-list'

export default {
    name: 'TabRemoteFile',
    data: () => {
        return {
            host: '',
            username: '',
            sshKeyPath: '',
            remoteFilePath: ''
        }
    },
    methods: {
        openRemoteFile (e) {
            e.preventDefault()
            this.$store.dispatch(actionsList.OPEN_REMOTE_LOG_FILE, {
                host: this.host,
                username: this.username,
                sshKeyPath: this.sshKeyPath,
                logFilePath: this.remoteFilePath
            })
                .then(() => {
                    this.$emit('onLogFileOpened')
                    this.$store.dispatch(actionsList.READ_LOG_FILE)
                }).catch((e) => {
                    this.$emit('onError', e)
                })
        }
    }
}
</script>
