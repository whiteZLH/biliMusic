<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { Close, Lock, Pushpin, Pin } from '@icon-park/vue-next'

let moveIng = false
let startX = 0
let startY = 0
let width = 0
let height = 0
const currentLineLyrics = ref('')
const pined = ref(false)
const winActive = ref(true)
const lyricsWindow = ref(null)
const startMove = (e) => {
  if (e.target.className !== 'lyrics-body-drag') return
  console.log(window)
  moveIng = true
  startX = e.x
  startY = e.y
  width = window.outerWidth
  height = window.outerHeight
}
const endMove = (e) => {
  if (!moveIng) return
  moveIng = false
  if (e.target.className !== 'lyrics-body-drag') return
  console.log(e)
}
const moveWindow = (e) => {
  if (!moveIng) return
  console.log(e.screenX)
  const x = e.screenX - startX
  const y = e.screenY - startY
  window.electronAPI.move(x, y, width, height)
}
const closeWindow = () => {
  // LyricsWindowBus.emit('LyricsWindowClose')
  window.opener.postMessage('windowClose')
}
const lockWindow = () => {
  // TODO 在播放栏中实现解锁歌词 ,使用childWinodow.postMessage
  // 1.使背景透明
  lyricsWindow.value.style.backgroundColor = 'rgba(0,0,0,0)'
  // 2.停止hover
  winActive.value = false
  // 3.点击穿透
  window.electronAPI.IgnoreMouseEvents()
}
const updateLyricsLine = (e) => {
  currentLineLyrics.value = e.data
  console.log(e)
}
const handleLyricsAlwaysTop = () => {
  pined.value = !pined.value
  window.electronAPI.alwaysTop(pined.value)
}
onMounted(() => {
  window.addEventListener('mousedown', startMove)
  window.addEventListener('mousemove', moveWindow)
  window.addEventListener('mouseup', endMove)
  // 歌词更新
  window.addEventListener('message', updateLyricsLine)
})
onUnmounted(() => {
  window.removeEventListener('mousedown', startMove)
  window.removeEventListener('mousemove', moveWindow)
  window.removeEventListener('mouseup', endMove)
  // 歌词更新
  window.removeEventListener('message', updateLyricsLine)
})
</script>

<template>
  <div class="lyrics-window" :class="winActive ? 'active' : ''"  ref="lyricsWindow">
    <div class="lyrics-header">
      <div class="lyrics-header-options">
        <close
          class="lyrics-header-options-button"
          title="关闭"
          theme="two-tone"
          size="20"
          :fill="['white', '']"
          stroke-linejoin="miter"
          stroke-linecap="square"
          @click="closeWindow"
        />
        <lock
          class="lyrics-header-options-button"
          theme="two-tone"
          title="锁定"
          size="20"
          :fill="['white', '']"
          stroke-linejoin="miter"
          stroke-linecap="square"
          @click="lockWindow"
        />
        <pushpin
          v-if="!pined"
          class="lyrics-header-options-button"
          theme="two-tone"
          title="置顶"
          size="24"
          :fill="['white', '']"
          stroke-linejoin="miter"
          stroke-linecap="square"
          @click="handleLyricsAlwaysTop"
        />
        <pin
          v-if="pined"
          class="lyrics-header-options-button"
          title="取消置顶"
          theme="two-tone"
          size="24"
          :fill="['white', '']"
          stroke-linejoin="miter"
          stroke-linecap="square"
          @click="handleLyricsAlwaysTop"
        />
      </div>
    </div>
    <div class="lyrics-body">
      <div class="lyrics-body-drag">
        <div class="lyrics-body-container">
          <div class="lyrics-box">
            {{ currentLineLyrics }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lyrics-window {
  width: 100%;
  height: 100%;
  user-select: none;
  min-height: 40px;
  background: rgba(0, 0, 0, 0.3);
  .lyrics-header {
    position: absolute;
    display: none;
    width: 100%;
    height: 40px;
    background: rgba(0, 0, 0, 0.3);
    .lyrics-header-options {
      width: 100%;
      height: 40px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-around;
      align-content: center;
      .lyrics-header-options-button {
        cursor: pointer;
      }
    }
  }
  .lyrics-body {
    width: 100%;
    height: 100%;
    color: white;
    .lyrics-body-drag {
      height: 100%;
      box-sizing: border-box;
      cursor: move;
      padding: 0 20px 20px;
      //background: red;
      justify-content: center;
      .lyrics-body-container {
        height: 100%;
        cursor: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-content: center;
        overflow: hidden;
        .lyrics-box {
          width: 100%;
          word-wrap: break-word;
          word-break: normal;
        }
      }
    }
  }
}
.lyrics-window:hover.active {
  .lyrics-header {
    display: block;
  }
}
</style>
