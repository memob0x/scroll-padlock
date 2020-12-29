import Vue from 'vue';

import App from './app.vue';

import ScrollPadlock from '../../src/padlock.mjs';

Vue.config.productionTip = false;

new Vue({
    el: '#app',

    data: () => ({
        bodyScroll: new ScrollPadlock(document.documentElement)
    }),
    
    render: h => h(App)
});
