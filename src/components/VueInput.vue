<template>
  <form @submit.stop.prevent="onSubmit" :class="activeQuestion.title.startsWith('>>') && 'playerMessage'">
    <label>{{ activeQuestion.title }}: <input v-model="input" /></label>
    <div v-if="submitted && activeQuestion.error === 'REQUIRED'" class="error" role="alert">
      Please enter an answer.
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, type PropType } from 'vue';
import type { QuaireInputDefinition, QuaireQuestion } from 'quaire';

export default defineComponent({
  name: 'VueInput',
  props: {
    activeQuestion: { type: Object as PropType<QuaireQuestion<QuaireInputDefinition>>, required: true },
  },
  emits: ['onSubmit'],
  setup(_props, { emit }) {
    const input = ref('');
    // a required question has an error until it is answered, show it after the first submit
    const submitted = ref(false);
    const onSubmit = () => {
      submitted.value = true;
      emit('onSubmit', input.value);
    };

    return {
      input,
      submitted,
      onSubmit,
    };
  },
});
</script>

<style scoped lang="scss">
input {
  outline: none;
  color: rgb(50, 255, 0);
  background: black;
  font-family: 'VT323', monospace;
  letter-spacing: 0.1em;
  font-size: 16px;
  -webkit-font-smoothing: none;
  line-height: 1.2;
  padding: 0 0 2px 0;
  border: none;
  border-bottom: 1px solid rgb(50, 255, 0);
}

.error {
  color: deeppink;
}
</style>
