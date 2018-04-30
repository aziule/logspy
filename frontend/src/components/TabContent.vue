<template>
    <section>
        <FileSelector v-bind:tab="activeTab" />
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import FileSelector from '@/components/FileSelector'

export default {
    name: 'TabContent',
    computed: {
        ...mapGetters([
            'tabs',
            'activeTab'
        ])
    },
    components: {
        FileSelector
    }
}
</script>
