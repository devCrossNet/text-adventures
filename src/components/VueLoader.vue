<template>
  <div class="loader">
    <div>LOADING ...</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "VueLoader",
});
</script>

<style scoped lang="scss">
@keyframes rotate {
  0% {
    transform: rotateY(0);
  }
  500% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(360deg);
  }
}

.loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 32px;

  > div {
    animation: rotate 5s infinite linear;
  }
}
</style>
