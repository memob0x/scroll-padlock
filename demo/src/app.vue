<template>
    <div class="app">        
        <main class="app__body">
            <app-header class="app__header">
                <button @click.prevent="toggleSearchLayer">
                    open search layer
                </button>

                <button @click.prevent="toggleBodyScroll">
                    toggle body scroll
                </button>
            </app-header>

            <app-sample-text v-for="index in 3" :key="index" />

            <app-scroller class="app__scroller-sample">
                <app-sample-text class="app__scroller-sample__text" />
            </app-scroller>
            
            <app-sample-text v-for="index in 17" :key="index" />
        </main>

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

    import appHeader from './app-header.vue';
    import appScroller from './app-scroller.vue';
    import appSampleText from './app-sample-text.vue';
    import appSearch from './app-search.vue';

    export default {
        name: 'app',

        components: {
            appHeader,
            appSampleText,
            appScroller,
            appSearch
        },

        data: () => ({
            searchLayer: false
        }),

        computed: {
            bodyScroll: vm => vm.$parent.bodyScroll
        },

        methods: {
            toggleBodyScroll(){
                const state = this.bodyScroll.state;

                this.bodyScroll.state = !state;

                return state;
            },

            toggleSearchLayer(){
                const state = !this.searchLayer;

                this.bodyScroll.state = state;

                const focusTarget = state ? this.$refs.search : document.body;
                
                this.searchLayer = state;
                
                Vue.nextTick(() => focusTarget.focus());

                return state;
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

        &__body {
            width: 1200px;
            max-width: 100%;
            margin: 0 auto;
            padding: 0 20px;
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
