<template>
    <section class="file-selector">
        <form>
            <div class="input=field">
                <select v-model="type">
                    <option value="">File location</option>
                    <option value="local">Local file</option>
                    <option value="remote">Remote file</option>
                </select>
            </div>
            <div class="input=field" v-if="type === 'remote'">
                <select v-model="remoteServer">
                    <option value="">Select a remote</option>
                    <option v-for="remoteServer in remoteServers" v-bind:remoteServer="remoteServer" v-bind:key="remoteServer.id" v-bind:value="remoteServer">
                        {{ remoteServer.name }} ({{ remoteServer.host }})
                    </option>
                </select>
            </div>
            <div class="input=field">
                <input type="text" placeholder="Path" />
            </div>
        </form>
    </section>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'FileSelector',
    data: () => {
        return {
            type: '',
            remoteServer: ''
        }
    },
    computed: {
        ...mapGetters([
            'remoteServers'
        ])
    }
}
</script>

<style scoped>
.file-selector {
    padding: 15px;
}
</style>
