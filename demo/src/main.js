import Vue from 'vue';

import App from './app.vue';

import ScrollPadlock from '../../src/padlock.mjs';

Vue.config.productionTip = false;

const bodyScroll = new ScrollPadlock(document.documentElement);

// https://gist.github.com/memob0x/0869e759887441b1349fdfe6bf5a188d
const isIOS = (({userAgent, platform, maxTouchPoints} = window.navigator) => {
    const isLegacyIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isMultiTouchMacAkaIOS13 = platform === 'MacIntel' && maxTouchPoints > 1;
    
    return isLegacyIOS || isMultiTouchMacAkaIOS13;
})();

window.addEventListener('resize', () => {
    if( isIOS && bodyScroll.state ){
        window.scrollTo(0, 0);
    }
});

new Vue({
    el: '#app',

    data: () => ({
        bodyScroll
    }),
    
    render: h => h(App)
});
