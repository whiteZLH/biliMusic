<script setup lang="js">
import { onMounted, onUnmounted, reactive } from 'vue'
import ListTabs from '../components/ListTabs.vue'
import { CollectVideoListBus } from '../Events'

const collectChange = async (collect_id) => {
  console.log('ListView')
  console.log('collect_id', collect_id)

  // 获得收藏夹数据，是否同步过，优先使用本地数据

  let collectInfoJson = await window.electronAPI.getCollectListMetadata(collect_id)

  let collectInfo = JSON.parse(collectInfoJson)
  while (videos.length) {
    videos.pop()
  }
  if (collectInfo.sync) {
    let filter = {
      page_size: 20,
      page_num: 1,
      collect_id: collect_id
    }
    let resultJson = await window.electronAPI.queryCollectVideosList(JSON.stringify(filter))

    let { list, total } = JSON.parse(resultJson)

    videos.push(...(list ?? []))
  } else {
    //1. 请求bili，获得数据

    let filter = {
      bili_collect_id: collectInfo.bili_collect_id,
      page_size: 20,
      page_num: 1
    }
    let videosBiliJson = await window.electronAPI.getCollectVideoListFromBili(
      JSON.stringify(filter)
    )
    //2. 持久化到数据库中
    let videosBili = JSON.parse(videosBiliJson)

    var videosBiliDb = videosBili.map((x) => {
      return {
        id: crypto.randomUUID(),
        ...x
      }
    })

    console.log(JSON.stringify(videosBiliDb))

    await window.electronAPI.saveCollectVideos(JSON.stringify(videosBiliDb))
    // 更改当前的设置为同步

    let sync = { collect_id, sync: videosBiliDb?.length ?? 0 }
    await window.electronAPI.setCollectSync(JSON.stringify(sync))
    videos.push(...(videosBiliDb ?? []))
  }
}

let videos = reactive([])

onMounted(() => {
  CollectVideoListBus.on('collect-change', collectChange)
})
onUnmounted(() => {
  CollectVideoListBus.off('collect-change', collectChange)
})

const playMusic = (record) => {
  console.log(record)
}
</script>

<script></script>

<template>
  <div class="list-view">
    <div class="list-content">
      <div class="tabs-layout">
        <list-tabs />
      </div>
      <div class="music-list-wrapper">
        <div class="music-list">
          <a-table
            :data="videos"
            row-key="id"
            :pagination="false"
            :scroll="{ maxHeight: '500' }"
            @row-dblclick="playMusic"
          >
            <template #columns>
              <a-table-column title="标题" data-index="name"></a-table-column>
              <a-table-column title="操作">
                <template #cell="{ record }">
                  <a-button
                    :style="{ backgroundColor: 'transparent' }"
                    @click="$modal.info({ title: 'Name', content: record.name })"
                  >
                    <icon-play-circle-fill type="text"
                  /></a-button>
                </template>
              </a-table-column>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-view {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;

  .list-header {
    display: flex;
    height: 30px;
  }

  .list-content {
    display: flex;
    flex-direction: row;
  }

  .tabs-layout {
    flex: 1;
    //box-sizing: content-box;
    width: 105px;
    height: 98%;
  }

  .music-list-wrapper {
    flex: 11;
    height: 98%;
    width: 100%;

    .music-list {
      width: 100%;
      height: 100%;
      :deep(.arco-table-tr-empty .arco-table-cell) {
        height: 700px;
      }
    }
  }
}
</style>
