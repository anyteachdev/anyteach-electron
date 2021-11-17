<template>
  <div
    id="video"
    v-loading="lessonData === undefined && playInfo === undefined"
  >
    <Wake
      v-if="player"
      :interval="20"
      :trigger="shouldWake"
      @pause="player.pause()"
      @play="player.play()"
    />
    <div class="top" ref="top">
      <div
        id="player-wrapper"
        :style="getPlayerStyle()"
        v-loading="playInfo === undefined"
      >
        <div id="player" :style="getPlayerStyle()">
          <Watermark v-if="player" />
          <Error
            v-if="error"
            @retry="init"
            title="无法播放"
            :code="error.code"
            :msg="error.msg"
          />
        </div>
      </div>
      <div class="related" v-if="lessonData">
        <div class="unit">
          <h4 v-if="lessonData[0].lesson.length > 1">
            {{ lessonData[0].title }}
          </h4>
          <div class="lesson-wrapper">
            <div
              tag="div"
              class="item"
              @click="toVideo(lesson.id)"
              v-for="lesson in lessonData[0].lesson"
              :class="{ active: lesson.id.toString() === activeId.toString() }"
              :key="lesson.id"
            >
              <i
                v-if="lesson.id.toString() === activeId.toString()"
                class="anyteachicon anyteach-play1"
              />
              <span>{{ lesson.sort || 0 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="info" v-if="lessonData && lesson">
      <h2>
        {{ lessonData[0].title }}
        <span v-if="playInfo && lessonData[0].length > 1"
          >· {{ playInfo.title }}</span
        >
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
      lessonData: undefined,
      playInfo: undefined,
      error: undefined,
      height: 400,
      width: 711,
      activeId: undefined
    }
  },
  watch: {
    socket_id: function(val) {
      if (val) {
        this.getPlayInfo()
      }
    },
    $route: function(val) {
      // if (this.player) {
      //   this.player.dispose()
      // }
      // this.player = null
      // this.shouldWake = false
      // this.playInfo = undefined
      // this.getData()
      // this.getPlayInfo()
    }
  },
  computed: {
    socket_id() {
      return this.$store.state.socket.id
    },
    // allLessons() {
    //   if (!this.data) return null
    //   return this.data.unit
    //     .map((unit) => {
    //       return unit.lesson
    //     })
    //     .flat()
    // },
    lesson() {
      if (!this.lessonData[0].lesson) return null
      return this.lessonData[0].lesson.find(
        (i) => i.id.toString() === this.activeId.toString()
      )
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

      this.getData()
    },
    getPlayerStyle() {
      return `min-width: ${this.width}px; min-height: ${this.height}px; width: ${this.width}px; height: ${this.height}px;`
    },
    toVideo(id) {
      // lessonid
      if (id.toString() !== this.$route.params.id) {
        this.activeId = id
        if (this.player) {
          this.player.dispose()
        }
        this.getPlayInfo()
      }
    },
    // async getData() {
    //   this.data = await this.$api.video.LESSONS({
    //     l_id: this.$route.params.id
    //   })
    // },
    async getData() {
      const msg = await this.$api.video.CLASSES()

      this.lessonData = msg.filter(
        (item) => item.id === Number(this.$route.params.id)
      )

      this.activeId = this.activeId || this.lessonData[0].last_video
      if (this.activeId === 0) {
        // 未看过视频，默认播放第一个视频
        this.activeId = this.lessonData[0].lesson[0].id
      }
      if (this.socket_id) {
        this.getPlayInfo()
      }
    },
    async getPlayInfo() {
      const { code, msg } = await this.$api.video.PLAY({
        socket_id: this.$store.state.socket.id,
        l_id: this.activeId
      })
      if (code === "1000") {
        this.playInfo = msg.play_info[0]
        this.initPlayer()
      } else {
        this.playInfo = null
        this.error = { code, msg }
        this.init()
      }
    },
    setKeys() {
      document.onkeydown = (event) => {
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
      isFullScreen
        ? this.player.fullscreenService.cancelFullScreen()
        : this.player.fullscreenService.requestFullScreen()
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
      this.player.getStatus() === "playing"
        ? this.player.pause()
        : this.player.play()
    },
    initPlayer() {
      const w = this.playInfo.width
      const h = this.playInfo.height
      this.width = (this.height * w) / h
      this.$refs.top.style.height = this.height + "px"
      this.player = new Aliplayer(
        {
          id: "player",
          width: this.width + "px",
          height: this.height + "px",
          autoplay: true,
          // vid: "7607574dc2714c55b4016a81330ca061",
          source: this.playInfo.PlayURL
          // playauth:
          //   "eyJTZWN1cml0eVRva2VuIjoiQ0FJU2h3TjFxNkZ0NUIyeWZTaklyNWJIUEl2Y3ViaFc1S2lxTUJUWnBXTWJWZng2ckpEcGpEejJJSGhKZVhOdkJPMGV0ZjQrbVdCWTdQY1lsck1xRThVVkh4T2NNWllydHNVUHFGdjRKcExGc3QySjZyOEpqc1Y3eHJVa3NWbXBzdlhKYXNEVkVmbDJFNVhFTWlJUi8wMGU2TC8rY2lyWXBUWEhWYlNDbFo5Z2FQa09Rd0M4ZGtBb0xkeEtKd3hrMnQxNFVtWFdPYVNDUHdMU2htUEJMVXhtdldnR2wyUnp1NHV5M3ZPZDVoZlpwMXI4eE80YXhlTDBQb1AyVjgxbExacGxlc3FwM0k0U2M3YmFnaFpVNGdscjhxbHg3c3BCNVN5Vmt0eVdHVWhKL3phTElvaXQ3TnBqZmlCMGVvUUFQb3BGcC9YNmp2QWF3UExVbTliWXhncGhCOFIrWGo3RFpZYXV4N0d6ZW9XVE84MCthS3p3TmxuVXo5bUxMZU9WaVE0L1ptOEJQdzQ0RUxoSWFGMElVRUJ6RUc2Q2QvWDRvZ21hT2xmeUZaTG9pdjltamNCSHFIeno1c2VQS2xTMVJMR1U3RDBWSUpkVWJUbHpiME5MaHpPOEwvZGRLVjBSSXdNOVZ1eVBNYXgzYlFGRHI1M3ZzVGJiWHpaYjBtcHR1UG56ZHp0ZlB4elo3Q09WR29BQnRJbDVPVE5BY3NQVGRMZnEzTUo3MWdQN2Ivay94WTBLNW0rZVp4V3pNeFNsWmRFMFNIUnF1aUd2RldXckRKSnlUM0xKRVBTRGNoQklqNzVuVi9HbmdRTmNVYnBueFAvVDRoNjBBeGRURHlaSzVvYk95WXE1KzdQSTlOMDcrSHVkeGdvb0Zha2lwRFFFUkhCY2hlT2VYdjZFS0dET2M3amJGeEkrR2g4eUZRWT0iLCJBdXRoSW5mbyI6IntcIkNJXCI6XCJiVHpJYTcySkNTeXlsVU1pdHBkUzNjdFJTeVlVWXg3WmJILzRTU0JZZU03aE8xbzZ0aFY3WW0zYnhFdHJXQm5JNUJ2WHZVRlVJVUNpUHYzWHZCUXJFTnA2V0xsN1Ivd0tyREpJOURJbE5aaz1cIixcIkNhbGxlclwiOlwidHN3TWN2aGNoR3cwNGVjSW9nSFRoTjFpMzBoSkwwMzk1NmpDQnRQU21VOD1cIixcIkV4cGlyZVRpbWVcIjpcIjIwMjEtMTEtMTdUMDI6MzY6MDJaXCIsXCJNZWRpYUlkXCI6XCI3NjA3NTc0ZGMyNzE0YzU1YjQwMTZhODEzMzBjYTA2MVwiLFwiUGxheURvbWFpblwiOlwidi5hbnl0ZWFjaC5jblwiLFwiU2lnbmF0dXJlXCI6XCJXeG1JUm5XZDhCRUYycm52MUpMZVp1QUFURmc9XCJ9IiwiVmlkZW9NZXRhIjp7IlN0YXR1cyI6Ik5vcm1hbCIsIlZpZGVvSWQiOiI3NjA3NTc0ZGMyNzE0YzU1YjQwMTZhODEzMzBjYTA2MSIsIlRpdGxlIjoiNDE5NWQyY2YtMTdjMDI3OGVlODIubXA0IiwiQ292ZXJVUkwiOiJodHRwczovL3YuYW55dGVhY2guY24vNzYwNzU3NGRjMjcxNGM1NWI0MDE2YTgxMzMwY2EwNjEvc25hcHNob3RzLzM5OGYxNGZkNmJmYzRmYWU5MjZjNmQ1YWVhYjYxYzhiLTAwMDA1LmpwZyIsIkR1cmF0aW9uIjoxNDcuNjU2fSwiQWNjZXNzS2V5SWQiOiJTVFMuTlVydzFoVGd3U2pBMjJoQWNOWXNWQ1VCbiIsIlBsYXlEb21haW4iOiJ2LmFueXRlYWNoLmNuIiwiQWNjZXNzS2V5U2VjcmV0IjoiOFZwS2RvcWVkcHB3aXR2SE1Zb0YyQ0M3cmd4U1dVUVZ0eEU0VDlqdnFYWmYiLCJSZWdpb24iOiJjbi1zaGFuZ2hhaSIsIkN1c3RvbWVySWQiOjEwMjgyNzA0NTMwOTAxMDF9==", // cover: "",
          // encryptType: 1
        },
        (player) => {
          player.on("play", () => {
            this.shouldWake = true
          })

          player.on("pause", () => {
            this.shouldWake = false
          })
        }
      )
    }
  }
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
      font-size: 16px;
      transition: all 0.1s;
      $size: 40px;
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

#player,
#player-wrapper {
  overflow: hidden;
  position: relative;
  background: hsla(0, 0%, 15%, 1);
}

.info {
  transition: all 0.3s;

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
.prism-controlbar {
  background: rgba(24, 15, 15, 0.6);
  z-index: 100001;
  backdrop-filter: blur(5px);
}
</style>
