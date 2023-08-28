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
      <div id="player-wrapper" :style="getPlayerStyle()">
        <Error
          v-if="unique === false"
          @retry="init"
          title="您的账号已在别的设备登陆"
        />
        <div id="player" :style="getPlayerStyle()">
          <Error
            v-if="error"
            @retry="init"
            title="无法播放"
            :code="error.code"
            :msg="error.msg"
          />
        </div>
        <Watermark v-if="player" />
      </div>
      <div class="related" v-if="data" :style="getLessonStyle()">
        <!-- <h4 v-if="data.unit.length > 1">{{ unit.title }}</h4> -->
        <div class="lesson-wrapper">
          <div
            tag="div"
            class="lesson-item"
            @click="toVideo(lesson.id)"
            v-for="lesson in allLessons"
            :class="{
              'lesson-item-active': lesson.id.toString() === $route.params.id,
            }"
            :key="lesson.id"
          >
            <div class="ell">
              <span class="sort">{{ lesson.sort || 0 }}</span>
              <span>{{ lesson.title }}</span>
            </div>

            <i
              v-if="
                lesson.is_complete !== 1 &&
                lesson.id.toString() === $route.params.id
              "
              class="anyteachicon anyteach-zhengzaibofang"
            />
            <!-- 进度条 -->
            <el-progress
              v-if="
                lesson.is_complete !== 1 &&
                lesson.id.toString() !== $route.params.id &&
                lesson.last_position.toString() !== '0'
              "
              type="circle"
              :width="18"
              :stroke-width="2"
              :show-text="false"
              :percentage="
                (Number(lesson.last_position) * 100) / Number(lesson.duration)
              "
              status="exception"
            ></el-progress>
            <!-- 已播放完成 -->
            <i
              class="anyteachicon anyteach-check"
              v-if="lesson.is_complete === 1"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="info" v-if="data">
      <h2>
        {{ data.title }}—{{ data.end_time }}
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
      play_id: undefined,
      error: undefined,
      height: 400,
      width: 711,
      timer: undefined,
      sendRecordTimer: undefined,
      unique: undefined,
      time: 0,
      scrollTop: 0
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
      this.play_id = undefined
      // this.getPlayInfo()
      this.getData()
    }
  },
  computed: {
    socket_id() {
      return this.$store.state.socket.id
    },
    allLessons() {
      if (!this.data) return null
      return this.data.lesson
    },
    lesson() {
      if (!this.allLessons) return null
      return this.allLessons.find(
        (i) => i.id.toString() === this.$route.params.id
      )
    }
  },
  created() {
    this.setKeys()
    this.init()
  },
  mounted() { },
  methods: {
    async init() {
      this.playInfo = undefined
      this.error = undefined
      this.unique = undefined
      this.shouldWake = false
      if (this.socket_id) {
        // this.getPlayInfo()
      }

      await this.getData()
    },

    getPlayerStyle() {
      return `min-width: ${this.width}px; min-height: ${this.height}px; width: ${this.width}px; height: ${this.height}px;`
    },
    getLessonStyle() {
      // return `min-height: ${this.height - 50}px;height: ${this.height - 50}px;`
      return `height: ${this.height}px;`
    },
    toVideo(id) {
      if (id.toString() !== this.$route.params.id) {
        this.scrollTop = document.getElementsByClassName("related")[0].scrollTop
        sessionStorage.setItem("scrollTop", this.scrollTop)
        this.$router.push("/videos/watch/" + id)
      }
    },
    async getData() {
      const msg = await this.$api.video.CLASSES()
      msg.map((item) => {
        item.lesson.map((les) => {
          if (this.$route.params.id === les.id.toString()) {
            if (item.end_time) {
              const time = new Date(item.end_time)
              item.end_time = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " 到期"
            }
            this.data = item
            this.$nextTick(() => {
              this.scrollTop = sessionStorage.getItem("scrollTop")
              document.getElementsByClassName(
                "related"
              )[0].scrollTop = this.scrollTop
            })
          }
        })
      })
      if (this.socket_id) {
        this.getPlayInfo()
      }
    },
    async getPlayInfo() {
      const { code, msg } = await this.$api.video.PLAY({
        socket_id: this.$store.state.socket.id,
        l_id: this.$route.params.id
      })
      if (code === "1000") {
        this.playInfo = msg.play_info[2]
        this.play_id = msg.play_id
        this.getTimer()
        this.initPlayer()
      } else {
        this.playInfo = null
        this.error = { code, msg }
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
    sendCheck() {
      this.$store.dispatch("socket/log", {
        name: "video_socket_id_check",
        url: "",
        data: this.play_id
      })
    },
    getTimer() {
      this.sendCheck(this.play_id)
      this.timer && clearInterval(this.timer)
      this.timer = setInterval(this.sendCheck, 5000)
    },
    checkSatatus(player) {
      // 监听是否唯一设备
      this.unique === undefined &&
        this.$store.state.socket.client.on("video_socket_id_check", (data) => {
          this.unique = data
          if (this.unique === false) {
            if (player) {
              player.pause()
            }
          }
        })
    },
    updateRecord(player) {
      // 更新最近播放位置&发送视频进度
      player.seek(this.lesson.last_position)
      this.sendRecord()
    },
    sendRecord() {
      // 每秒钟记录当前视频进度
      this.sendRecordTimer && clearInterval(this.sendRecordTimer)
      this.sendRecordTimer = setInterval(() => {
        this.time++
        this.$store.dispatch("socket/log", {
          name: "video_record",
          url: "",
          data: {
            course_id: this.lesson.pid, // 课程 ID
            lesson_id: this.lesson.id, // 小节 ID
            play_id: this.play_id, // 后端接口颁发的播放 ID
            time: this.time, // 计时器当前秒数，从 0 开始
            video_time: parseInt(this.player.getCurrentTime()) // 视频播放器当前秒数
          }
        })
        //实时更新 last_position 字段
        this.allLessons.map((item) => {
          if (item.id.toString() === this.$route.params.id) {
            // 当前小节，更新数据
            item.last_position = this.player.getCurrentTime()
            if (JSON.parse(item.duration) - this.player.getCurrentTime() < 10) {
              if (item.is_complete !== 1) {
                this.updateStatus()
                item.is_complete = 1
              }
            }
          }
          return item
        })
      }, 1000)
    },
    async updateStatus() {
      await this.$api.video.COMPLETE({
        play_id: this.play_id
      })
    },
    initPlayer() {
      const w = this.playInfo.width
      const h = this.playInfo.height
      this.width = (this.height * w) / h
      this.$refs.top.style.height = this.height + "px"
      // if (this.player === null) {
      this.player = new Aliplayer(
        {
          id: "player",
          width: this.width + "px",
          height: this.height + "px",
          autoplay: true,
          source: this.playInfo.PlayURL
        },
        (player) => {
          player.on("play", () => {
            this.shouldWake = true
            this.updateRecord(player)
            this.checkSatatus(player)
          })
          player.on("pause", () => {
            this.shouldWake = false
            // this.timer && clearInterval(this.timer)
            // this.sendRecordTimer && clearInterval(this.sendRecordTimer)
            if (this.unique === false) {
              if (this.player) {
                setTimeout(() => {
                  this.player.dispose()
                })
              }
            }
          })
          player.on("ended", () => {
            this.updateStatus()
            this.time = 0
            clearInterval(this.sendRecordTimer)
            //视频播放结束，更新 is_complete 字段
            this.allLessons.map((item) => {
              if (item.id.toString() === this.$route.params.id) {
                // 当前小节，更新数据
                item.is_complete = 1
                item.last_position = 0
              }
              return item
            })
          })
        }
      )
      // }
    }
  },
  destroyed() {
    this.timer && clearInterval(this.timer)
    this.sendRecordTimer && clearInterval(this.sendRecordTimer)
    // sessionStorage.setItem("scrollTop", 0)
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
      // &:last-of-type {
      //   margin: 0;
      // }
    }
    .ell {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      span {
        font-size: 12px;
      }
    }
    .lesson-wrapper {
      display: flex;
      flex-wrap: wrap;
      .lesson-item {
        display: flex;
        justify-content: space-between;
        border: 2px solid transparent;
        color: white;
        background: hsla(0, 0%, 20%, 1);
        width: 100%;
        margin-bottom: 10px;
        padding: 8px 10px;
        border-radius: 5px;
        cursor: pointer;
        height: 38px;
        transition: all 0.2s;
        &:last-of-type {
          margin-bottom: 0;
        }
        .sort {
          margin-right: 8px;
          opacity: 0.4;
        }
        i {
          font-size: 12px;
          margin-top: 3px;
          color: $color-primary;
        }
      }
      .lesson-item:hover,
      .lesson-item-active {
        border: 2px solid rgba(237, 38, 78, 1);
      }
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
      // background: $color-primary;
      color: $color-primary;
    }
    .anyteach-zhengzaibofang {
      transition: all 0.3s;
      font-weight: bold;
    }
    // .active {
    //   span {
    //     opacity: 0;
    //   }
    //   span,
    //   i {
    //     transition: all 0.3s;
    //   }
    //   &:hover {
    //     span {
    //       opacity: 1;
    //     }
    //     i {
    //       opacity: 0;
    //     }
    //   }
    // }
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
