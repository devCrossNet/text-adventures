<template>
  <form
    @submit.stop.prevent="$emit('onSubmit', input)"
    :class="activeQuestion.question.startsWith('>>') && 'playerMessage'"
  >
    {{ activeQuestion.question }}: <input v-model="input" />
  </form>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { MyQuestion } from "@/views/MyQuaire";

export default defineComponent({
  name: "VueInput",
  props: {
    activeQuestion: { type: Object as () => MyQuestion, required: true },
  },
  setup() {
    const input = ref("");
    return {
      input,
    };
  },
});
</script>

<style scoped lang="scss">
input {
  outline: none;
  color: rgb(50, 255, 0);
  background: black;
  font-family: "VT323", monospace;
  letter-spacing: 0.1em;
  font-size: 16px;
  -webkit-font-smoothing: none;
  line-height: 1.2;
  padding: 0 0 2px 0;
  border: none;
  border-bottom: 1px solid rgb(50, 255, 0);
}
</style>
