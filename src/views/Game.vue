<template>
  <div class="home" ref="outputRef">
    <template v-if="isInitializing === false">
      <vue-menu @reset="onResetGame" @clear="onClearGame" />
      <vue-output :output="output" :is-typing="isTyping" />
      <vue-input
        v-if="activeQuestion && activeQuestion.componentType === 'INPUT'"
        :active-question="activeQuestion"
        @onSubmit="onInput"
      />
      <vue-single-select
        v-if="
          activeQuestion && activeQuestion.componentType === 'SINGLE_SELECT'
        "
        :active-question="activeQuestion"
        @onSubmit="onSingleSelect"
      />
    </template>

    <vue-loader v-else />
  </div>
</template>

<script lang="ts">
import template from "lodash.template";
import { defineComponent, onBeforeMount, ref, watch } from "vue";
import {
  MyComponentType,
  MyItem,
  MyQuaire,
  MyQuestion,
} from "@/views/MyQuaire";
import { QuaireItemOption } from "quaire";
import VueInput from "@/components/VueInput.vue";
import VueSingleSelect from "@/components/VueSingleSelect.vue";
import VueMenu from "@/components/VueMenu.vue";
import VueOutput from "@/components/VueOutput.vue";
import VueLoader from "@/components/VueLoader.vue";
import { useRoute } from "vue-router";
import { sleep } from "@/utils";

export default defineComponent({
  name: "GamePage",
  components: { VueLoader, VueOutput, VueMenu, VueSingleSelect, VueInput },
  setup() {
    const route = useRoute();
    const items = ref<Array<MyItem>>([]);
    const outputRef = ref<HTMLElement | null>(null);
    const output = ref<Array<string>>([]);
    const isTyping = ref(false);
    const isInitializing = ref(true);
    let Q = new MyQuaire({ items: [] });
    const activeQuestion = ref<MyQuestion | null>(Q.getActiveQuestion());
    const result = ref(Q.getResult());

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

      isTyping.value = false;
      if (dialog && Array.isArray(dialog) && dialog.length > 0) {
        const line = dialog.shift();
        if (line) {
          const compiled = template(line);
          addToOutput(compiled(result.value));
          isTyping.value = true;
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
    const onInput = (answer: string) => {
      console.log(answer);
      output.value.push(`${activeQuestion.value?.question}`);
      output.value.push(`>> ${answer}`);
      saveAnswer(answer);
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

        Q = new MyQuaire({
          items: items.value,
          result: JSON.parse(resultItem || "{}"),
        });
        Q.setActiveQuestionByQuestionId(parseInt(activeQuestionIdItem, 10));

        result.value = Q.getResult();
        activeQuestion.value = Q.getActiveQuestion();
      } else {
        Q = new MyQuaire({ items: items.value });
        result.value = Q.getResult();
        activeQuestion.value = Q.getActiveQuestion();
      }
    };
    const onResetGame = () => {
      output.value = [];
      window.localStorage.removeItem("output");
      window.localStorage.removeItem("activeQuestionId");
      window.localStorage.removeItem("result");

      Q = new MyQuaire({ items: items.value });

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

    onBeforeMount(async () => {
      const game = await import(
        /* webpackChunkName: "game-data" */ `@/games/${route.params.id}`
      );
      items.value = game.items;

      await sleep(1000);

      isInitializing.value = false;

      await sleep(2000);

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
      isTyping,
      isInitializing,
      activeQuestion,
      result,
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
}
</style>
