<template>
    <nav class="white">
        <ul class="left nav__tabs">
            <li v-for="tab in tabs" v-bind:value="tab" v-bind:tab="tab" v-bind:key="tab.id" v-bind:class="{
                active: tab.id === activeTab.id,
                'nav__tabs__tab--editing': isEditing(tab)
             }">
                <a v-if="!isEditing(tab)" href="#" @click.prevent="selectTab(tab)">{{ tab.name }}</a>
                <form v-if="isEditing(tab)" @submit.prevent="updateTabName(tab)">
                    <input type="text" class="nav__tabs__tab__name-input" v-model="tab.name" ref="tabName">
                </form>
                <a href="#" class="rename-tab nav__tabs__tab__icon icon" @click.prevent="editTabName(tab)" v-if="!isEditing(tab)">&#9998;</a>
                <a href="#" class="rename-tab nav__tabs__tab__icon icon icon-update" @click.prevent="updateTabName(tab)" v-if="isEditing(tab)">&#128504;</a>
                <a href="#" class="close-tab nav__tabs__tab__icon icon" @click.prevent="closeTab(tab)" v-if="!isEditing(tab)">&times;</a>
            </li>
            <li><a class="add-tab" href="#" @click.prevent="addTab">+</a></li>
        </ul>
        <ul class="right nav__buttons">
            <li><a href="#"><i class="icon icon-crank"></i></a></li>
        </ul>
    </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import * as actionsList from '@/store/actions-list'

export default {
    name: 'Nav',
    data: () => {
        return {
            editedTabNames: []
        }
    },
    computed: {
        ...mapGetters([
            'tabs',
            'activeTab'
        ])
    },
    methods: {
        addTab () {
            this.$store.dispatch(actionsList.CREATE_NEW_TAB)
        },
        selectTab (tab) {
            this.$store.dispatch(actionsList.SELECT_TAB, tab)
        },
        closeTab (tab) {
            this.$store.dispatch(actionsList.CLOSE_TAB, tab)

            var tabIndex = this.editedTabNames.indexOf(tab.id)
            this.editedTabNames.splice(tabIndex, 1)
        },
        isEditing (tab) {
            return this.editedTabNames.indexOf(tab.id) !== -1
        },
        editTabName (tab) {
            if (!this.isEditing(tab)) this.editedTabNames.push(tab.id)
        },
        updateTabName (tab) {
            var tabIndex = this.editedTabNames.indexOf(tab.id)
            this.editedTabNames.splice(tabIndex, 1)
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

nav .icon {
    transition: color .3s;
    color: #bdbdbd!important;
}

nav .icon:hover {
    color: black!important;
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

.nav__tabs__tab__icon {
    visibility: hidden;
    padding: 0;
    margin: 0 2px;
}

.nav__tabs__tab__icon.close-tab {
    margin-right: 10px;
}

nav .nav__tabs li:hover .nav__tabs__tab__icon {
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

.nav__tabs__tab__name-input {
    height: auto!important;
    margin: 0 3px 0 15px!important;
    width: auto!important;
    padding: 2px!important;
    color: black;
    background-color: white!important;
}

.nav__tabs__tab--editing .icon-update {
    margin-right: 10px;
}

nav form {
    display: inline-block;
}
</style>
