<template>
    <div>
        <LogsList/>
        <FileSelector/>
    </div>
</template>

<script>
import store from '@/store'
import FileSelector from '@/components/file-selector/FileSelector'
import LogsList from '@/components/logs-viewer/LogsList'

export default {
    components: {
        FileSelector,
        LogsList
    },
    name: 'App',
    store
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
</style>
