<template>
    <div id="app">
        <console />

        hello there
    </div>    
</template>

<script>
    import console from './console.vue';

    export default {
        name: 'app',

        components: {
            console
        }
    };
</script>

<style lang="scss">
    @import '../../node_modules/reset-css/sass/_reset.scss';
</style>
