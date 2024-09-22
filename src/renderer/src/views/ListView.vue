<script setup>
import { reactive } from 'vue'
import ListTabs from '../components/ListTabs.vue'

const rowSelection = reactive({
  type: 'checkbox',
  showCheckedAll: true
})

const columns = [
  {
    title: '歌曲标题',
    dataIndex: 'name'
  },
  {
    title: '发布作者',
    dataIndex: 'salary'
  }
]
let data = reactive([
  {
    key: '1',
    name: 'Jane Doe',
    salary: 23000,
    address: '32 Park Road, London',
    email: 'jane.doe@example.com'
  },
  {
    key: '2',
    name: 'Alisa Ross',
    salary: 25000,
    address: '35 Park Road, London',
    email: 'alisa.ross@example.com'
  },
  {
    key: '3',
    name: 'Kevin Sandra',
    salary: 22000,
    address: '31 Park Road, London',
    email: 'kevin.sandra@example.com'
  },
  {
    key: '4',
    name: 'Ed Hellen',
    salary: 17000,
    address: '42 Park Road, London',
    email: 'ed.hellen@example.com'
  },
  {
    key: '5',
    name: 'William Smith',
    salary: 27000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com'
  },
  {
    key: '6',
    name: 'Jane Doe 2',
    salary: 15000,
    address: '32 Park Road, London',
    email: 'jane.doe@example.com'
  },
  {
    key: '7',
    name: 'Alisa Ross 2',
    salary: 28000,
    address: '35 Park Road, London',
    email: 'alisa.ross@example.com'
  },
  {
    key: '8',
    name: 'Kevin Sandra 2',
    salary: 26000,
    address: '31 Park Road, London',
    email: 'kevin.sandra@example.com'
  },
  {
    key: '9',
    name: 'Ed Hellen 2',
    salary: 18000,
    address: '42 Park Road, London',
    email: 'ed.hellen@example.com'
  },
  {
    key: '10',
    name: 'William Smith 2',
    salary: 12000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com'
  },
  {
    key: '11',
    name: 'William Smith 2',
    salary: 12000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com'
  },
  {
    key: '12',
    name: 'William Smith 2',
    salary: 12000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com'
  },
  {
    key: '13',
    name: 'William Smith 2',
    salary: 12000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com'
  },
  {
    key: '14',
    name: 'William Smith 2',
    salary: 12000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com'
  },
  {
    key: '15',
    name: 'William Smith 2',
    salary: 12000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com'
  },
  {
    key: '16',
    name: 'William Smith 2',
    salary: 12000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com'
  },
  {
    key: '17',
    name: 'William Smith 2',
    salary: 12000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com'
  },
  {
    key: '18',
    name: 'William Smith 2',
    salary: 12000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com'
  },
  {
    key: '19',
    name: 'William Smith 2',
    salary: 12000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com'
  },
  {
    key: '20',
    name: 'William Smith 2',
    salary: 12000,
    address: '62 Park Road, London',
    email: 'william.smith@example.com'
  }
])

const playMusic = (record) => {
  console.log(record)
}
</script>

<template>
  <div class="list-view">
    <div class="tabs-layout">
      <list-tabs />
    </div>
    <div class="music-list-wrapper">
      <div class="music-list">
        <a-table
          :columns="columns"
          :data="data"
          :row-selection="rowSelection"
          :pagination="false"
          :scroll="{ maxHeight: '100%' }"
          @row-dblclick="playMusic"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.list-view {
  width: 100%;
  display: flex;
  flex-direction: row;
  height: 100%;
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
    //background-color: red;
    .music-list {
      width: 100%;
      height: 100%;
      .arco-table {
        height: 100%;
        background-color: rgba(0,0,0,0);
      }
    }
  }
}
</style>
