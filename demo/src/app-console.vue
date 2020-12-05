<template>
    <div class="console">
        <ul class="console__list" ref="list">
            <li class="console__list__item console__list__item--placeholder"></li>

            <li v-for="(message, index) in messages" :key="index" class="console__list__item">
                <span>{{message}}</span>
            </li>
        </ul>
    </div>    
</template>

<script>
    import Vue from 'vue';

    export default {
        name: 'app-console',

        data: () => ({
            messages: []
        }),

        methods: {
            log(message){
                this.messages.push(message);

                Vue.nextTick(() => (this.$refs.list.scrollTop = this.$refs.list.scrollHeight));
            }
        }
    };
</script>

<style lang="scss" scoped>
    .console {
        flex-wrap: wrap;
        white-space: pre-wrap;
        color: #fff;
        font-family: Consolas, "Andale Mono WT", "Andale Mono", "Lucida Console",
        "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono",
        "Liberation Mono", "Nimbus Mono L", Monaco, "Courier New", Courier,
        monospace;

        &__list {
            display: flex;
            flex-direction: column;
            overflow-x: auto;
            width: 100%;
            height: 100%;
            background: rgba(black, 0.85);

            &__item {
                &,
                &--placeholder {
                    margin: 4px 11px;

                    & {
                        &:before {
                            content: "$: ";
                        }
                    }
                }
            }
        }
    }
</style>
