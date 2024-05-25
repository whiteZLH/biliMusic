import mitt from 'mitt'
// 大家根据各自业务需求自行封装对应风格的事件总线模块；
export const PlayerBus = new mitt()

// 创建多个事件总线，互不干扰。
export const SearchBus = new mitt()
