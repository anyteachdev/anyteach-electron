<template>
  <div id="video" v-loading="data === undefined || playInfo === undefined">
    <Wake
      v-if="player"
      :interval="20"
      :trigger="shouldWake"
      @pause="player.pause()"
      @play="player.play()"
    />
    <div class="top" ref="top">
      <div id="player">
        <Watermark v-if="player" />
      </div>
      <div class="related" v-if="data && player">
        <div class="unit" v-for="unit in data.unit" :key="unit.id">
          <h4 v-if="data.unit.length > 1">{{ unit.title }}</h4>
          <div
            tag="div"
            class="item"
            @click="toVideo(lesson.id)"
            v-for="lesson in unit.lesson"
            :key="lesson.id"
          >
            <i class="el-icon-video-play" />
            {{ lesson.title }}
          </div>
        </div>
      </div>
    </div>
    <div class="info" v-if="data && playInfo">
      <h2>{{ data.title }}</h2>
      <h1>{{ playInfo.lesson.title }}</h1>
      <p v-if="playInfo.lesson.subtitle">{{ playInfo.lesson.subtitle }}</p>
    </div>
  </div>
</template>

<script>
import Wake from "@/components/Wake"
import Watermark from "./Watermark"
export default {
  name: "Video",
  components: {
    Wake,
    Watermark
  },
  data() {
    return {
      player: null,
      shouldWake: false,
      data: undefined,
      playInfo: undefined
    }
  },
  watch: {
    socket_id: function (val) {
      if (val) {
        this.getPlayInfo()
      }
    },
    $route: function (val) {
      this.player.dispose()
      this.player = null
      this.shouldWake = false
      this.data = undefined
      this.playInfo = undefined
      this.getPlayInfo()
      this.getData()
    }
  },
  computed: {
    socket_id() {
      return this.$store.state.socket.id
    }
  },
  created() {
    this.setKeys()
    if (this.socket_id) {
      this.getPlayInfo()
    }
    this.getData()
  },
  methods: {
    toVideo(id) {
      if (id.toString() !== this.$route.params.id) {
        this.$router.push("/videos/watch/" + id)
      }
    },
    async getData() {
      this.data = await this.$api.video.LESSONS({
        l_id: this.$route.params.id
      })
    },
    async getPlayInfo() {
      const { code, msg } = await this.$api.video.PLAY({
        socket_id: this.$store.state.socket.id,
        l_id: this.$route.params.id
      })
      if (code === "1000") {
        this.playInfo = msg
        this.initPlayer()
      }

    },
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
      const w = this.playInfo.lesson.width
      const h = this.playInfo.lesson.height
      const height = 350
      this.$refs.top.style.height = height + "px"
      this.player = new Aliplayer({
        id: "player",
        width: (height * w / h) + "px",
        height: height + "px",
        autoplay: false,
        vid: this.playInfo.lesson.video_id,
        playauth: this.playInfo.PlayAuth,
        cover: "",
        encryptType: 1,
      }, (player) => {
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
@import "./style.scss";
#video {
  -webkit-user-select: none;
  max-width: 1000px;
  min-height: 90vh;
  margin: auto;
  transition: all 0.3s;
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
    h4 {
      margin: 0;
      padding: 0;
    }
    .item {
      cursor: pointer;
      font-weight: 500;
      // padding: 10px 20px 10px 10px;
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
  transition: all 0.3s;
  padding: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0);

  h1 {
    margin: 0;
    padding: 0;
  }
  h2 {
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    opacity: 0.6;
  }
  p {
    margin: 10px 0 0 0;
  }
}
</style>
<style lang="scss">
.prism-player .prism-liveshift-progress .prism-progress-played,
.prism-player .prism-progress .prism-progress-played {
  background: $color-primary;
}
</style>