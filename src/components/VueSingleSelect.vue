<template>
  <div class="single-select">
    <div :class="['question', activeQuestion.title.startsWith('>>') && 'playerMessage']">
      {{ activeQuestion.title }}
    </div>
    <div class="options">
      <button v-for="option in options" :key="String(option.value)" @click="onSubmit(option)" tabindex="0">
        {{ option.label }}
      </button>
    </div>
    <div
      v-if="seconds"
      class="countdown"
      role="progressbar"
      aria-label="Time left"
      :aria-valuemax="seconds"
      :aria-valuenow="Math.ceil(remaining / 1000)"
    >
      <div class="bar" :style="{ width: `${(remaining / (seconds * 1000)) * 100}%` }"></div>
      <span>{{ Math.ceil(remaining / 1000) }}s</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, type PropType } from 'vue';
import type { QuaireQuestion, QuaireSelectOption, QuaireSingleSelectDefinition } from 'quaire';
import { isTimeoutOption, type TimedSelectDefinition } from '@/quaire';

const TICK = 100;

export default defineComponent({
  name: 'VueSingleSelect',
  props: {
    activeQuestion: {
      type: Object as PropType<QuaireQuestion<QuaireSingleSelectDefinition> | QuaireQuestion<TimedSelectDefinition>>,
      required: true,
    },
  },
  emits: ['onSubmit', 'onTimeout'],
  setup(props, { emit }) {
    const seconds = props.activeQuestion.type === 'TIMED_SELECT' ? props.activeQuestion.seconds : 0;
    const remaining = ref(seconds * 1000);
    const options = computed(() => props.activeQuestion.options.filter((option) => !isTimeoutOption(option)));
    let timer: ReturnType<typeof setInterval> | undefined;

    const stop = () => clearInterval(timer);
    const onSubmit = (option: QuaireSelectOption) => {
      stop();
      emit('onSubmit', option);
    };

    onMounted(() => {
      if (!seconds) {
        return;
      }

      timer = setInterval(() => {
        remaining.value = Math.max(0, remaining.value - TICK);

        if (remaining.value === 0) {
          stop();
          emit('onTimeout', props.activeQuestion.options.find(isTimeoutOption));
        }
      }, TICK);
    });

    onUnmounted(stop);

    return { seconds, remaining, options, onSubmit };
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
.countdown {
  position: relative;
  margin-top: 16px;
  height: 20px;
  border: 2px solid #ff2a55;

  .bar {
    height: 100%;
    background: #ff2a55;
    transition: width 0.1s linear;
  }

  span {
    position: absolute;
    top: 0;
    right: 8px;
    line-height: 16px;
    color: rgb(50, 255, 0);
    mix-blend-mode: difference;
  }
}
</style>
