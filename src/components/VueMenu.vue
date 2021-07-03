<template>
  <div>
    <button class="resetGame" @click="$emit('reset')">Reset Game</button>
    <button class="clearGame" @click="$emit('clear')">Clear</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { MyQuestion } from "@/views/MyQuaire";

export default defineComponent({
  name: "VueMenu",
});
</script>

<style scoped lang="scss">
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
</style>
