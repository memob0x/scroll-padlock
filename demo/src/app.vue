<template>
    <div class="app">
        <app-console class="app__console custom-scrollbars" ref="console" />
        
        <main class="app__body">
            <header class="app__header">
                <button @click.prevent="toggleSearchLayer">
                    open search layer
                </button>

                <button @click.prevent="toggleBodyScroll">
                    toggle body scroll
                </button>
            </header>

            <app-sample-text v-for="index in 3" :key="index" />

            <app-scroller
                class="app__scroller-sample"

                @scroller-unlocked="logToConsole('scroller component unlocked')"
                
                @scroller-locked="logToConsole('scroller component locked')"
            >
                <app-sample-text class="app__scroller-sample__text" />
            </app-scroller>
            
            <app-sample-text v-for="index in 17" :key="index" />
        </main>

        <div class="app__floating-sample">
            <app-sample-text class="app__floating-sample__text" />
        </div>

        <app-search
            ref="search"

            class="app__search"

            :class="{
                'app__search--open': searchLayer
            }"
        >
            <button @click.prevent="toggleSearchLayer">
                close search layer
            </button>
        </app-search>
    </div>    
</template>

<script>
    import Vue from 'vue';

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
            appSearch
        },

        data: () => ({
            searchLayer: false
        }),

        computed: {
            bodyScroll: vm => vm.$parent.bodyScroll,

            navigator: () => window.navigator,

            isLegacyIOS: vm => /iPad|iPhone|iPod/.test(vm.navigator.userAgent),

            isMultiTouchMacAkaIOS13: vm => vm.navigator.platform === 'MacIntel' && vm.navigator.maxTouchPoints > 1,

            isAnyIOS: vm => vm.isLegacyIOS || vm.isMultiTouchMacAkaIOS13
        },

        methods: {
            toggleBodyScroll(){
                const state = this.bodyScroll.state;

                this.bodyScroll.state = !state;

                this.logToConsole(`body scroll ${state ? 'unlocked' : 'locked'}`);

                return state;
            },

            logToConsole(message){
                this.$refs.console.log(message);
            },

            toggleSearchLayer(){
                const state = !this.searchLayer;

                this.bodyScroll.state = state;

                const focusTarget = state ? this.$refs.search : document.body;
                
                this.searchLayer = state;

                this.logToConsole(`search layer ${!state ? 'closed' : 'open'}`);
                
                Vue.nextTick(() => focusTarget.focus());

                return state;
            },

            resizeHandler(){                
                if (this.isAnyIOS) {
                    window.scrollTo(0, 0);
                }
            }
        },

        mounted(){
            const cl = document.documentElement.classList;

            if( this.isAnyIOS ){
                cl.remove('not-ios');
                
                cl.add('ios');
            }

            document.documentElement.addEventListener('scrollpadlockresize', this.resizeHandler, false);
        },

        destroyed(){
            document.documentElement.removeEventListener('scrollpadlockresize', this.resizeHandler, false);
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
            background: white;
            padding: 20px 0;
            z-index: 1;
        }

        &__body {
            width: 1200px;
            max-width: 100%;
            margin: 0 auto;
            padding: 0 20px;
        }

        &__console {
            z-index: 2;
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

        &__floating-sample {
            z-index: 2;
            position: fixed;
            margin: 10px;
            right: 0;
            width: 320px;
            height: 42px;
            bottom: 0;
            background: white;
            display: flex;
            align-items: center;
            box-shadow: 0px 0px 12px -1px black;
            padding: 14px;

            html.scroll-padlock--locked & {
                right: var(--scroll-padlock-vertical-scrollbar-gap);
            }

            &__text {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        &__scroller-sample {
            margin: 20px 10px;
            width: 360px;
            max-width: 100%;
            height: 180px;

            &__text {
                width: 450px;
            }
        }

        &__search {
            position: fixed;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            background: black;

            opacity: 0;
            visibility: hidden;

            &--open {
                opacity: 1;
                visibility: visible;
            }
        }
    }
</style>
