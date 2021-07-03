<template>
  <div class="intro">
    <h1>Welcome to Text Adventures!</h1>

    <div>Please select a Game!</div>

    <div class="games">
      <button
        tabindex="0"
        v-for="game in games"
        @click="$router.push(`/game/${game.id}`)"
        :key="game.id"
      >
        {{ game.name }}
      </button>
    </div>

    <div class="footer">
      <a
        href="https://github.com/devCrossNet/game"
        rel="noopener"
        target="_blank"
      >
        GitHub
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "IntroPage",
  components: {},
  setup() {
    return {
      games: computed(() => [
        {
          name: "Message From The Future",
          id: "message-from-the-future",
        },
      ]),
    };
  },
});
</script>

<style lang="scss">
.intro {
  padding: 16px;
  max-height: 95vh;
  max-width: 100vw;
  line-height: 28px;
  text-align: center;

  h1 {
    margin: 48px 0;
    line-height: 40px;
  }

  .games {
    margin-top: 32px;
    display: inline-grid;
    grid-template-columns: 1fr;
    row-gap: 24px;

    a {
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
      text-decoration: none;

      &:hover,
      &:focus {
        background: rgb(50, 255, 0);
        color: black;
      }
    }
  }

  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 24px;

    a {
      color: rgb(50, 255, 0);
      cursor: pointer;
      text-decoration: none;

      &:hover,
      &:focus {
        text-decoration: underline;
      }
    }
  }
}
</style>
