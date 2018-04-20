<template>
    <div>
        <nav-bar/>
        <LogsList/>
        <FileSelector/>
    </div>
</template>

<script>
import store from '@/store'
import NavBar from '@/components/layout/NavBar'
import FileSelector from '@/components/file-selector/FileSelector'
import LogsList from '@/components/logs-viewer/LogsList'

export default {
    components: {
        NavBar,
        FileSelector,
        LogsList
    },
    name: 'App',
    store
}
</script>

<style>
.error {
    padding: 15px;
    color: white;
    background-color: #f44336;
    margin-top: 15px;
}
</style>
