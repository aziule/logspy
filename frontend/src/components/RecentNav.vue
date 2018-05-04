<template>
    <nav>
        <span class="title">Recent</span>
        <ul class="recent-files">
            <li class="recent-files__item" v-for="file in sortedFiles" v-bind:file="file" v-bind:key="file.createdAt" v-bind:value="file">
                <a href="#" @click="openRecentFile($event, file)">{{ file.path }}</a>
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
        ]),
        sortedFiles () {
            var self = this
            return self.recentFiles.sort((a, b) => {
                return b.createdAt - a.createdAt
            })
        }
    },
    methods: {
        openRecentFile (e, file) {
            e.preventDefault()
            console.log(file)
        }
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
.recent-files__item {
    margin-bottom: 15px;
    width: 100%;
    word-break: break-word;
    line-height: 1.5rem;
    background-color: #eee;
}
.recent-files__item a {
    padding: 10px;
    color: black;
}
</style>
