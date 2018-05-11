import Vue from 'vue'
import App from '@/components/App'
import store from '@/store'
import VModal from 'vue-js-modal'

Vue.config.productionTip = false
Vue.use(VModal)

/* eslint-disable no-new */
new Vue({
    el: 'app',
    store,
    components: { App },
    template: '<App />'
})
