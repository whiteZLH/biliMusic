<script setup>

import { ref, reactive } from 'vue';
const props = defineProps({
  online: Array,
  history: Array,
  like: Array
})

const addPanelForm = reactive({
  mid: '',
});

// 收藏列表
const collectList = reactive([])
const handleCancel = () => {
  visible.value = false;
}
const addPanelVisible = ref(false);

const openListAddPanel = () => {
  console.log(1);
  addPanelVisible.value = true;
}
const closeListAddPanel = () => {
  addPanelVisible.value = false;
}


const handleBeforeOk = (done) => {
  console.log(form)
  window.setTimeout(() => {
    done()
    // prevent close
    // done(false)
  }, 3000)
};
</script>

<template>
  <div class="list-tabs">
    <div class="tabs-wrapper">
      <!--       事件机制通知父组件进行改变当前的播放列表展示-->
      <div class="tab">
        <span>当前播放</span>
      </div>
      <div class="tab">
        <span>历史记录</span>
      </div>
      <div class="tab" @click="openListAddPanel">
        <span>
          <icon-plus />
        </span>
      </div>

      <div class="add-panel">
        <a-modal v-model:visible="addPanelVisible" title="Modal Form" @cancel="closeListAddPanel"
          @before-ok="handleBeforeOk" :renderToBody="false">
          <a-form :model="addPanelForm">
            <a-form-item label="mid">
              <a-input placeholder="请输入用户 mid" v-model="addPanelForm.name" />
            </a-form-item>
          </a-form>

          <div class="collect-list-wrapper">
            <div class="collect-list-empty" v-if="collectList.length == 0">
              List is empty
            </div>
            <div class="collect-list-has" v-else>
              has
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
