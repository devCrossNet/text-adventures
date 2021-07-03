<template>
  <ul class="output">
    <li
      v-for="(item, idx) in output"
      :key="idx"
      :class="item.startsWith('>>') && 'playerMessage'"
    >
      {{ item }}
    </li>
    <li v-if="isTyping" class="dot-pulse loader"></li>
  </ul>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "VueOutput",
  props: {
    output: { type: Array, required: true },
    isTyping: { type: Boolean, default: false },
  },
});
</script>

<style scoped lang="scss">
.output {
  padding: 0;
  margin: 0;
  list-style: none;
}

.loader {
  margin-bottom: 48px;
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
