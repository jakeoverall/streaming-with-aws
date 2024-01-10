<template>
  <div class="container" v-if="channel">

    <div class="channel-controls my-3" v-if="canHost">
      <span>
        <button v-if="channel.stream.State != 'RUNNING'" class="btn btn-primary btn-sm" @click="channelUpdate('start')"> Start
          Channel</button>
        <button v-else class="btn btn-danger btn-sm" @click="channelUpdate('stop')">Stop Channel</button>
      </span>
    </div>

    <div class="card text-dark">
      <div class="card-body">
        <p><kbd class="badge">{{ channel.stream.State }}</kbd></p>
        <h3>{{ channel.stream.Name }}</h3>
      </div>
      <div class="p-3">
        <video id="video" controls autoplay></video>
        <div>
          <p class="my-1">HLS Endpoints</p>
          <div class="list-group">
            <div class="list-group-item selectable" v-for="endpoint in channel.hlsEndpoints" @click="playStream(endpoint.Url)">
              <i class="mdi mdi-play"></i>{{ endpoint.Url }}
            </div>
          </div>
        </div>

      </div>
    </div>


    <div class="my-3">
      <details>
        <summary class="no-highlight">Channel Details</summary>
        <pre><code>{{ JSON.stringify(channel, null, 2) }}</code></pre>
      </details>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue';
import { AppState } from '../AppState.js';
import { AuthService } from '../services/AuthService.js';
import { hostService } from '../services/HostService.js';
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute()
    const user = computed(() => AppState.user)
    const canHost = ref(false)

    watch(user, () => {
      canHost.value = AuthService.hasPermissions('manage:streams')
    }, { immediate: true })

    onMounted(() => {
      hostService.getStream(route.params.channelId)
    })


    return {
      canHost,
      user,
      channel: computed(() => AppState.channel),
      channelUpdate(action) {
        if (action == 'start') {
          hostService.startStream(route.params.channelId)
        } else {
          hostService.stopStream(route.params.channelId)
        }
      },
      playStream(url) {
        const video = document.getElementById('video')
        if (Hls.isSupported()) {
          var hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
          video.volume = 0.1;
          video.play();
        }
      },
    }
  }
}
</script>

<style scoped lang="scss">
video {
  width: 100%;
  height: auto;
}
</style>
