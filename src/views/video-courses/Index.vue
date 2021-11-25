<template>
  <div
    id="video-courses"
    v-loading="data === undefined && $store.state.user.user_id"
  >
    <div class="empty" v-if="data && !data.length">
      <div>
        <h1>暂无视频课</h1>
        <p>去手机平台上逛逛吧</p>
        <QR url="http://wx.anyteach.cn" />
      </div>
    </div>
    <div v-else class="courses" ref="wrapper">
      <div
        ref="item"
        @click="toVideo(item)"
        class="course-item"
        v-for="(item, index) in data"
        :key="index"
      >
        <div class="img" ref="img" :style="$bgd(item.img)">
          <div class="overlay">
            <i class="el-icon-video-play" />
          </div>
        </div>
        <h2>{{ item.title }}</h2>
        <div class="c-footer">
          <h3>
            {{ item.lesson.length }}
            个视频
          </h3>
          <!-- 进度条 -->
          <el-progress
            type="circle"
            :show-text="false"
            :percentage="item.perc * 100"
            status="exception"
          ></el-progress>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QR from "@/components/QR"
import { ipcRenderer } from "electron"
export default {
  name: "VideoCourses",
  components: {
    QR
  },
  data() {
    return {
      data: undefined
    }
  },
  methods: {
    toVideo(item) {
      // const lesson = item.last_video
      this.$router.push({
        path: "/videos/watch/" + item.id
      })
    },
    async getClasses() {
      this.data = await this.$api.video.CLASSES()
      this.data.map((item) => {
        let perc = 0
        item.lesson.map((lesson) => {
          perc = perc + lesson.last_position / JSON.parse(lesson.duration)
        })
        item.perc = perc / item.lesson.length
      })
      this.$nextTick(() => this.onResize())
    },
    onResize() {
      const items = [...document.getElementsByClassName("course-item")]
      if (!items.length) return
      this.$refs.item.forEach((i) => {
        const totalWidth = this.$refs.wrapper.clientWidth
        const width = totalWidth * 0.25 - 11.25
        i.style.width = width + "px"
      })
      this.$refs.img.forEach((i) => {
        const totalWidth = this.$refs.wrapper.clientWidth
        const width = totalWidth * 0.25 - 11.25
        const height = (width * 10) / 16
        i.style.width = width + "px"
        i.style.height = height + "px"
      })
    }
  },
  activated() {
    this.getClasses()
    ipcRenderer.on("will-resize", (event, newBounds) => {
      this.onResize()
    })
  }
}
</script>
<style>
#video-courses .el-progress-circle {
  width: 20px !important;
  height: 20px !important;
}
</style>

<style scoped lang="scss">
@import "../../styles/common.scss";
#video-courses {
  width: 100%;
  min-height: 60vh;
}

* {
  transition: all 0.2s;
}
.courses {
  width: 100%;
  overflow: hidden;
  display: grid;
  $columnWidth: calc(25% - 11.25px);
  grid-template-columns: $columnWidth $columnWidth $columnWidth $columnWidth;
  justify-content: space-between;

  .course-item {
    margin-bottom: 15px;
    cursor: pointer;
    -webkit-user-select: none;
    display: inline-block;
    .c-footer {
      display: flex;
      justify-content: space-between;
    }
    h2 {
      margin: 0;
      padding: 0;
      font-size: 14px;
      line-height: 1.2;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    h3 {
      margin: 0;
      padding: 0;
      opacity: 0.6;
      font-weight: 400;
      font-size: 14px;
    }
    .img {
      border: $border;
      @include rounded();
      position: relative;
      overflow: hidden;
      margin-bottom: 5px;
      background-size: 100%;
    }
    .overlay {
      position: absolute;
      opacity: 0;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      // background: rgba(1, 131, 255, 0.8);
      background: rgba(237, 37, 78, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 50px;
    }
    &:hover {
      .img {
        background-size: 110% !important;
      }
      h2 {
        color: $color-primary;
      }
      .overlay {
        opacity: 1;
      }
    }
    &:active {
      .overlay i {
        transform: scale(0.9);
      }
    }
  }
}
</style>
