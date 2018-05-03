<template>
    <section>
        <FileSelector v-bind:tab="activeTab" />
        <Logs v-if="activeTab && activeTab.file.hash" />
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import FileSelector from '@/components/FileSelector'
import Logs from '@/components/logs/LogsList'

export default {
    name: 'TabContent',
    computed: {
        ...mapGetters([
            'tabs',
            'activeTab'
        ])
    },
    components: {
        FileSelector,
        Logs
    }
}
</script>

<style scoped>
section {
    background-color: #eee;
}
</style>
