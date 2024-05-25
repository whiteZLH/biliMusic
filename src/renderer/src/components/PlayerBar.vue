<template>
  <div class="play-bar">
    <audio-player ref="audio" class="audio-box" :fileurl="fileurl"></audio-player>
  </div>
</template>
<script>
import AudioPlayer from './audioPlayer1.vue'
export default {
  name: 'PlayerBar',
  components: {
    AudioPlayer
  },
  props: {
    fileurl: {
      type: String
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
</style>
