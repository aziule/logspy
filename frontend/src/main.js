import Vue from 'vue'
import App from '@/components/App'
import store from '@/store'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: 'app',
    store,
    components: { App },
    template: '<App/>'
})
