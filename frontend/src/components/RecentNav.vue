<template>
    <nav>
        <span class="title">Recent</span>
        <ul class="recent-files">
            <li class="recent-files__item" v-for="file in sortedFiles" v-bind:file="file" v-bind:key="file.updatedAt" v-bind:value="file">
                <a href="#" @click="openRecentFile($event, file)">
                    <div v-if="file.type === 'remote'" class="recent-files__remote__name">{{ file.remoteServer.name }}</div>
                    {{ file.path }}
                </a>
            </li>
        </ul>
    </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import * as actionsList from '@/store/actions-list'

export default {
    name: 'RecentNav',
    computed: {
        ...mapGetters([
            'recentFiles'
        ]),
        sortedFiles () {
            var self = this
            return self.recentFiles.sort((a, b) => {
                return b.updatedAt - a.updatedAt
            })
        }
    },
    methods: {
        openRecentFile (e, file) {
            e.preventDefault()
            var tabName = file.type === 'remote' ? file.remoteServer.name + ' ' : ''
            tabName += file.path

            this.$store.dispatch(actionsList.CREATE_NEW_TAB, tabName)
            this.$store.dispatch(actionsList.OPEN_LOG_FILE, file)
                .then(() => {
                    this.error = null
                    this.$store.dispatch(actionsList.READ_LOG_FILE, file)
                }).catch((err) => {
                    this.error = err.message
                })
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
.recent-files__remote__name {
    margin-bottom: 10px;
}
</style>
