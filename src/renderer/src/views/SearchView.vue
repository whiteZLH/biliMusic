<script setup>
import { onBeforeMount, onBeforeUnmount, reactive, ref } from 'vue'
import { PlayerBus, SearchBus } from '../Events'
const onSearch = (result) => {
  for (const videos of result.data.result) {
    if (videos.result_type === 'video') {
      data.videos = videos.data
    }
  }
  total.value = result.data.numResults
}
const changePage = (current) => {
  SearchBus.emit('pageChanged', current)
}
onBeforeMount(() => {
  SearchBus.on('search', onSearch)
})
onBeforeUnmount(() => {
  SearchBus.off('search', onSearch)
})

const changeMusic = (bvid, pic, title) => {
  window.electronAPI
    .getVideoInfo(bvid)
    .then((videoInfo) => {
      const videoInfoObj = JSON.parse(videoInfo)
      const musicUrl = videoInfoObj.dash.audio[0].baseUrl
      // 将这个包装为Player 的接收对象
      // console.log(videoInfoObj.lyrics)
      const musicInfo = {
        musicSrc: musicUrl,
        // TODO 此后要会有 备用链接和图片等信息
        // 图片
        picUrl: pic,
        musicTitle: title,
        plaintMusicTitle: videoInfoObj.plaintTitle,
        cid: videoInfoObj.cid,
        musicName: videoInfoObj.musicName,
        musicOriginArtist: videoInfoObj.musicOriginArtist,
        musicLyrics: videoInfoObj.lyrics,
        allPages: videoInfoObj.allPages
      }
      PlayerBus.emit('musicChange', musicInfo)
    })
    .catch((err) => {
      console.log(err)
      console.log(123)
    })
}

const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const mouth = date.getMonth() + 1
  const day = date.getDate()
  if (year === new Date().getFullYear()) {
    return '' + mouth + '-' + day
  } else if (year === 1970) {
    return '这个视频有误'
  }
  return year + '-' + mouth + '-' + day
}

const data = reactive({})
const total = ref(0)
</script>
<template>
  <div class="search-view">
    <div class="search-head"></div>
    <div class="cards">
      <div v-for="(video, index) in data.videos" :key="index" class="card">
        <div class="card-cover">
          <a-image
            :width="240"
            :height="140"
            :src="video.pic"
            :show-loader="true"
            :preview="false"
          ></a-image>
        </div>
        <div class="card-title" @dblclick="changeMusic(video.bvid, video.pic, video.title)">
          <div v-html="video.title"></div>
        </div>
        <div class="card-footer">
          <div class="up-icon"></div>
          <div class="author card-footer-text">{{ video.author }}</div>
          <div class="date card-footer-text">&nbsp;· {{ formatDate(video.pubdate * 1000) }}</div>
        </div>
      </div>
    </div>

    <a-pagination class="pages" :total="total" :page-size="30" @change="changePage" />
  </div>
</template>

<style scoped lang="scss">
.search-view {
  position: relative;
  height: 100%;
  width: 99%;
  font-family: 'Microsoft YaHei UI', serif;
  font-weight: 900;
  font-size: 15px;
  line-height: 22px;
  padding-right: 5px;
  .search-head {
    height: 6%;
    width: 100%;
    //background: #0077aa;
  }
  .cards::-webkit-scrollbar {
    padding-right: 10px;
    width: 8px;
  }
  .cards::-webkit-scrollbar-thumb {
    background: rgba(165, 166, 167, 0.5);
    border-radius: 20px;
  }
  .cards::-webkit-scrollbar-thumb:hover {
    background: rgba(165, 166, 167);
  }
  .cards {
    height: 85%;
    overflow-y: scroll;
    .card {
      box-sizing: border-box;
      height: 34%;
      width: 20%;
      float: left;
      //border: solid black 1px;
      //background: #990055;
      .arco-image {
        border-radius: 5px;
      }
      .card-title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 44px;
        padding-top: 8px;
        padding-left: 20px;
        padding-right: 16px;
        text-align: left;
        cursor: pointer;
        :deep(.keyword) {
          font-style: normal;
          color: #f25d8e;
        }
      }
      .card-title :hover {
        color: #00aeec;
      }
      .card-footer {
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        height: 20px;
        //width: 300px;
        //padding-top: 5px;
        padding-left: 20px;
        cursor: pointer;
        .up-icon {
          height: 12px;
          width: 16px;
          background-image: url('../assets/img/up.png');
          background-size: 100% 100%;
        }
        .author {
          padding-left: 10px;
        }
        .card-footer-text {
          line-height: 12px;
          font-size: 12px;
          font-weight: 400;
          color: #9499a0;
        }
      }
      .card-footer:hover {
        .up-icon {
          background-image: url('../assets/img/up_blue.png');
        }
        .card-footer-text {
          color: #00aeec;
        }
      }
    }
  }
  .pages {
    position: absolute;
    bottom: 3%;
    right: 30px;
  }
}
</style>
