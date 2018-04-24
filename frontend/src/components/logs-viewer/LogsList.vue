<template>
    <table class="striped highlight">
        <thead>
            <tr>
                <th>ID</th>
                <th>Time</th>
                <th>Level</th>
                <th>Message</th>
                <th>Contextual Info</th>
            </tr>
        </thead>
        <tbody>
            <LogItem v-for="(log, index) in filteredLogs" v-bind:log="log" v-bind:key="index"/>
        </tbody>
    </table>
</template>

<script>
import { mapGetters } from 'vuex'
import LogItem from '@/components/logs-viewer/LogItem'

export default {
    name: 'LogsList',
    computed: {
        ...mapGetters([
            'logs',
            'filters'
        ]),
        filteredLogs () {
            return this.logs.filter((log) => {
                if (this.filters.level && this.filters.level !== log.level) {
                    return false
                }

                return true
            })
        }
    },
    components: {
        LogItem
    }
}
</script>

<style>
tbody tr:hover {
    background-color: #eee!important
}
</style>
