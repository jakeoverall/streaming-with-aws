<template>
  <header>
    <Navbar />
  </header>
  <main>
    <router-view />
  </main>
   <footer class="bg-dark text-light">
    Made with 💖 by CodeWorks
  </footer>
</template>

<script>
import { computed } from 'vue'
import { AppState } from './AppState'
import Navbar from './components/Navbar.vue'

export default {
  setup() {
    return {
      appState: computed(() => AppState)
    }
  },
  components: { Navbar }
}
</script>
<style lang="scss">
@import "./assets/scss/main.scss";

:root{
  --main-height: calc(100vh - 32px - 64px);
}

pre {
  background-color: #02162a;
  padding: 1rem;
  border-radius: 5px;
  color: #7fff00;
}

footer {
  display: grid;
  place-content: center;
  height: 32px;
}
</style>
