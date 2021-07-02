<template>
  <div class="home" ref="outputRef">
    <ul class="output">
      <li
        v-for="(item, idx) in output"
        :key="idx"
        :class="item.startsWith('>>') && 'playerMessage'"
      >
        {{ item }}
      </li>
      <li v-if="isLoading" class="dot-pulse loader"></li>
    </ul>

    <template v-if="activeQuestion && activeQuestion.componentType === 'INPUT'">
      <form
        @submit.prevent="onInput"
        :class="activeQuestion.question.startsWith('>>') && 'playerMessage'"
      >
        {{ activeQuestion.question }}: <input v-model="input" />
      </form>
    </template>

    <template
      v-if="activeQuestion && activeQuestion.componentType === 'SINGLE_SELECT'"
    >
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
            @click="onSingleSelect(option)"
            tabindex="0"
          >
            {{ option.label }}
          </button>
        </div>
      </div>
    </template>

    <button class="resetGame" @click="onResetGame">Reset Game</button>
    <button class="clearGame" @click="onClearGame">Clear</button>
  </div>
</template>

<script lang="ts">
import template from "lodash.template";
import { defineComponent, onBeforeMount, ref, watch } from "vue";
import { MyComponentType, MyQuaire, MyQuestion } from "@/views/MyQuaire";
import { items } from "@/views/data";
import { QuaireItemOption } from "quaire";

export default defineComponent({
  name: "Home",
  components: {},
  setup() {
    const outputRef = ref<HTMLElement | null>(null);
    const output = ref<Array<string>>([]);
    const isLoading = ref(false);
    let Q = new MyQuaire({ items });
    const activeQuestion = ref<MyQuestion | null>(Q.getActiveQuestion());
    const result = ref(Q.getResult());
    const input = ref("");

    const addToOutput = (line: string) => {
      output.value.push(line);
      window.localStorage.setItem("output", output.value.join("|||"));
    };
    const handleDialog = (
      dialog: Array<string> | unknown | undefined,
      answer: boolean
    ) => {
      if (answer) {
        return;
      }

      isLoading.value = false;
      if (dialog && Array.isArray(dialog) && dialog.length > 0) {
        const line = dialog.shift();
        if (line) {
          const compiled = template(line);
          addToOutput(compiled(result.value));
          isLoading.value = true;
          setTimeout(() => handleDialog(dialog, answer), line.length * 80);
        }
      } else {
        saveAnswer(true);
      }
    };
    const saveAnswer = (answer: unknown) => {
      Q.saveAnswer(answer);
      activeQuestion.value = Q.getActiveQuestion();
      result.value = Q.getResult();

      if (activeQuestion.value) {
        window.localStorage.setItem(
          "activeQuestionId",
          activeQuestion.value?.id.toString() || "1"
        );
      }

      window.localStorage.setItem("result", JSON.stringify(result.value));
    };
    const onInput = () => {
      output.value.push(`${activeQuestion.value?.question}`);
      output.value.push(`>> ${input.value}`);
      saveAnswer(input.value);
    };
    const onSingleSelect = (option: QuaireItemOption) => {
      output.value.push(`${activeQuestion.value?.question}`);
      output.value.push(`>> ${option.label}`);
      saveAnswer(option.value);
    };
    const restoreGame = () => {
      const outputItem = localStorage.getItem("output");
      const activeQuestionIdItem = localStorage.getItem("activeQuestionId");
      const resultItem = localStorage.getItem("result");

      if (outputItem && activeQuestionIdItem && result) {
        output.value = outputItem.split("|||");

        Q = new MyQuaire({ items, result: JSON.parse(resultItem || "{}") });
        Q.setActiveQuestionByQuestionId(parseInt(activeQuestionIdItem, 10));

        result.value = Q.getResult();
        activeQuestion.value = Q.getActiveQuestion();
      }
    };
    const onResetGame = () => {
      output.value = [];
      window.localStorage.removeItem("output");
      window.localStorage.removeItem("activeQuestionId");
      window.localStorage.removeItem("result");

      Q = new MyQuaire({ items });

      result.value = {};
      activeQuestion.value = Q.getActiveQuestion();
    };
    const onClearGame = () => {
      output.value = [];
    };

    watch(activeQuestion, () => {
      if (activeQuestion.value?.componentType === MyComponentType.DIALOG) {
        handleDialog(
          activeQuestion.value?.dialogOptions,
          result.value[activeQuestion.value.resultProperty]
        );
      }
    });

    watch(
      output,
      () => {
        outputRef.value?.scrollTo(0, outputRef.value?.scrollHeight + 100);
      },
      { deep: true }
    );

    onBeforeMount(() => {
      restoreGame();

      if (activeQuestion.value?.componentType === MyComponentType.DIALOG) {
        handleDialog(
          activeQuestion.value?.dialogOptions,
          result.value[activeQuestion.value.resultProperty]
        );
      }
    });

    return {
      outputRef,
      output,
      isLoading,
      activeQuestion,
      result,
      input,
      onInput,
      onSingleSelect,
      onResetGame,
      onClearGame,
    };
  },
});
</script>

<style lang="scss">
.home {
  padding: 16px;
  max-height: 95vh;
  max-width: 100vw;
  overflow-y: scroll;
  scroll-behavior: smooth;
  scroll-margin: 0;
  scroll-padding: 0;
  line-height: 28px;

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

  button {
    color: rgb(50, 255, 0);
    background: black;
    font-family: "VT323", monospace;
    letter-spacing: 0.1em;
    font-size: 14px;
    -webkit-font-smoothing: none;
    line-height: 1.2;
    border: 2px solid rgb(50, 255, 0);
    padding: 8px 12px;
    cursor: pointer;

    &:hover,
    &:focus {
      background: rgb(50, 255, 0);
      color: black;
    }
  }

  .playerMessage {
    color: deeppink;
  }
}

.output {
  padding: 0;
  margin: 0;
  list-style: none;
}

.loader {
  margin-bottom: 48px;
}

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

.resetGame {
  position: absolute;
  right: 32px;
  top: 16px;
}
.clearGame {
  position: absolute;
  right: 180px;
  top: 16px;
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
