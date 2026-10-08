<template>
  <div class="single-select">
    <div :class="['question', activeQuestion.title.startsWith('>>') && 'playerMessage']">
      {{ activeQuestion.title }}
    </div>
    <div class="options">
      <button
        v-for="option in activeQuestion.options"
        :key="String(option.value)"
        @click="$emit('onSubmit', option)"
        tabindex="0"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { QuaireQuestion, QuaireSingleSelectDefinition } from 'quaire';

export default defineComponent({
  name: 'VueSingleSelect',
  props: {
    activeQuestion: { type: Object as PropType<QuaireQuestion<QuaireSingleSelectDefinition>>, required: true },
  },
});
</script>

<style scoped lang="scss">
.single-select {
  display: flex;
  flex-direction: column;

  .options {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding-top: 16px;

    @media (min-width: 1024px) {
      grid-template-columns: repeat(6, 1fr);
      gap: 24px;
    }
  }
}
</style>
