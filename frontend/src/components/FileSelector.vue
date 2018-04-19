<template>
    <div>
        <div @click="show">show</div>
        <div @click="hide">hide</div>
        <div v-if="isShown">
            File opener here
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as actionsList from '@/store/actions-list'

export default {
    name: 'FileSelector',
    computed: mapGetters({
        isShown: 'isFileSelectorDisplayed'
    }),
    methods: {
        show () {
            this.$store.dispatch(actionsList.SHOW_FILE_SELECTOR)
        },
        hide () {
            this.$store.dispatch(actionsList.HIDE_FILE_SELECTOR)
        }
    }
}
</script>
