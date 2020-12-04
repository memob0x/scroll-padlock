<template>
    <div class="app">
        <app-console class="app__console custom-scrollbars" />
        
        <main class="app__body">
            <header class="app__header">
                <button>
                    open layer
                </button>

                <button @click.prevent="toggleBodyScroll">
                    toggle scroll
                </button>
            </header>

            <app-sample-text v-for="index in 3" :key="index" />

            <app-scroller />
            
            <app-sample-text v-for="index in 17" :key="index" />
        </main>

        <app-sample-text class="app__floating-sample" />

        <app-search class="app__search" />
    </div>    
</template>

<script>
    import appConsole from './app-console.vue';
    import appScroller from './app-scroller.vue';
    import appSampleText from './app-sample-text.vue';
    import appSearch from './app-search.vue';

    export default {
        name: 'app',

        components: {
            appConsole,
            appSampleText,
            appScroller,
            appSearch,
            appConsole
        },

        computed: {
            bodyScroll: vm => vm.$parent.bodyScroll,

            navigator: () => window.navigator,

            isLegacyIOS: vm => /iPad|iPhone|iPod/.test(vm.navigator.userAgent),

            isMultiTouchMacAkaIOS13: vm => vm.navigator.platform === "MacIntel" && vm.navigator.maxTouchPoints > 1,

            isAnyIOS: vm => vm.isLegacyIOS || vm.isMultiTouchMacAkaIOS13
        },

        methods: {
            toggleBodyScroll(){
                if( this.bodyScroll.state ){
                    return this.bodyScroll.unlock();
                }

                return this.bodyScroll.lock();
            }
        },

        mounted(){
            const cl = document.documentElement.classList;

            if( this.isAnyIOS ){
                cl.remove("not-ios");
                
                cl.add('ios');
            }
        }
    };
</script>

<style lang="scss">
    @import './main.scss';
</style>

<style lang="scss" scoped>
    .app {
        font-family: 'Roboto', sans-serif;
        line-height: 1.6;
        font-size: 16px;

        &__header {
            position: sticky;
            top: 0;
        }

        &__body {
            width: 1200px;
            max-width: 100%;
            margin: 0 auto;
            padding: 0 20px;
        }

        &__console {
            position: fixed;
            margin: 10px;
            right: 0;
            width: 320px;
            height: 210px;
            top: 0;

            html.scroll-padlock--locked & {
                right: var(--scroll-padlock-vertical-scrollbar-gap);
            }
        }
    }
</style>
