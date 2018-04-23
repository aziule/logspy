<template>
    <div>
        <p>Open a file located on your machine</p>
        <form v-on:submit="openRemoteFile">
            <div class="input-field">
                <input placeholder="/path/to/file.log" id="file_path" type="text" class="validate" v-model="remoteFilePath" required>
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
            remoteFilePath: ''
        }
    },
    methods: {
        openRemoteFile (e) {
            e.preventDefault()
            this.$store.dispatch(actionsList.OPEN_REMOTE_LOG_FILE, this.remoteFilePath)
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
