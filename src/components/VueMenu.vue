<template>
  <div :class="['menu', open && 'open']">
    <div class="buttons">
      <button
        class="clearGame"
        @click="open = !open"
        :aria-label="open ? 'Close' : 'Open'"
      >
        {{ open ? "X" : "M" }}
      </button>
      <button class="clearGame" @click="$emit('clear')">Clear</button>
      <button class="resetGame" @click="$emit('reset')">Reset Game</button>
      <button class="resetGame" @click="$router.push('/')">
        Back to Start
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "VueMenu",
  setup() {
    const open = ref(false);

    return {
      open,
    };
  },
});
</script>

<style scoped lang="scss">
.menu {
  position: absolute;
  top: 0;
  height: 100vh;
  padding: 16px;
  right: 0;
  max-width: 90%;

  .buttons {
    display: inline-grid;
    grid-template-columns: auto;
    gap: 16px;

    button {
      display: none;

      &:first-child {
        display: inline-block;
      }
    }
  }

  &.open {
    border-left: 2px solid rgb(50, 255, 0);
    background: black;

    .buttons {
      grid-template-columns: 36.8px auto auto;

      button {
        display: inline-block;

        &:last-child {
          grid-column-start: 1;
          grid-column-end: 4;
        }
      }
    }
  }
}
</style>
