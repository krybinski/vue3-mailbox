<template>
  <div class="modal">
    <div class="overlay" @click="$emit('closeModal')"></div>
    <div class="modal-card">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useKeydown from '@/composables/useKeydown';

export default defineComponent({
  setup(props, { emit }) {
    useKeydown([
      {
        key: 'Escape',
        fn: () => {
          emit('closeModal');
        },
      },
    ]);
  },
});
</script>
