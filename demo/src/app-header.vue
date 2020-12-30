<template>
    <header class="header">
        <slot />
    </header>
</template>

<script>
    export default {
        name: 'app-header'
    };
</script>

<style lang="scss" scoped>
    .header {
        position: sticky;
        top: 0;
        left: 0;
        background: white;
        padding: 20px 0;
        z-index: 1;
    }
</style>
