import {
  createApp, ref, defineComponent, watch,
} from 'vue';

const cssClassName = 'scroll-container';

const cssClassNameLocked = `${cssClassName}--locked`;

const ScrollContainer = defineComponent({
  props: {
    locked: {
      type: Boolean,
      default: false,
    },

    modelValue: {
      type: Number,
      default: 0,
    },
  },

  emits: [
    'update:modelValue',
  ],

  setup(props, { emit }) {
    const scrollable = ref(null);

    watch(() => props.modelValue, (value) => {
      if (scrollable.value) {
        scrollable.value.scrollTo(0, value);
      }
    });

    watch(() => props.locked, () => {
      if (scrollable.value && props.locked) {
        window.scrollPadlock.setStyle({
          element: scrollable.value,

          selector: `.${cssClassNameLocked}`,
        });
      }
    });

    return {
      scrollable,

      updateScrollTop() {
        emit('update:modelValue', scrollable.value.scrollTop);
      },
    };
  },

  template: `
    <div :class="['${cssClassName}', { ['${cssClassNameLocked}']: locked }]" ref="scrollable" @scroll="updateScrollTop">
        <slot></slot>
    </div>`,
});

createApp({
  components: {
    ScrollContainer,
  },

  setup() {
    const isLocked = ref(false);

    const scrollTop = ref(0);

    const containers = ref([{}, {}, {}]);

    return {
      isLocked,

      scrollTop,

      containers,

      toggleLockScroll() {
        isLocked.value = !isLocked.value;
      },

      scrollBySomePx() {
        scrollTop.value = 9999;
      },

      scrollToTop() {
        scrollTop.value = 0;
      },
    };
  },
}).mount('#app');
