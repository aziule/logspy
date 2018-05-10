<template>
    <nav>
        <span class="recent-files__title">Recent</span>
        <ul class="recent-files" v-if="recentFiles.length > 0">
            <li class="recent-files__item" v-for="file in sortedFiles" v-bind:file="file" v-bind:key="file.updatedAt" v-bind:value="file">
                <a href="#" @click.prevent="openRecentFile(file)">
                    <span @click.stop.prevent="removeRecentFile(file)" class="recent-files__item__remove">&times;</span>
                    <div v-if="file.type === 'remote'" class="recent-files__remote__name">{{ file.remoteServer.name }}</div>
                    {{ file.path }}
                </a>
            </li>
        </ul>
        <div v-if="recentFiles.length === 0" class="recent-files__no-files">
            No recently opened files to display.
        </div>
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
        openRecentFile (file) {
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
        },
        removeRecentFile (file) {
            this.$store.dispatch(actionsList.REMOVE_RECENT_FILE, file)
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
.recent-files__title {
    color: black;
    text-align: center;
}
.recent-files__no-files {
    color: #888;
}
.recent-files__item {
    margin-bottom: 15px;
    width: 100%;
    word-break: break-word;
    line-height: 1.5rem;
    background-color: #eee;
    position: relative;
}
.recent-files__item a {
    padding: 10px;
    color: black;
}
.recent-files__remote__name {
    margin-bottom: 10px;
    padding-right: 15px;
}
.recent-files__item__remove {
    position: absolute;
    right: 10px;
    top: 5px;
    color: #888;
    transition: color .2s;
    color:  #ccc;
}
.recent-files__item:hover .recent-files__item__remove {
    color:  #888;
}
.recent-files__item .recent-files__item__remove:hover {
    color: black;
}
</style>
