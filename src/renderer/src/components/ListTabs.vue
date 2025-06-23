<script setup>
import { ref, reactive } from 'vue'
import { CollectVideoListBus } from '../Events'
const props = defineProps({
  online: Array,
  history: Array,
  like: Array
})

// const listMap = reactive({
//   history: [],
//   like: []
// })
const collectListSavedDbList = reactive([])

// 初始化收藏列表
async function collectListSavedDbListRefresh() {
  let collectListSavedDbJson = await window.electronAPI.queryCollectListSavedMetadata()
  collectListSavedDbList.push(...(JSON.parse(collectListSavedDbJson) ?? []))
  console.log(collectListSavedDbList)
}

collectListSavedDbListRefresh()
// // 进行初始化
// collectListSavedDbListRefresh().then(() => {
//   // ✅ 初始化后操作
//   console.log('现在可以处理 collectListSavedDbList:', collectListSavedDbList)

//   collectListSavedDbList.forEach((item) => {
//     let id = item.id
//     // 查询数据库中已经保存的该收藏夹下的视频
//     // 如果没有查到则为空数组

//     let filter = {
//       page_size: 20,
//       page_num: 1,
//       collect_id: item.id
//     }
//     window.electronAPI
//       .queryCollectVideosList(filter)
//       .then((x) => {
//         listMap[id] = x.list
//       })
//       .catch((e) => {
//         listMap[id] = []
//         console.log('queryCollectVideosList', JSON.stringify(filter), e)
//       })
//     //
//   })

//   console.log('listMap:', listMap)
// })

//TODO：从数据库中获得历史记录和喜欢的列表  我喜欢支持登录 b 站账号后，创建我喜欢收藏夹进行同步

const addPanelForm = reactive({
  mid: ''
})

const collectOption = (id) => {
  console.log(collectList)
  // check the checkbox
  let collectCheck = collectList.filter((item) => item.id === id)[0]
  collectCheck.check = !collectCheck.check
  console.log(id)
}

// 收藏列表
const collectList = reactive([])
const handleCancel = () => {
  addPanelVisible.value = false
}
const addPanelVisible = ref(false)

const openListAddPanel = () => {
  console.log(1)
  addPanelVisible.value = true
}
const closeListAddPanel = () => {
  addPanelVisible.value = false
}

const searchPersonCollect = async () => {
  // 搜索用户的收藏列表
  console.log(addPanelForm.mid)
  let collectJson = await window.electronAPI.searchPersonCollect(addPanelForm.mid)
  let collect = JSON.parse(collectJson)
  console.log(collectList)
  while (collectList.length) {
    collectList.pop()
  }

  // collectList.splice(0, collectList.length)
  collectList.push(...(collect ?? []))
  // TODO：check 需要和本地已经保存的进行对比，check 是当前是否选中， save 是是否已经保存，初始化时，二者一致
  collectList.forEach((item) => {
    console.log('==========')

    console.log(item)

    item.check = collectListSavedDbList.some((savedItem) => savedItem.video_id == item.id)
    item.save = item.check // 初始化时，二者一致
  })
  console.log(collectList)
  console.log(collectList.values)
}

const handleBeforeOk = async () => {
  // 拿到选中但是本地没有存储的收藏夹
  let collectChecked = collectList.filter((item) => item.check === true && item.save === false)
  if (collectChecked.length === 0) {
    return
  }
  // 持久化到数据库
  let collectCheckedDb = collectChecked.map((item) => {
    // TODO： 实现custom_name 的功能
    return {
      id: crypto.randomUUID(),
      title: item.title,
      cover: item?.detail?.cover,
      bili_collect_id: item.id,
      play_num: item?.detail?.cnt_info?.play,
      up_name: item?.detail?.upper?.name,
      up_mid: item?.detail?.upper?.mid,
      media_count: item?.detail?.media_count,
      custom_name: item.title
    }
  })
  console.log(collectChecked)
  let collectCheckedDbJSON = JSON.stringify(collectCheckedDb)
  await window.electronAPI.saveCollectListMetadata(collectCheckedDbJSON)
  await collectListSavedDbListRefresh()
}

