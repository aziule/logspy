import Vue from 'vue'
import Router from 'vue-router'
import SelectFile from '@/components/pages/SelectFile'
import ViewLogs from '@/components/pages/ViewLogs'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'SelectFile',
            component: SelectFile
        },
        {
            path: '/logs',
            name: 'ViewLogs',
            component: ViewLogs
        }
    ]
})
