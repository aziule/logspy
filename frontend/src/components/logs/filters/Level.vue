<template>
    <select id="filter-level" v-model="level" @change="filter()">
        <option value="">All</option>
        <option v-for="level in levels" v-bind:level="level" v-bind:key="level">
            {{ level }}
        </option>
    </select>
</template>

<script>
import * as actionsList from '@/store/actions-list'
import { mapGetters } from 'vuex'

export default {
    name: 'Level',
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
        filter () {
            this.$store.dispatch(actionsList.FILTER_BY_LEVEL, this.level)
        }
    }
}
</script>
