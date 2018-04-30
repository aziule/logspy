<template>
    <section>
        <FileSelector />
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import FileSelector from '@/components/file-selector/FileSelector'

export default {
    name: 'TabContent',
    computed: {
        ...mapGetters([
            'tabs',
            'activeTabId'
        ]),
        activeTab () {
            for (var i = 0; i < this.tabs.length; i++) {
                if (this.tabs[i].id === this.activeTabId) return this.tabs[i]
            }
        }
    },
    components: {
        FileSelector
    }
}
</script>
