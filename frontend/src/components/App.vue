<template>
    <div>
        <LogsList v-if="openedFile" />
        <FileSelector v-if="!openedFile" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import store from '@/store'
import FileSelector from '@/components/file-selector/FileSelector'
import LogsList from '@/components/logs-viewer/LogsList'

export default {
    components: {
        FileSelector,
        LogsList
    },
    name: 'App',
    store,
    computed: {
        ...mapGetters([
            'openedFile'
        ])
    }
}
</script>

<style>
select:focus {
    outline: none;
}
.error {
    padding: 15px;
    color: white;
    background-color: #f44336;
    margin-top: 15px;
}
select {
    position: relative!important;
    display: block!important;
    opacity: 1!important;
    color: black!important;
    width: auto!important;
    height: 3rem!important;
    font-weight: normal!important;
    pointer-events: auto!important;
}
</style>
