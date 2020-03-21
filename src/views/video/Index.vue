<template>
  <div id="video" v-loading="data === undefined && playInfo === undefined">
    <Wake
      v-if="player"
      :interval="20"
      :trigger="shouldWake"
      @pause="player.pause()"
      @play="player.play()"
    />
    <div class="top" ref="top">
      <div id="player" :style="getPlayerStyle()" v-loading="playInfo === undefined">
        <Watermark v-if="player" />
        <Error v-if="error" @retry="init" title="无法播放" :code="error.code" :msg="error.msg" />
      </div>
      <div class="related" v-if="data">
        <div class="unit" v-for="unit in data.unit" :key="unit.id">
          <h4 v-if="data.unit.length > 1">{{ unit.title }}</h4>
          <div class="lesson-wrapper">
            <div
              tag="div"
              class="item"
              @click="toVideo(lesson.id)"
              v-for="lesson in unit.lesson"
              :class="{ active : lesson.id.toString() === $route.params.id }"
              :key="lesson.id"
            >
              <i
                v-if="lesson.id.toString() === $route.params.id"
                class="anyteachicon anyteach-play1"
              />
              <span>{{ lesson.sort }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="info" v-if="data">
      <h2>
        {{ data.title }}
        <span v-if="playInfo && data.unit.length > 1">· {{ playInfo.unit.title }}</span>
      </h2>
      <h1>{{ lesson.title }}</h1>
      <p v-if="lesson.subtitle">{{ lesson.subtitle }}</p>
    </div>
  </div>
</template>

<script>
import Wake from "@/components/Wake"
import Watermark from "./Watermark"
import Error from "./Error"
export default {
  name: "Video",
  components: {
    Wake,
    Watermark,
    Error
  },
  data() {
    return {
      player: null,
      shouldWake: false,
      data: undefined,
      playInfo: undefined,
      error: undefined,
      height: 400,
      width: 711,
    }
  },
  watch: {
    socket_id: function (val) {
      if (val) {
        this.getPlayInfo()
      }
    },
    $route: function (val) {
      if (this.player) {
        this.player.dispose()
      }
      this.player = null
      this.shouldWake = false
      this.playInfo = undefined
      this.getPlayInfo()
      this.getData()
    }
  },
  computed: {
    socket_id() {
      return this.$store.state.socket.id
    },
    allLessons() {
      if (!this.data) return null
      return this.data.unit.map(unit => {
        return unit.lesson
      }).flat()
    },
    lesson() {
      if (!this.allLessons) return null
      return this.allLessons.find(i => i.id.toString() === this.$route.params.id)
    }
  },
  created() {
    this.setKeys()
    this.init()
  },
  methods: {
    init() {
      this.playInfo = undefined
      this.error = undefined
      this.shouldWake = false
      if (this.socket_id) {
        this.getPlayInfo()
      }
      this.getData()
    },
    getPlayerStyle() {
      return `min-width: ${this.width}px; min-height: ${this.height}px;`
    },
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
      } else {
        this.playInfo = null
        this.error = { code, msg }
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
      this.width = this.height * w / h
      this.$refs.top.style.height = this.height + "px"
      this.player = new Aliplayer({
        id: "player",
        width: this.width + "px",
        height: this.height + "px",
        autoplay: true,
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
    padding: 10px;
    overflow-y: scroll;
    flex-grow: 1;
    background: hsla(0, 0%, 10%, 1);
    h3 {
      margin: 0;
      padding: 10px 20px 10px 10px;
    }
    h4 {
      margin: 0 0 5px 0;
      padding: 0;
      font-size: 14px;
      font-weight: 400;
      opacity: 0.5;
      color: white;
    }
    .unit {
      margin-bottom: 10px;
      &:last-of-type {
        margin: 0;
      }
    }
    .lesson-wrapper {
      display: flex;
      flex-wrap: wrap;
    }
    .item {
      cursor: pointer;
      font-family: DIN alternate;
      font-size: 14px;
      transition: all 0.1s;
      $size: 30px;
      min-height: $size;
      min-width: $size;
      border-radius: $size;
      color: white;
      position: relative;
      span,
      i {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      &:hover {
        color: $color-primary;
        background: hsla(0, 0%, 0, 1);
      }
    }
    .active,
    .active:hover {
      background: $color-primary;
      color: $color-bgd;
    }
    .active {
      span {
        opacity: 0;
      }
      span,
      i {
        transition: all 0.3s;
      }
      &:hover {
        span {
          opacity: 1;
        }
        i {
          opacity: 0;
        }
      }
    }
  }
}

#player {
  overflow: hidden;
  background: hsla(0, 0%, 15%, 1);
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