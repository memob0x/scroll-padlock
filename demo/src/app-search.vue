<template>
    <div class="search">
        <slot />

        <input class="search__input" type="text" ref="input" />
    </div>
</template>

<script>
    export default {
        name: 'app-search',

        methods: {
            focus(){
                this.$refs.input.focus();
            }
        }
    };
</script>

<style lang="scss" scoped>
    .search {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>
