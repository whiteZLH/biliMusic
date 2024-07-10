<script setup>
import { onMounted, reactive, ref } from 'vue'
// 结构: timeArr.push({ time: time, line: lyrics })
const props = defineProps({
  lyricsArr: Array,
  musicProgress: Number
})
const lyricsContentRef = ref(null)
// 暂时的歌词改变
// TODO 加入歌词纠错，由用户自己进行
const lyricsInfo = reactive({
  lyricsArr: []
})
// 实现当前
// const

const getActiveLyrics = () => {
  // 获得scrollY 进行计算
  let index = Number.parseInt(lyricsContentRef.value.scrollTop / 40)
  if (index >= props.lyricsArr.length) index = props.lyricsArr.length - 1
  console.log(index, props.lyricsArr[index])
  console.log(props.musicProgress)
}
// 获得当前歌曲的播放时间
// 使用事件机制
const getMusicProgress = () => {
}
// 进行歌词匹配事件注册
onMounted(() => {})
</script>
<template>
  <div class="lyrics-time-align">
    <div class="lyrics-time-align-title">
      注意: 本功能依托于歌词和歌曲的匹配度，如不匹配，请选择与歌曲匹配的歌词
      <br />
      请根据当前的歌词来实现进行歌词进度匹配 下面是当前的歌词请在下面点击开始匹配进行匹配
      <br />
      可以滑动歌词进行歌词的选择，点击开始之后使用空格对当前的歌词进行时间匹配
    </div>
    <div class="operator-button">
      <div class="start-button button">
        <a-button type="primary" @click="getActiveLyrics">开始匹配</a-button>
      </div>
    </div>
    <div class="lyrics-show">
      <div ref="lyricsContentRef" class="lyrics-show-content">
        <div class="active-line"></div>
        <p v-for="item in props.lyricsArr" :key="item" class="lyrics-line">{{ item.line }}</p>
        <!--        滚动到中间-->
      </div>
    </div>
  </div>
</template>
<style scoped>
.lyrics-time-align {
  .lyrics-time-align-title {
    text-align: center;
  }
  .operator-button {
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: space-around;
  }
  .button {
    padding: 10px 10px;
  }
  .lyrics-show {
    .lyrics-show-content {
      height: 500px;
      overflow-y: scroll;
      text-align: center;
      padding-bottom: 500px;
      padding-top: 10px;
      box-sizing: border-box;
      /* 使用吸附点优化, 将相近的地方变为选中状态 */
      scroll-snap-type: y proximity;
      .lyrics-line {
        scroll-snap-align: start;
        scroll-snap-stop: always;
        margin: 0;
        padding: 0;
        height: 40px;
        line-height: 40px;
      }
      .active-line {
        position: absolute;
        top: 117px;
        height: 40px;
        width: calc(100% - 20px);
        background-color: rgba(0, 174, 236, 0.3);
      }
    }
  }
}
</style>
