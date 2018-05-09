<template>
    <nav class="white">
        <ul class="left nav__tabs">
            <li v-for="tab in tabs" v-bind:value="tab" v-bind:tab="tab" v-bind:key="tab.id" v-bind:class="{ active: tab.id === activeTab.id }">
                <a href="#" @click="selectTab($event, tab)">{{ tab.name ? tab.name : 'New tab' }}</a>
                <a href="#" class="close-tab" @click="closeTab($event, tab)">&times;</a>
            </li>
            <li><a class="add-tab" href="#" @click="addTab">+</a></li>
        </ul>
        <ul class="right nav__buttons">
            <li><a href="#"><i class="icon-crank"></i></a></li>
        </ul>
    </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import * as actionsList from '@/store/actions-list'

export default {
    name: 'Nav',
    computed: {
        ...mapGetters([
            'tabs',
            'activeTab'
        ])
    },
    methods: {
        addTab (e) {
            e.preventDefault()
            this.$store.dispatch(actionsList.CREATE_NEW_TAB)
        },
        selectTab (e, tab) {
            e.preventDefault()
            this.$store.dispatch(actionsList.SELECT_TAB, tab)
        },
        closeTab (e, tab) {
            e.preventDefault()
            this.$store.dispatch(actionsList.CLOSE_TAB, tab)
        }
    },
    mounted () {
        this.$store.dispatch(actionsList.CREATE_NEW_TAB)
    }
}
</script>

<style scoped>
nav {
    padding: 0 5px;
    height: 39px;
    line-height: 31px;
    box-shadow: none;
    border-bottom: 1px solid #ddd;
}

nav a,
nav a span {
    display: inline-block;
}

nav .nav__tabs {
    margin-top: 6px;
}

nav .nav__tabs li {
    border-top: 1px solid #ddd;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    margin-right: 5px;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-color: #ddd;
}

nav .nav__tabs .close-tab {
    visibility: hidden;
    padding: 0;
    margin: 0 10px;
    color: #bdbdbd!important;
}

nav .nav__tabs .close-tab:hover {
    color: black!important;
}

nav .nav__tabs li:hover .close-tab {
    visibility: visible;
}

nav .nav__tabs li:hover a {
    background-color: initial;
}

nav .nav__tabs li:last-child a {
    border: none;
}

nav .nav__tabs li.active a {
    color: black;
}

nav .nav__tabs li.active {
    background-color: white;
    border-bottom-color: white;
}

nav .nav__tabs li:not(.active) a:hover {
    color: #888;
}

nav .nav__tabs  li:not(.active) {
    background-color: #eee;
}

nav .nav__tabs  li:not(.active) a {
    color: #bdbdbd;
}

nav .nav__tabs li a.add-tab {
    background-color: white;
}

nav .nav__buttons {
    margin-top: 3px;
}

nav .nav__buttons li a {
    color: #bdbdbd;
}

nav .nav__buttons li a:hover {
    background-color: white;
    color: black;
}

.icon-crank {
    transition: color .3s;
    display: inline-block;
    vertical-align: middle;
    position: relative;
    font-style: normal;
    text-align: left;
    text-indent: -9999px;
    direction: ltr;
    width: 22px;
    height: 22px;
    border: 3px dotted;
    border-radius: 50%;
    margin: 1px;
}

.icon-crank:before,
.icon-crank:after {
    content: '';
    pointer-events: none;
}

.icon-crank:before {
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
    width: 12px;
    height: 12px;
    box-shadow: 0 0 0 3px, 0 0 0 2px inset;
    border-radius: 50%;
    border: 6px solid transparent;
    box-sizing: border-box;
    content: '';
    pointer-events: none;
}
</style>
