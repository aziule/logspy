<template>
    <section v-bind:class="{ 'show-side-panel': showSidePanel }">
        <div class="side-panel z-depth-1">
            <RecentNav />
        </div>
        <div class="main-content">
            <TabNav />
            <TabContent v-if="activeTab" />
            <div class="no-tabs" v-if="!activeTab">
                <div class="no-tabs__description">Open a new tab by clicking the <span class="icon-plus">+</span> icon</div>
            </div>
            <div class="controls">
                <span class="controls__control" @click="openSidePanel()" v-if="!showSidePanel">&rarr;</span>
                <span class="controls__control" @click="closeSidePanel()" v-if="showSidePanel">&larr;</span>
            </div>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import * as actionsList from '@/store/actions-list'
import TabNav from '@/components/TabNav'
import RecentNav from '@/components/RecentNav'
import TabContent from '@/components/TabContent'
import LogsList from '@/components/logs/LogsList'

export default {
    components: {
        TabNav,
        RecentNav,
        TabContent,
        LogsList
    },
    name: 'App',
    computed: {
        ...mapGetters([
            'activeTab'
        ])
    },
    methods: {
        openSidePanel () {
            this.showSidePanel = true
        },
        closeSidePanel () {
            this.showSidePanel = false
        }
    },
    data: () => {
        return {
            showSidePanel: true
        }
    },
    mounted () {
        this.$store.dispatch(actionsList.GET_REMOTE_SERVERS)
        this.$store.dispatch(actionsList.GET_RECENT_FILES)
    }
}
</script>

<style>
.side-panel {
    overflow: auto;
    transition: left .3s;
    position: absolute;
    top: 0;
    bottom: 0;
    left: -305px;
    width: 100%;
    max-width: 300px;
    border-right: 1px solid #ddd;
    z-index: 1;
    padding-bottom: 30px;
}
.controls {
    position: fixed;
    transition: left .3s;
    left: 0;
    bottom: 0;
    height: 30px;
    width: 100%;
    line-height: 30px;
    border-top: 1px solid #ccc;
    background-color: white;
}
.controls .controls__control {
    color: #333;
    cursor: pointer;
    transition: color .3s;
    display: inline-block;
    width: 30px;
    height: 30px;
    text-align: center;
}
.controls .controls__control:hover {
    color: black;
}
.main-content {
    position: absolute;
    overflow: auto;
    transition: left .3s;
    top: 0;
    bottom: 0px;
    left: 0;
    right: 0;
    padding-bottom: 30px;
    background-color: #eee;
}
section.show-side-panel .side-panel {
    left: 0;
}
section.show-side-panel .main-content,
section.show-side-panel .main-content .controls {
    left: 300px;
}
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
    width: 100%!important;
    height: 3rem!important;
    font-weight: normal!important;
    pointer-events: auto!important;
}
select, input {
    border-color: #ddd;
}
.row {
    margin-bottom: 1rem;
}
.no-tabs {
    position: absolute;
    top: 39px;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    text-align: center;
    background-color: #eee;
    justify-content: center;
    align-items: center;
}
.no-tabs .no-tabs__description {
    color: #888;
}
.no-tabs .no-tabs__description .icon-plus {
    display: inline-block;
    background-color: white;
    color: #bdbdbd;
    border: 1px solid #ddd;
    width: 38px;
    height: 38px;
    line-height: 38px;
    margin: 0 5px;
}
</style>
