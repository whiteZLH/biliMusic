<template>
  <div class="audio-player">
    <!--        暂时没有办法规避 referer, 打算使用本地接口实现一个代理模式-->
    <!--    上述方法未采用，使用 electron session 完成请求拦截，成功！-->
    <audio ref="audioRef" controls style="display: none" @timeupdate="updateProgress">
      <source :src="fileurl" type="audio/mpeg" />
      您的浏览器不支持音频播放
    </audio>
    <div class="audio-right">
      <i
        :class="
          audioStatus !== 'pause' ? 'iconfont icon-icon_bofang' : 'iconfont icon-icon_zanting'
        "
        class="dialogAudioPlay"
        @click="playAudio"
      ></i>
      <div id="progressBarBg" v-dragto="setAudioIcon" class="progress-bar-bg">
        <div id="progressBar" class="progress-bar"></div>
      </div>
      <div class="audio-time" style="min-height: 10px">
        <span id="audioCurTime" class="audio-length-current">{{ audioStart }}</span
        >/
        <span class="audio-length-total">{{ duration }}</span>
      </div>
      <div class="volume">
        <div
          v-show="audioHuds"
          class="volume-progress"
          @click.stop="
            () => {
              return false
            }
          "
        >
          <div id="volumeBarBg" v-adjuster="handleShowMuteIcon" class="volume-bar-bg">
            <div id="volumeBar" class="volume-bar"></div>
          </div>
        </div>
        <i class="iconfont pl-1" :class="audioIcon" @click.stop="audioHuds = !audioHuds"> </i>
      </div>
    </div>
  </div>
</template>

<script>
import '../assets/fonts/iconfont.css'
// import {PlayerBus} from "@/utils/EventBus";
export default {
  directives: {
    dragto: {
      // vue3 写法 vue2 需要将mounted 改为 inserted 害人不浅
      mounted: function (el, binding, vnode) {
        console.log(123)
        // 添加点击事件，单击实现进度改变
        // TODO 由当前实现方式改为可拖拽方式
        // 参考文献: https://blog.csdn.net/weixin_47627529/article/details/106895565
        el.addEventListener(
          'click',
          (e) => {
            let wdiv = document.getElementById('progressBarBg').clientWidth
            // console.log(vnode)
            // vue2 写法  let audio = vnode.context.$refs.audioRef
            let audio = vnode.ctx.refs.audioRef
            // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
            let ratemin = e.offsetX / wdiv
            let rate = ratemin * 100
            document.getElementById('progressBar').style.width = rate + '%'
            audio.currentTime = audio.duration * ratemin
            // audio.play()
            // binding.value()
          },
          false
        )
      }
    },
    adjuster: {
      // vue3 写法 vue2 需要将mounted 改为 inserted
      mounted: function (el, binding, vnode) {
        el.addEventListener(
          'click',
          (e) => {
            let hdiv = document.getElementById('volumeBarBg').clientHeight
            // 同上
            let audio = vnode.ctx.refs.audioRef
            // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
            let ratemin = e.offsetY / hdiv
            let rate = ratemin * 100
            if (rate < 3) {
              rate = 0
              ratemin = 0
            }
            document.getElementById('volumeBar').style.height = rate + '%'
            audio.volume = ratemin
            binding.value(rate / 100)
          },
          false
        )
      }
    }
  },
  props: {
    fileurl: {
      type: String
    }
  },
  data() {
    return {
      audioStatus: 'play',
      audioStart: '0:00',
      duration: '0:00',
      audioVolume: 0.5,
      audioHuds: false,
      loop: true
    }
  },
  computed: {
    audioIcon() {
      if (this.audioHuds) {
        return this.audioVolume < 0.01 ? 'checked icon-icon-jingyin' : 'checked icon-shengyin'
      } else {
        return 'icon-shengyin'
      }
    }
  },
  watch: {
    fileurl() {
      // 检测当前音乐的src 有没有改变， 改变之后， 恢复初始状态
      this.$refs.audioRef.load()
      this.audioStatus = 'play'
      this.audioStatus = '0:00'
      if (document.getElementById('progressBar')) {
        document.getElementById('progressBar').style.width = 0 + '%'
      }
      this.playAudio()
    }
  },
  created() {
    /**data
     * {
     *   musicInfo
     * }
     */
    // let that = this;
    // PlayerBus.on('musicChange', (data) => {
    //   // this.fileurl = data.musicInfo.musicSrc
    //   that.fileurl = data.musicInfo.musicSrc
    //
    // });
  },
  mounted() {
    this.fetch()
  },
  methods: {
    fetch() {
      let that = this
      var myVid = this.$refs.audioRef
      // 单曲循环
      myVid.loop = this.loop
      // 监听音频播放完毕
      myVid.addEventListener(
        'ended',
        function () {
          that.audioStatus = 'play' // 显示播放icon
          document.getElementById('progressBar').style.width = '0%' // 进度条初始化
        },
        false
      )
      if (myVid != null) {
        myVid.oncanplay = function () {
          that.duration = that.transTime(myVid.duration) // 计算音频时长
        }
        myVid.volume = 0.5 // 设置音量50%
      }
    },
    // 播放暂停控制
    playAudio() {
      let recordAudio = this.$refs.audioRef // 获取audio元素
      if (recordAudio.paused) {
        recordAudio.play()
        this.audioStatus = 'pause'
      } else {
        recordAudio.pause()
        this.audioStatus = 'play'
      }
    },
    // 更新进度条与当前播放时间
    updateProgress(e) {
      var value = e.target.currentTime / e.target.duration
      if (document.getElementById('progressBar')) {
        document.getElementById('progressBar').style.width = value * 100 + '%'
        if (e.target.currentTime === e.target.duration) {
          this.audioStatus = 'pause'
        }
      } else {
        this.audioStatus = 'pause'
      }

      this.audioStart = this.transTime(this.$refs.audioRef.currentTime)
    },
    /**
     * 音频播放时间换算
     * @param {number} value - 音频当前播放时间，单位秒
     */
    transTime(time) {
      var duration = parseInt(time)
      var minute = parseInt(duration / 60)
      var sec = (duration % 60) + ''
      var isM0 = ':'
      if (minute === 0) {
        minute = '00'
      } else if (minute < 10) {
        minute = '0' + minute
      }
      if (sec.length === 1) {
        sec = '0' + sec
      }
      return minute + isM0 + sec
    },
    setAudioIcon() {
      this.audioStatus = 'pause'
    },
    handleShowMuteIcon(val) {
      this.audioVolume = val
    }
  }
}
</script>

