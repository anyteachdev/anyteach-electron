<template>
  <div id="video">
    <Wake
      v-if="player"
      :interval="20"
      :trigger="shouldWake"
      @pause="player.pause()"
      @play="player.play()"
    />
    <div class="top" ref="top">
      <div id="player">
        <div class="overlay-wrapper">
          <div v-for="i in 20" :key="i" class="overlay">
            <p
              v-for="j in 20"
              :key="j"
            >{{ $store.state.user.name }} {{ $store.state.user.mobile || $store.state.user.user_id }}</p>
          </div>
        </div>
      </div>
      <div class="related">
        <h3>选择回放</h3>
        <div class="item" v-for="i in 20" :key="i">
          <i class="el-icon-video-play" />
          第 {{ i }} 讲
        </div>
      </div>
    </div>
    <div class="info">
      <h1>视频标题</h1>
      <p v-for="i in 2" :key="i">视频副标题</p>
    </div>
  </div>
</template>

<script>
import Wake from "@/components/Wake"
export default {
  name: "Video",
  components: {
    Wake,
  },
  data() {
    return {
      player: null,
      shouldWake: false
    }
  },
  created() {
    this.setKeys()
  },
  mounted() {
    this.initPlayer()
  },
  methods: {
    setKeys() {
      document.onkeydown = event => {
        if (!event) {
          event = window.event
        }
        let code = event.keyCode
        if (event.charCode && code == 0) {
          code = event.charCode
        }
        switch (code) {
          case 32:
            // Space bar
            this.playPause()
            break
          case 37:
            // Key left.
            this.seek(false)
            break
          case 38:
            // Key up.
            this.volume()
            break
          case 39:
            // Key right.
            this.seek()
            break
          case 40:
            // Key down.
            this.volume(false)
            break
          case 70:
            // F
            this.fullscreen()
            break
        }
        // event.preventDefault()
      }
    },
    fullscreen() {
      if (!this.player) return
      const isFullScreen = this.player.fullscreenService.getIsFullScreen()
      isFullScreen ? this.player.fullscreenService.cancelFullScreen() : this.player.fullscreenService.requestFullScreen()
    },
    volume(up = true) {
      if (!this.player) return
      const current = this.player.getVolume()
      const update = up ? current + 0.1 : current - 0.1
      if (update >= 0 && update <= 1) {
        this.player.setVolume(update)
      }
    },
    seek(forward = true) {
      if (!this.player) return
      const current = this.player.getCurrentTime()
      const update = forward ? current + 5 : current - 5
      this.player.seek(update)
    },
    playPause() {
      if (!this.player) return
      this.player.getStatus() === "playing" ? this.player.pause() : this.player.play()
    },
    initPlayer() {
      const w = 1920
      const h = 1080
      const height = 350
      this.$refs.top.style.height = height + "px"
      this.player = new Aliplayer({
        id: "player",
        width: (height * w / h) + "px",
        height: height + "px",
        autoplay: true,
        source: "http://v.anyteach.cn/sv/2a003583-170ba43057d/2a003583-170ba43057d.mp4",
        // vid: this.$route.params.id,
        playauth: "",
        cover: "",
        encryptType: 1,
      }, (player) => {
        // const video = document.getElementsByTagName("video")[0]
        // video.style.height = "auto"
        // const el = document.querySelector("#player")
        // el.style.width = video.clientWidth + "px"
        // el.style.height = video.clientHeight + "px"

        player.on("play", () => {
          this.shouldWake = true
        })

        player.on("pause", () => {
          this.shouldWake = false
        })

      })

    }
  },
}
</script>

<style lang="scss" scoped>
@import url(https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css);

#video {
  -webkit-user-select: none;
  max-width: 1000px;
  margin: 20px auto;
  .left {
    width: 100%;
    padding: 20px;
  }
  .top {
    display: flex;
  }
  .related {
    padding: 10px 0 10px 10px;
    overflow: scroll;
    flex-grow: 1;
    background: $color-border;
    h3 {
      margin: 0;
      padding: 10px 20px 10px 10px;
    }
    .item {
      cursor: pointer;
      font-weight: 500;
      padding: 10px 20px 10px 10px;
      font-size: 14px;
      transition: all 0.2s;
      $radius: 30px;
      border-top-left-radius: $radius;
      border-bottom-left-radius: $radius;
      &:hover {
        background: $color-primary;
        color: white;
      }
    }
  }
}

#player {
  overflow: hidden;
}

.info {
  // overflow: scroll;
  // @include height(40vh);
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
  opacity: 0.6;
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
    font-size: 16px;
    margin-bottom: 120px;
  }
}
</style>