<template>
    <nav>
        <span class="title">Recent</span>
        <ul class="recent-files">
            <li class="recent-files__item" v-for="file in recentFiles" v-bind:file="file" v-bind:key="file.hash" v-bind:value="file">
                {{ file.path }}
            </li>
        </ul>
    </nav>
</template>

<script>
import { mapGetters } from 'vuex'
// import * as actionsList from '@/store/actions-list'

export default {
    name: 'RecentNav',
    computed: {
        ...mapGetters([
            'recentFiles'
        ])
    }
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
.recent-files {
    color: black;
    line-height: 1rem;
}
.recent-files__item {
    padding: 10px;
    margin-bottom: 5px;
    background-color: #eee;
    width: 100%;
}
</style>
