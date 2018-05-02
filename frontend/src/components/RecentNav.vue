<template>
    <nav>
        <span class="title">Recent</span>
    </nav>
</template>

<script>
// import { mapGetters } from 'vuex'
// import * as actionsList from '@/store/actions-list'

export default {
    name: 'RecentNav'
}
</script>

<style scoped>
nav {
    height: 100%;
    background-color: white;
    padding: 0 15px;
    box-shadow: none;
}
.title {
    color: black;
    text-align: center;
    margin: 15px 0;
}
</style>
