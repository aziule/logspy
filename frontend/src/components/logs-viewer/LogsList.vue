<template>
    <table class="striped highlight grey lighten-5">
        <thead class="red accent-1">
            <tr>
                <th>#</th>
                <th>Time</th>
                <th>
                    Level
                    <Level />
                </th>
                <th>
                    Message
                    <Message />
                </th>
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
import Level from '@/components/logs-viewer/filters/Level'
import Message from '@/components/logs-viewer/filters/Message'

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

                if (this.filters.message) {
                    return log.message.toLowerCase().includes(this.filters.message.toLowerCase())
                }

                return true
            })
        }
    },
    components: {
        LogItem,
        Level,
        Message
    }
}
</script>

<style>
table th {
    vertical-align: top;
}
tbody tr:hover {
    background-color: #eee!important
}
</style>
