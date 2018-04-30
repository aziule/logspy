<template>
    <section>
        <p>Open a file located on your machine</p>
        <form v-on:submit="openLocalFile">
            <div class="input-field">
                <input placeholder="/path/to/file.log" id="file_path" type="text" class="validate" v-model="localFilePath" required>
                <button class="btn right" type="submit">Open</button>
            </div>
        </form>
    </section>
</template>

<script>
import * as actionsList from '@/store/actions-list'

export default {
    name: 'TabLocalFile',
    data: () => {
        return {
            localFilePath: ''
        }
    },
    methods: {
        openLocalFile (e) {
            e.preventDefault()
            this.$store.dispatch(actionsList.OPEN_LOCAL_LOG_FILE, this.localFilePath)
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
