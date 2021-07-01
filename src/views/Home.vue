<template>
  <div class="home">
    <ul class="output">
      <li v-for="(item, idx) in output" :key="idx">{{ item }}</li>
      <li v-if="isLoading" class="dot-pulse"></li>
    </ul>

    <template
      v-if="
        !activeQuestion.isMonologue && activeQuestion.componentType === 'INPUT'
      "
    >
      <form @submit.prevent="onInput">
        >> {{ activeQuestion.question }}: <input v-model="input" />
      </form>
    </template>
  </div>
</template>

<script lang="ts">
import template from "lodash.template";
import { defineComponent, ref, watch } from "vue";
import { MyQuaire, MyQuestion } from "@/views/MyQuaire";
import { items } from "@/views/data";

export default defineComponent({
  name: "Home",
  components: {},
  setup() {
    const output = ref<Array<string>>([]);
    const isLoading = ref(false);
    const Q = new MyQuaire({ items });
    const activeQuestion = ref<MyQuestion | null>(Q.getActiveQuestion());
    const result = ref(Q.getResult());
    const handleMonologue = (monologue: Array<string> | undefined) => {
      isLoading.value = false;

      if (monologue && monologue.length > 0) {
        const line = monologue.shift();

        if (line) {
          const compiled = template(line);
          output.value.push(compiled(result.value));
          isLoading.value = true;
          setTimeout(() => handleMonologue(monologue), line.length * 100);
        }
      } else {
        saveAnswer(true);
      }
    };
    const saveAnswer = (answer: any) => {
      Q.saveAnswer(answer);
      activeQuestion.value = Q.getActiveQuestion();
      result.value = Q.getResult();
    };
    const input = ref("");
    const onInput = () => {
      output.value.push(`>> ${activeQuestion.value?.question}: ${input.value}`);
      saveAnswer(input.value);
    };

    watch(
      activeQuestion,
      () => {
        if (activeQuestion.value?.isMonologue) {
          handleMonologue(activeQuestion.value?.monologue);
        }
      },
      { immediate: true }
    );

    return {
      output,
      isLoading,
      activeQuestion,
      result,
      input,
      onInput,
    };
  },
});
</script>

<style lang="scss">
.home {
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
}

.output {
  padding: 0;
  margin: 0;
  list-style: none;
}
.dot-pulse {
  position: relative;
  top: 8px;
  left: -9982px;
  width: 4px;
  height: 4px;
  background-color: rgb(50, 255, 0);
  color: rgb(50, 255, 0);
  box-shadow: 9999px 0 0 -5px rgb(50, 255, 0);
  animation: dotPulse 1.5s infinite linear;
  animation-delay: 0.25s;
}

.dot-pulse::before,
.dot-pulse::after {
  content: "";
  display: inline-block;
  position: absolute;
  top: 0;
  width: 4px;
  height: 4px;
  background-color: rgb(50, 255, 0);
  color: rgb(50, 255, 0);
}

.dot-pulse::before {
  box-shadow: 9984px 0 0 -5px rgb(50, 255, 0);
  animation: dotPulseBefore 1.5s infinite linear;
  animation-delay: 0s;
}

.dot-pulse::after {
  box-shadow: 10014px 0 0 -5px rgb(50, 255, 0);
  animation: dotPulseAfter 1.5s infinite linear;
  animation-delay: 0.5s;
}

@keyframes dotPulseBefore {
  0% {
    box-shadow: 9984px 0 0 -5px rgb(50, 255, 0);
  }
  30% {
    box-shadow: 9984px 0 0 2px rgb(50, 255, 0);
  }
  60%,
  100% {
    box-shadow: 9984px 0 0 -5px rgb(50, 255, 0);
  }
}

@keyframes dotPulse {
  0% {
    box-shadow: 9999px 0 0 -5px rgb(50, 255, 0);
  }
  30% {
    box-shadow: 9999px 0 0 2px rgb(50, 255, 0);
  }
  60%,
  100% {
    box-shadow: 9999px 0 0 -5px rgb(50, 255, 0);
  }
}

@keyframes dotPulseAfter {
  0% {
    box-shadow: 10014px 0 0 -5px rgb(50, 255, 0);
  }
  30% {
    box-shadow: 10014px 0 0 2px rgb(50, 255, 0);
  }
  60%,
  100% {
    box-shadow: 10014px 0 0 -5px rgb(50, 255, 0);
  }
}
</style>
