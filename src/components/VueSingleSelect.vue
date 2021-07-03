<template>
  <div class="single-select">
    <div
      :class="[
        'question',
        activeQuestion.question.startsWith('>>') && 'playerMessage',
      ]"
    >
      {{ activeQuestion.question }}
    </div>
    <div class="options">
      <button
        v-for="option in activeQuestion.selectOptions"
        :key="option.value"
        @click="$emit('onSubmit', option)"
        tabindex="0"
      >
        {{ option.label }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { MyQuestion } from "@/views/MyQuaire";

export default defineComponent({
  name: "VueSingleSelect",
  props: {
    activeQuestion: { type: Object as () => MyQuestion, required: true },
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
