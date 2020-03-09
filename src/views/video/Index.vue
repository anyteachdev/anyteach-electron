<template>
  <div id="video">
    <div class="left">
      <div id="player">
        <div class="overlay-wrapper">
          <div v-for="i in 20" :key="i" class="overlay">
            <p v-for="j in 20" :key="j">{{ $store.state.user.name }} {{ $store.state.user.user_id }}</p>
          </div>
        </div>
      </div>
      <div class="info">
        <h1>视频标题</h1>
        <p v-for="i in 20" :key="i">视频副标题</p>
      </div>
    </div>
    <div class="right">
      <p v-for="i in 20" :key="i">right</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Video",
  data() {
    return {}
  },
  methods: {
    initPlayer() {
      /*eslint no-unused-vars: "off"*/
      const player = new Aliplayer({
        id: "player",
        width: "100%",
        height: "60vh",
        autoplay: true,
        source: "http://v.anyteach.cn/sv/2a003583-170ba43057d/2a003583-170ba43057d.mp4",
        // vid: this.$route.params.id,
        playauth: "",
        cover: "",
        encryptType: 1,
      }, function () {
        // player ready
        const video = document.getElementsByTagName("video")[0]
        video.style.height = "auto"
        const player = document.querySelector("#player")
        player.style.width = video.clientWidth + "px"
        player.style.height = video.clientHeight + "px"
      })
    }
  },
  mounted() {
    this.initPlayer()
  }
}
</script>

<style scoped>
@import "https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css";
</style>
<style lang="scss" scoped>
#video {
  display: flex;
  .left {
    width: 100%;
  }
  .right {
    border-left: $border;
    padding: 20px;
    min-width: 250px;
    overflow: scroll;
    @include height(100vh);
  }
}

#player {
  overflow: hidden;
  -webkit-user-select: none;
}

.info {
  overflow: scroll;
  @include height(40vh);
  padding: 20px;

  h1 {
    margin: 0;
  }
}
.overlay-wrapper {
  transform: rotate(-25deg) translateY(-150px) translateX(-150px);
}
.overlay {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 100000;
  background: none;
  opacity: 0.8;
  overflow: visible;
  pointer-events: none;
  -webkit-user-select: none;
  height: 400px;
  color: white;
  p {
    margin-bottom: 70px;
    font-size: 14px;
  }
  &:nth-child(2) {
    transform: translateX(200px);
  }
  &:nth-child(3) {
    transform: translateX(400px);
  }
  &:nth-child(4) {
    transform: translateX(600px);
  }
  &:nth-child(5) {
    transform: translateX(800px);
  }
  &:nth-child(6) {
    transform: translateX(1000px);
  }
  &:nth-child(7) {
    transform: translateX(1200px);
  }
  &:nth-child(8) {
    transform: translateX(1400px);
  }
  &:nth-child(9) {
    transform: translateX(1600px);
  }
  &:nth-child(10) {
    transform: translateX(1800px);
  }
}

.prism-fullscreen {
  .overlay p {
    font-size: 20px;
    margin-bottom: 100px;
  }
}
</style>