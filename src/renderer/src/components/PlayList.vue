<script setup>
import { onBeforeUpdate, onUpdated, reactive, ref, watch } from 'vue'

import { PlayOne } from '@icon-park/vue-next'
import { PlayerBus } from '../Events'
let className = ref('')

defineExpose({
  className
})

const changeMusic = (bvid, cid) => {
  window.electronAPI
    .getVideoInfo(bvid, cid)
    .then((videoInfo) => {
      const videoInfoObj = JSON.parse(videoInfo)
      const musicUrl = videoInfoObj.dash.audio[0].baseUrl
      // 将这个包装为Player 的接收对象
      // console.log(videoInfoObj.lyrics)
      const musicInfo = {
        musicSrc: musicUrl,
        // TODO 此后要会有 备用链接和图片等信息
        // 图片
        picUrl: videoInfoObj.pic,
        plaintMusicTitle: videoInfoObj.plaintTitle,
        cid: videoInfoObj.cid,
        musicName: videoInfoObj.musicName,
        musicOriginArtist: videoInfoObj.musicOriginArtist,
        musicLyrics: videoInfoObj.lyrics,
        allPages: videoInfoObj.allPages,
        bvid: bvid,
        qqSongId: videoInfoObj.qqSongId
      }
      PlayerBus.emit('musicChange', musicInfo)
    })
    .catch((err) => {
      console.log(err)
      console.log(123)
    })
}
const props = defineProps({
  height: Number,
  width: Number,
  data: Object
})
let itemRefs = []
const setItemRef = (el) => {
  if (!el) return
  itemRefs.push(el)
}
// 找到正在播放的位置，进行定位

onBeforeUpdate(() => {
  itemRefs = []
  for (let itemRef of itemRefs) {
    const textNode = itemRef.children[0].children[0]
    textNode.classList.remove('need-scroll')
  }
})
const style = reactive({
  height: props.height + 'px',
  width: props.width + 'px'
})

let updateStatus = []

watch(props.data, () => {
  updateStatus = []
})
onUpdated(() => {
  // // console.log(itemRefs, '====')
  // 名称自动滚动，有bug
  // for (let itemRef of itemRefs) {
  //   const textNode = itemRef.children[0].children[0]
  //   const width = textNode.clientWidth
  //   // 需要是当前播放列表的宽度
  //   if (width > 200 && !updateStatus[textNode.innerText]) {
  //     // console.log(textNode.innerText)
  //     textNode.innerText += ' ' + textNode.innerText
  //     updateStatus[textNode.innerText] = true
  //     textNode.classList.add('need-scroll')
  //   }
  // }
})
</script>
<template>
  <div class="play-list" :class="className" :style="style">
    <div class="play-list-header">
      <span>播放队列</span>
    </div>
    <div class="play-list-container">
      <div v-for="(item, index) in data" :ref="setItemRef" :key="index" class="play-list-item">
        <div class="play-list-item-wrapper">
          <div class="play-list-item-text" :title="item.title">
            {{ item.title }}
          </div>
        </div>
        <div class="play-list-item-operation">
          <play-one
            theme="multi-color"
            size="24"
            :fill="['#00AEEC', '', '#FFF', '']"
            stroke-linejoin="miter"
            stroke-linecap="square"
            @click="changeMusic(item.bvid, item.cid)"
            class="play-list-button"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.play-list {
  box-sizing: border-box;
  border: 1px solid rgb(222, 222, 222);
  padding-right: 10px;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  text-align: left;

  .play-list-header {
    height: 50px;
    padding-left: 10px;
    //background: red;
    font-size: 20px;
    line-height: 50px;
  }

  .play-list-container {
    position: relative;
    height: calc(100% - 50px);
    padding: 0 10px;
    overflow-y: scroll;

    .play-list-item {
      //float: left;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      .play-list-item-wrapper {
        display: flex;
        //align-content: center;
        align-items: center;
        //flex-direction: column;
        //justify-content: center;

        width: 200px;
        overflow: hidden;
        //width: 200px;
        .play-list-item-text {
          box-sizing: border-box;
          display: inline-block;
          white-space: nowrap;
          //border: 1px solid rgb(222, 222, 222);
          height: 50px;
          //width: auto;
          font-size: 16px;
          font-weight: 500;
          line-height: 50px;
          cursor: pointer;
          // 省略号
          //display: -webkit-box;
          //-webkit-box-orient: vertical;
          //-webkit-line-clamp: 1;
          //overflow: hidden;
          //text-overflow: ellipsis;
        }

        .need-scroll:hover {
          animation: scroll 5s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      }
      .play-list-item-operation {
        width: 100px;
        //position: absolute;
        //display: inline-block;
        //line-height: 50px;
        display: flex;
        justify-content: space-around;
        padding-left: 10px;
        .play-list-button {
          cursor: pointer;
        }
      }
    }
    .play-list-item:hover {
      color: #0086b3;
      background: #f6f6f6;
    }
  }

  .play-list-container::-webkit-scrollbar {
    padding-right: 10px;
    width: 8px;
  }
  .play-list-container::-webkit-scrollbar-thumb {
    background: rgba(165, 166, 167, 0.5);
    border-radius: 20px;
  }
  .play-list-container::-webkit-scrollbar-thumb:hover {
    background: rgba(165, 166, 167);
  }
}
</style>