const changeCollect = (collect_id) => {
  CollectVideoListBus.emit('collect-change', collect_id)
}
</script>

<template>
  <div class="list-tabs">
    <div class="tabs-wrapper">
      <!--       事件机制通知父组件进行改变当前的播放列表展示-->
      <div class="tab" @click="changeCollect('history')">
        <span>当前播放</span>
      </div>
      <div class="tab" @click="changeCollect('like')">
        <span>历史记录</span>
      </div>

      <div v-for="item in collectListSavedDbList" :key="item.id" class="tab" @click="changeCollect(item.id)">
        <span>{{ item.title }}</span>
      </div>
      <div class="tab" @click="openListAddPanel">
        <span> <icon-plus /> </span>
      </div>

      <div class="add-panel">
        <a-modal v-model:visible="addPanelVisible" title="收藏夹选择" :render-to-body="false" @cancel="closeListAddPanel"
          @before-ok="handleBeforeOk">
          <a-form :model="addPanelForm">
            <a-form-item label="mid" class="add-panel-mid">
              <a-input v-model="addPanelForm.mid" placeholder="请输入用户 mid" />
              <a-button type="primary" @click="searchPersonCollect">搜索</a-button>
            </a-form-item>
          </a-form>

          <div class="collect-list-wrapper">
            <div v-if="collectList.length == 0" class="collect-list-empty">List is empty</div>
            <div v-else class="collect-list-has">
              <a-list :max-height="400" :style="{ width: `400px` }">
                <a-list-item v-for="item in collectList" :key="item.id">
                  <a-list-item-meta :title="item.title"
                    :description="`视频数：${item?.detail?.media_count} | 播放量：${item?.detail?.cnt_info?.play}`">
                    <template #avatar>
                      <a-avatar shape="square">
                        <img alt="avatar" :src="item?.detail?.cover || item?.detail?.upper?.face" />
                      </a-avatar>
                    </template>
                  </a-list-item-meta>
                  <template #actions>
                    <a-checkbox :model-value="item.check" @change="collectOption(item.id)" />
                  </template>
                </a-list-item>
              </a-list>
            </div>
          </div>
        </a-modal>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-tabs {
  height: 100%;

  .tabs-wrapper {
    height: 100%;
    overflow-y: scroll;

    .tab {
      display: flex;
      width: 100px;
      height: 40px;
      //background-color: red;
      text-align: center;
      line-height: 40px;

      span {
        width: 100px;
        height: 40px;
      }
    }

    .tab:hover {
      background-color: rgba(0, 174, 236, 0.3);
      cursor: pointer;
    }

    .add-panel {
      .add-panel-mid {
        display: flex;
        flex-direction: row;

        // gap: 10px;
        :deep(.arco-form-item-content) {
          gap: 10px;
        }
      }
    }

    .collect-list-wrapper {
      display: flex;
      flex-direction: column;
      /* 水平居中 */
      align-items: center;
      height: 400px;

      .collect-list-empty {
        display: flex;
        height: 400px;
        // 垂直居中
        align-items: center;
      }

      .collect-list-has {
        display: flex;
        height: 400px;
        flex-direction: column;
        // 垂直居中
        align-items: center;
      }
    }
  }

  .tabs-wrapper::-webkit-scrollbar {
    padding-right: 10px;
    width: 5px;
  }

  .tabs-wrapper::-webkit-scrollbar-thumb {
    background: rgba(165, 166, 167, 0.5);
    border-radius: 20px;
  }

  .tabs-wrapper::-webkit-scrollbar-thumb:hover {
    background: rgba(165, 166, 167);
  }
}
</style>
