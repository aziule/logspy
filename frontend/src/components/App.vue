<template>
    <section>
        <Nav />
        <TabContent v-if="activeTab" />
        <div class="no-tabs" v-if="!activeTab">
            <div class="no-tabs__description">Open a new tab by clicking the <span class="icon-plus">+</span> icon</div>
        </div>
    </section>
</template>

<script>
import { mapGetters } from 'vuex'
import Nav from '@/components/Nav'
import TabContent from '@/components/TabContent'
import LogsList from '@/components/logs/LogsList'

export default {
    components: {
        Nav,
        TabContent,
        LogsList
    },
    name: 'App',
    computed: {
        ...mapGetters([
            'activeTab'
        ])
    }
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
