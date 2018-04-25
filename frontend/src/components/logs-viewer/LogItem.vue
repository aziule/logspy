<template>
    <tr>
        <td>{{ log.id }}</td>
        <td>{{ log.time|date }}</td>
        <td>{{ log.level }}</td>
        <td v-html="logMessage"></td>
        <td><pre>{{ log.contextual_info }}</pre></td>
    </tr>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
    name: 'LogItem',
    props: ['log'],
    computed: {
        ...mapGetters([
            'filters'
        ]),
        logMessage () {
            if (!this.filters.message) return this.log.message

            /* eslint-disable no-useless-escape */
            var regex = new RegExp(
                this.filters.message.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&'),
                'gi'
            )
            /* eslint-enable no-useless-escape */

            return this.log.message.replace(regex, (match) => {
                return '<span class="matching-text">' + match + '</span>'
            })
        }
    },
    filters: {
        date: (date) => {
            return new Date(date).toLocaleString()
        }
    }
}
</script>

<style>
.matching-text {
    background-color: yellow;
}
</style>
