import Vue from 'vue'
import Router from 'vue-router'
import PageIndex from '@/components/PageIndex'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'PageIndex',
            component: PageIndex
        }
    ]
})
