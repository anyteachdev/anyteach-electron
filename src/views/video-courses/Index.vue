<template>
  <div id="video-courses">
    <div class="empty" v-if="!data.length">
      <div>
        <h1>暂无视频课</h1>
        <p>去手机平台上逛逛吧</p>
        <QR url="http://wx.anyteach.cn" />
      </div>
    </div>
    <div v-else class="courses" ref="wrapper" v-resize.throttle.1000="onResize">
      <router-link
        tag="div"
        ref="item"
        :to="'/videos/watch/' + item.id"
        class="item"
        v-for="(item, index) in data"
        :key="index"
      >
        <div class="img" ref="img" :style="$bgd(item.img)">
          <div class="overlay">
            <i class="el-icon-video-play" />
          </div>
        </div>
        <h2>{{ item.title }}</h2>
      </router-link>
    </div>
  </div>
</template>

<script>
import resize from "vue-resize-directive"
import QR from "@/components/QR"

export default {
  name: "VideoCourses",
  directives: {
    resize,
  },
  components: {
    QR
  },
  data() {
    return {
      data: [
        {
          id: 1,
          title: "测试课程测试课程对方是否胜多负少的发送到",
          img: "https://cdn.anyteach.cn/upload/img/20200224/5e5331e64aa6d.jpg?imageView2/0/w/600/format/jpg"
        },
        {
          id: 2,
          title: "测试课程测试课程",
          img: "https://cdn.anyteach.cn/upload/img/20200121/5e26af1dc4e85.jpg?imageView2/0/w/600/format/jpg"
        },
        {
          id: 3,
          title: "测试课程测试课程",
          img: "https://cdn.anyteach.cn/upload/img/20191111/5dc92bce80a66.jpg"
        },
        {
          id: 4,
          title: "测试课程测试课程",
          img: "https://cdn.anyteach.cn/upload/img/20191111/5dc92bce80a66.jpg"
        },
        {
          id: 5,
          title: "测试课程测试课程",
          img: "https://cdn.anyteach.cn/upload/img/20200224/5e5331e64aa6d.jpg?imageView2/0/w/600/format/jpg"
        },
        {
          id: 6,
          title: "测试课程测试课程",
          img: "https://cdn.anyteach.cn/upload/img/20200121/5e26af1dc4e85.jpg?imageView2/0/w/600/format/jpg"
        },
        {
          id: 7,
          title: "测试课程测试课程",
          img: "https://cdn.anyteach.cn/upload/img/20191111/5dc92bce80a66.jpg"
        },
        {
          id: 8,
          title: "测试课程测试课程",
          img: "https://cdn.anyteach.cn/upload/img/20191111/5dc92bce80a66.jpg"
        },
        {
          id: 5,
          title: "测试课程测试课程",
          img: "https://cdn.anyteach.cn/upload/img/20200224/5e5331e64aa6d.jpg?imageView2/0/w/600/format/jpg"
        },
        {
          id: 6,
          title: "测试课程测试课程",
          img: "https://cdn.anyteach.cn/upload/img/20200121/5e26af1dc4e85.jpg?imageView2/0/w/600/format/jpg"
        },
        {
          id: 7,
          title: "测试课程测试课程",
          img: "https://cdn.anyteach.cn/upload/img/20191111/5dc92bce80a66.jpg"
        },
        {
          id: 8,
          title: "测试课程测试课程",
          img: "https://cdn.anyteach.cn/upload/img/20191111/5dc92bce80a66.jpg"
        },
        {
          id: 5,
          title: "测试课程测试课程",
          img: "https://cdn.anyteach.cn/upload/img/20200224/5e5331e64aa6d.jpg?imageView2/0/w/600/format/jpg"
        },
        {
          id: 6,
          title: "测试课程测试课程",
          img: "https://cdn.anyteach.cn/upload/img/20200121/5e26af1dc4e85.jpg?imageView2/0/w/600/format/jpg"
        },
        {
          id: 7,
          title: "测试课程测试课程",
          img: "https://cdn.anyteach.cn/upload/img/20191111/5dc92bce80a66.jpg"
        },
        {
          id: 8,
          title: "测试课程测试课程",
          img: "https://cdn.anyteach.cn/upload/img/20191111/5dc92bce80a66.jpg"
        },
      ]
    }
  },
  methods: {
    onResize() {
      this.$refs.item.forEach(i => {
        const totalWidth = this.$refs.wrapper.clientWidth
        // const width = (totalWidth - 4 * 15) / 4
        const width = totalWidth * 0.25 - 11.25
        // const height = width * 10 / 16
        i.$el.style.width = width + "px"
        // i.$el.style.height = height + "px"
        // i.style.backgroundSize = width + "px"
      })
      this.$refs.img.forEach(i => {
        const totalWidth = this.$refs.wrapper.clientWidth
        // const width = (totalWidth - 4 * 15) / 4
        const width = totalWidth * 0.25 - 11.25
        const height = width * 10 / 16
        i.style.width = width + "px"
        i.style.height = height + "px"
      })
    }
  },
  created() {
    // this.getToday()
  }
}
</script>

<style scoped lang="scss">
@import "../../styles/common.scss";
#video-courses {
  width: 100%;
}

* {
  transition: all 0.2s;
}
.courses {
  width: 100%;
  overflow: hidden;
  display: grid;
  $testWidth: calc(25% - 11.25px);
  // grid-template-columns: 24% 24% 24% 24%;
  grid-template-columns: $testWidth $testWidth $testWidth $testWidth;
  justify-content: space-between;

  .item {
    margin-bottom: 15px;
    cursor: pointer;
    -webkit-user-select: none;
    display: inline-block;
    h2 {
      margin: 0;
      font-size: 14px;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      overflow: hidden;
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