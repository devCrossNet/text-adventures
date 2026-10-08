<template>
  <div :class="['home', isFlickering && 'flicker']" ref="outputRef">
    <template v-if="isInitializing === false">
      <vue-menu @reset="onResetGame" @clear="onClearGame" />
      <vue-output :output="output" :is-typing="isTyping" />
      <vue-input
        v-if="activeQuestion?.type === 'INPUT'"
        :key="activeQuestion.id"
        :active-question="activeQuestion"
        @onSubmit="onInput"
      />
      <vue-single-select
        v-if="activeQuestion?.type === 'SINGLE_SELECT' || activeQuestion?.type === 'TIMED_SELECT'"
        :key="activeQuestion.id"
        :active-question="activeQuestion"
        @onSubmit="onSingleSelect"
        @onTimeout="onTimeout"
      />
      <div v-if="ending && !isTyping" class="ending">{{ ending }}</div>
    </template>

    <vue-loader v-else />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, onUnmounted, ref, shallowRef, watch } from 'vue';
import type { QuaireResult, QuaireSelectOption } from 'quaire';
import { createQuaire, type GameQuestionDefinition } from '@/quaire';
import { loadGame } from '@/games';
import VueInput from '@/components/VueInput.vue';
import VueSingleSelect from '@/components/VueSingleSelect.vue';
import VueMenu from '@/components/VueMenu.vue';
import VueOutput from '@/components/VueOutput.vue';
import VueLoader from '@/components/VueLoader.vue';
import { useRoute } from 'vue-router';
import { type Effect, getClock, GLITCH_PREFIX, interpolate, parseEffect, sleep } from '@/utils';
import { playKnock, playStatic } from '@/sounds';

const DELAY_PER_CHARACTER = 80;

export default defineComponent({
  name: 'GamePage',
  components: { VueLoader, VueOutput, VueMenu, VueSingleSelect, VueInput },
  setup() {
    const route = useRoute();
    let questions: Array<GameQuestionDefinition> = [];
    const outputRef = ref<HTMLElement | null>(null);
    const output = ref<Array<string>>([]);
    const isTyping = ref(false);
    const isInitializing = ref(true);
    const isFlickering = ref(false);
    let Q = createQuaire(questions);
    const state = shallowRef(Q.getState());
    let unsubscribe = Q.subscribe((newState) => (state.value = newState));
    const activeQuestion = computed(() => state.value.activeQuestion);
    const result = computed(() => state.value.result);
    const ending = computed(() => {
      if (!state.value.isComplete) {
        return null;
      }

      return (activeQuestion.value?.type === 'DIALOG' && activeQuestion.value.end) || 'THE END';
    });
    // a reset stops the dialog that is playing
    let dialogRun = 0;

    const startQuaire = (savedResult?: QuaireResult) => {
      unsubscribe();
      Q = createQuaire(questions, savedResult);
      state.value = Q.getState();
      unsubscribe = Q.subscribe((newState) => (state.value = newState));
    };
    const addToOutput = (line: string) => {
      output.value.push(line);
      window.localStorage.setItem('output', output.value.join('|||'));
    };
    const saveAnswer = (answer: unknown) => {
      Q.saveAnswer(answer);
      window.localStorage.setItem('result', JSON.stringify(Q.getResult()));
    };
    const flicker = () => {
      isFlickering.value = true;
      setTimeout(() => (isFlickering.value = false), 800);
    };
    // plays an effect and returns how long the dialog waits after it
    const playEffect = (effect: Effect): number => {
      switch (effect.name) {
        case 'knock':
          playKnock();
          addToOutput(`${GLITCH_PREFIX}*knock* *knock* *knock*`);
          return 1800;
        case 'static':
          playStatic();
          flicker();
          return 1200;
        case 'flicker':
          flicker();
          return 800;
        case 'pause':
          // "Aia is typing" without a message
          isTyping.value = true;
          return effect.duration ?? 2000;
        default:
          // silence
          return effect.duration ?? 2000;
      }
    };
    const playDialog = (lines: Array<string>, run: number, index = 0) => {
      if (run !== dialogRun) {
        return;
      }

      isTyping.value = false;
      const line = lines[index];

      if (line === undefined) {
        saveAnswer(true);
        return;
      }

      const effect = parseEffect(line);

      if (effect) {
        setTimeout(() => playDialog(lines, run, index + 1), playEffect(effect));
        return;
      }

      const text = interpolate(line, { ...getClock(new Date()), ...result.value });
      addToOutput(text);
      isTyping.value = true;
      setTimeout(() => playDialog(lines, run, index + 1), text.length * DELAY_PER_CHARACTER);
    };
    const playActiveDialog = () => {
      const question = activeQuestion.value;

      if (question?.type === 'DIALOG' && !question.hasValue) {
        playDialog(question.lines, ++dialogRun);
      }
    };
    const onInput = (answer: string) => {
      const question = activeQuestion.value;
      saveAnswer(answer);

      // an invalid answer keeps the question active
      if (activeQuestion.value?.id !== question?.id) {
        addToOutput(`${question?.title}`);
        addToOutput(`>> ${answer}`);
      }
    };
    const onSingleSelect = (option: QuaireSelectOption) => {
      addToOutput(`${activeQuestion.value?.title}`);
      addToOutput(`>> ${option.label}`);
      saveAnswer(option.value);
    };
    const onTimeout = (option: QuaireSelectOption) => {
      addToOutput(`${activeQuestion.value?.title}`);
      addToOutput(`[${option.label}]`);
      saveAnswer(option.value);
    };
    const restoreGame = () => {
      const outputItem = localStorage.getItem('output');
      const resultItem = localStorage.getItem('result');

      // quaire 1.0 continues with the first open question, the saved question ID of 0.x is not needed anymore
      localStorage.removeItem('activeQuestionId');

      if (outputItem && resultItem) {
        startQuaire(JSON.parse(resultItem));
        // without answers on the path the game starts again, e.g. after the story changed
        output.value = Q.getProgress().answered > 0 ? outputItem.split('|||') : [];
      } else {
        startQuaire();
      }
    };
    const onResetGame = () => {
      dialogRun++;
      isTyping.value = false;
      output.value = [];
      window.localStorage.removeItem('output');
      window.localStorage.removeItem('result');

      Q.reset();
    };
    const onClearGame = () => {
      output.value = [];
    };
    const scrollToBottom = async () => {
      outputRef.value?.focus();
      await sleep(100);
      outputRef.value?.scrollTo(0, outputRef.value?.scrollHeight + 100);
    };

    watch(activeQuestion, async () => {
      playActiveDialog();

      await scrollToBottom();
    });

    watch(output, async () => await scrollToBottom(), { deep: true });

    onBeforeMount(async () => {
      questions = await loadGame(String(route.params.id));

      await sleep(1000);

      isInitializing.value = false;

      await sleep(1000);

      restoreGame();
    });

    onUnmounted(() => {
      dialogRun++;
      unsubscribe();
    });

    return {
      outputRef,
      output,
      isTyping,
      isInitializing,
      isFlickering,
      activeQuestion,
      ending,
      onInput,
      onSingleSelect,
      onTimeout,
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

@keyframes flicker {
  0%,
  100% {
    filter: none;
    transform: none;
  }
  20% {
    filter: invert(1);
    transform: translateX(-4px);
  }
  40% {
    filter: brightness(0.2);
  }
  60% {
    filter: invert(1) hue-rotate(90deg);
    transform: translateX(4px);
  }
  80% {
    filter: brightness(2);
  }
}

.flicker {
  animation: flicker 0.8s steps(5);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

.ending {
  margin-top: 28px;
}
</style>
