<script setup>
const props = defineProps({
  online: Array,
  history: Array,
  like: Array
})
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
      <div class="tab">
        <span>+</span>
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
      background-color: gray;
      cursor: pointer;
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
