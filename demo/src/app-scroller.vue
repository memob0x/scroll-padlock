<template>
    <div class="scroller">
        <div
            ref="scrollable"

            class="scroller__scrollable"

            :class="{
                'scroll-padlock--locked': scrollPadlockState, // TODO: use custom css class + remove css class from library
                'custom-scrollbars': customScrollbars
            }"
        >
            <app-header class="scroller__header">
                <button @click.prevent="toggleScroll">
                    toggle scroll lock
                </button>

                <button @click.prevent="toggleCustomScrollbars">
                    toggle custom scrollbars
                </button>
            </app-header>

            <div class="scroller__contents">
                <slot />
            </div>
        </div>
    </div>    
</template>

<script>
    import Vue from 'vue';

    import ScrollPadlock from '../../src/padlock.mjs';

    import appHeader from './app-header.vue';

    export default {
        name: 'app-scroller',

        components: {
            appHeader
        },

        data: () => ({
            scrollPadlock: null,
            customScrollbars: false,
            scrollPadlockState: false
        }),

        watch: {
            customScrollbars(){
                Vue.nextTick(() => this.scrollPadlock.update());
            }
        },

        methods: {
            toggleScroll(){
                const state = this.scrollPadlock.state;

                this.scrollPadlock.state = this.scrollPadlockState = !state;

                this.$emit(`scroller-${state ? 'unlocked' : 'locked'}`);

                return state;
            },

            toggleCustomScrollbars(){
                return this.customScrollbars = !this.customScrollbars;
            }
        },

        mounted(){
            this.scrollPadlock = new ScrollPadlock(this.$refs.scrollable);
        },

        destroyed(){
            this.scrollPadlock.destroy();
        }
    };
</script>

<style lang="scss" scoped>
    .scroller {
        border: 2px solid black;

        &__scrollable {
            overflow: auto;
            max-width: 100%;
            max-height: 100%;

            &.scroll-padlock--locked {
                overflow: hidden;
                max-width: calc(100% - var(--scroll-padlock-vertical-scrollbar-gap));
                padding-bottom: var(--scroll-padlock-horizontal-scrollbar-gap);
            }
        }
    }
</style>
