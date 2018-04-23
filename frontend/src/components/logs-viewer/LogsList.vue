<template>
    <table>
        <thead>
            <tr>
                <th>Time</th>
                <th>Level</th>
                <th>Message</th>
                <th>Contextual Info</th>
            </tr>
        </thead>
        <tbody>
            <LogItem v-for="(log, index) in logs" v-bind:log="log" v-bind:key="index"/>
        </tbody>
    </table>
</template>

<script>
import { mapGetters } from 'vuex'
import LogItem from '@/components/logs-viewer/LogItem'

export default {
    name: 'LogsList',
    computed: mapGetters([
        'logs'
    ]),
    components: {
        LogItem
    }
}
</script>
