<script setup>
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import { MusicProgressBus, MusicTimeAlignBus } from '../../Events'
// 结构: timeArr.push({ time: time, line: lyrics })
const props = defineProps({
  lyricsArr: Array,
  musicProgress: Number
})
let alreadyStart = false
const lyricsTimeAlign = ref(null)
const lyricsContentRef = ref(null)
// 暂时的歌词改变
// TODO 加入歌词纠错，由用户自己进行
const lyricsInfo = reactive({
  lyricsArr: []
})
// 显示当前匹配状态
// 获得当前选中的歌词
const getActiveLyrics = () => {
  // 获得scrollY 进行计算
  let index = Number.parseInt(lyricsContentRef.value.scrollTop / 40)
  if (index >= props.lyricsArr.length) index = props.lyricsArr.length - 1
  // 获得该歌词对应的时间，使用的是原始歌词的时间
  // {time: 0, line: '我记得 - 赵雷'}
  return props.lyricsArr[index]
}
// 获得当前歌曲的播放时间
// 使用事件机制
const getMusicProgress = () => {
  // 如何获得? 使用props 进行传递
  return props.musicProgress
}
// 开始匹配
const startMatching = () => {
  if (alreadyStart) return
  alreadyStart = true
  // 为注册监听事件
  window.addEventListener('keydown', compareTime)
}
const compareTime = (e) => {
  // 如果是回车键
  console.log(e.code)
  if (e.code.toLowerCase() !== 'Enter'.toLowerCase() || !alreadyStart) return
  stopMatching()
  // 当前的歌词进度
  const rightProgress = getMusicProgress() * 1000
  // console.log('rightProgress',rightProgress)
  const currentProgress = getActiveLyrics().time
  // console.log('getActiveLyrics',getActiveLyrics().time)
  // 获得进度的差值 使用当前的减去正确的
  let result = currentProgress - rightProgress
  result = parseInt(result)
  // 暂停 改变歌词 改变歌词的展示 对歌词进行更改 播放，
  // 进行事件通知
  MusicProgressBus.emit('lyricsAlignMatch', result)
}
const stopMatching = () => {
  console.log('================')
  alreadyStart = false
}
// 进行歌词匹配事件注册
onMounted(() => {
  MusicTimeAlignBus.on('close', stopMatching)
})
onUnmounted(() => {
  MusicTimeAlignBus.off('close', stopMatching)
})
</script>
<template>
  <div ref="lyricsTimeAlign" class="lyrics-time-align">
    <div class="lyrics-time-align-title">
      注意: 本功能依托于歌词和歌曲的匹配度，如不匹配，请选择与歌曲匹配的歌词
      <br />
      请根据当前的歌词来实现进行歌词进度匹配 下面是当前的歌词请在下面点击开始匹配进行匹配
      <br />
      可以滑动歌词进行歌词的选择，点击开始之后使用回车对当前的歌词进行时间匹配
    </div>
    <div class="operator-button">
      <div class="start-button button">
        <a-button type="primary" @click="startMatching">开始匹配</a-button>
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
