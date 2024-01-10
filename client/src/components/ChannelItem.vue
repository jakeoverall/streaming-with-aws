<template>
  <div class="list-group-item">
    <router-link :to="{ name: 'Channel', params: { channelId: channel.Id } }">
      {{ channel.Name }} - {{ channel.State }}
    </router-link>
  </div>
</template>


<script>
import { computed, ref, watch } from 'vue'
import { AuthService } from '../services/AuthService.js'
import { AppState } from '../AppState.js'
import { hostService } from '../services/HostService.js'

export default {
  props: ['channel'],
  setup() {

    const user = computed(() => AppState.user)
    const canHost = ref(false)

    watch(user, () => {
      canHost.value = AuthService.hasPermissions('manage:streams')
    })

    return {
      user,
      canHost
    }
  }
}
</script>


<style lang="scss" scoped>

</style>