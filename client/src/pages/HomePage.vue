<template>
  <div class="home-page container">

    <div v-if="account.id" class="my-2">
      <div class="d-flex align-items-center justify-content-center flex-column">
        <img :src="account.picture" alt="profile picture" class="rounded-circle" height="100" width="100" />
        <b>
          {{ account.name }}
        </b>
      </div>
    </div>

    <div class="list-group" v-for="channel in channels">
      <ChannelItem :channel="channel" />
    </div>

  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue';
import { AppState } from '../AppState.js';
import { hostService } from '../services/HostService.js';
import { AuthService } from '../services/AuthService.js';


export default {
  setup() {
    onMounted(() => {
      hostService.getAllStreams()
    })

    return {
      account: computed(() => AppState.account),
      channels: computed(() => AppState.channels)
    }
  }
}
</script>

<style scoped lang="scss">
.home-page {}
</style>
