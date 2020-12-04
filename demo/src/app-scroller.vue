<template>
    <div class="scroller">
        <header class="scroller__header">
            <button @click.prevent="toggleScroll">
                toggle scroll
            </button>
        </header>

        <div class="scroller__contents">
            <slot />
        </div>
    </div>    
</template>

<script>
    import ScrollPadlock from '../../src/padlock.mjs';

    export default {
        name: 'app-scroller',

        data: vm => ({
            scrollPadlock: null
        }),

        methods: {
            toggleScroll(){
                const state = this.scrollPadlock.state;

                const result = this.scrollPadlock[state ? 'unlock' : 'lock']();

                this.$emit(`scroller-${state ? 'unlocked' : 'locked'}`);

                return result;
            }
        },

        mounted(){
            this.scrollPadlock = new ScrollPadlock(this.$el);
        },

        destroyed(){
            this.scrollPadlock.destroy();
        }
    };
</script>

<style lang="scss" scoped>
    .scroller {
        border: 2px solid black;

        overflow: auto;
        max-width: 100%;
        max-height: 100%;

        &.scroll-padlock--locked {
            overflow: hidden;
            padding-right: var(--scroll-padlock-vertical-scrollbar-gap);
            padding-bottom: var(--scroll-padlock-horizontal-scrollbar-gap);
        }

        &__header {
            position: sticky;
            top: 0;
            left: 0;
            padding: 10px;
            background: white;
        }
    }
</style>
