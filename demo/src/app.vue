<template>
    <div class="app">
        <console />
        
        <div class="app__body">
            <button>
                open layer
            </button>

            <button>
                toggle scroll
            </button>

            <sample-text v-for="index in 3" :key="index" />

            <scroller />
            
            <sample-text v-for="index in 17" :key="index" />

            <floater />

            <layer />
        </div>
    </div>    
</template>

<script>
    import console from './console.vue';
    import scroller from './scroller.vue';
    import sampleText from './sample-text.vue';
    import floater from './floater.vue';
    import layer from './layer.vue';

    export default {
        name: 'app',

        components: {
            console,
            sampleText,
            scroller,
            floater,
            layer
        }
    };
</script>

<style lang="scss">
    @import '../../node_modules/reset-css/sass/_reset.scss';

    * {
        box-sizing: border-box;
    }
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
    }
</style>
