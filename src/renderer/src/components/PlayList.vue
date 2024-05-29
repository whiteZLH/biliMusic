<script setup>
import { onBeforeUpdate, onUpdated, reactive, ref, watch } from 'vue'

let className = ref('')

defineExpose({
  className
})
const props = defineProps({
  height: Number,
  width: Number,
  data: Object
})
let itemRefs = []
const setItemRef = (el) => {
  if (!el) return
  console.log(el)
  itemRefs.push(el)
}

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
  console.log(itemRefs, '====')
  for (let itemRef of itemRefs) {
    const textNode = itemRef.children[0].children[0]
    const width = textNode.clientWidth
    // 需要是当前播放列表的宽度
    if (width > 200 && !updateStatus[textNode.innerText]) {
      console.log(textNode.innerText)
      textNode.innerText += ' ' + textNode.innerText
      updateStatus[textNode.innerText] = true
      textNode.classList.add('need-scroll')
      console.log(textNode.classList)
    }
  }
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
          <div class="play-list-item-text">
            {{ item.title }}
          </div>
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
      width: 100%;
      .play-list-item-wrapper {
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