<style lang="scss" scoped>
.volume {
  position: relative;
  .volume-progress {
    position: absolute;
    top: -150px;
    width: 32px;
    height: 140px;
    //background: #f6f6f6;
    border-radius: 4px;
    padding-top: 10px;
  }
  .volume-bar-bg {
    margin: 0 auto;
    width: 6px;
    height: 120px;
    background: #dcdcdc;
    border-radius: 100px;
    flex: 1;
    position: relative;
    transform: rotate(180deg);
    cursor: pointer;
    .volume-bar {
      width: 6px;
      height: 50%;
      background: #56bf8b;
      border-radius: 100px;
    }
  }
  .checked {
    color: #56bf8b;
  }
}
.audio-right {
  width: 80%;
  height: 75px;
  line-height: 75px;
  //background: #f6f6f6;
  border-radius: 6px;
  display: flex;
  padding: 0 15px;
  user-select: none;
  .dialogAudioPlay {
    cursor: pointer;
    //color: #5c5e66;
    font-size: 20px;
  }
  .progress-bar-bg {
    background-color: #dcdcdc;
    flex: 1;
    position: relative;
    height: 10px;
    top: 50%;
    transform: translateY(-50%);
    margin-top: -1px;
    cursor: pointer;
    margin: 0 10px;
  }
  .progress-bar {
    background-color: #56bf8b;
    width: 0%;
    height: 10px;
    border-radius: 5px;
  }

  .audio-time {
    overflow: hidden;
    font-size: 14px;
    margin-left: 10px;
    margin-right: 10px;

    .audio-length-total {
      float: right;
    }
    .audio-length-current {
      float: left;
    }
  }
}
</style>
