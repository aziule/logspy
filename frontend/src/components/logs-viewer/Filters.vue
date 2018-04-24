<template>
    <ul class="hide-on-med-and-down">
        <li>
            <label for="filter-level">Level</label>
            <select id="filter-level" v-model="level" @change="filterByLevel()">
                <option value="">All</option>
                <option v-for="level in levels" v-bind:level="level" v-bind:key="level">
                    {{ level }}
                </option>
            </select>
        </li>
    </ul>
</template>

<script>
import * as actionsList from '@/store/actions-list'
import { mapGetters } from 'vuex'

export default {
    name: 'NavBar',
    data: () => {
        return {
            level: ''
        }
    },
    computed: {
        ...mapGetters([
            'levels'
        ])
    },
    methods: {
        filterByLevel () {
            this.$store.dispatch(actionsList.FILTER_BY_LEVEL, this.level)
        }
    }
}
</script>

<style scoped>
li {
    display: flex;
    align-items: center;
    margin-left: 15px;
}
label {
    display: inline;
    float: left;
    margin-right: 15px;
    color: black;
    font-size: 1rem;
}
select {
    display: block;
    float: left;
    color: black;
    width: auto;
}
</style>
