import mitt from 'mitt'
// 大家根据各自业务需求自行封装对应风格的事件总线模块；
export const PlayerBus = mitt()
// 创建多个事件总线，互不干扰。
export const SearchBus = mitt()
// 歌词窗口事件
export const LyricsWindowBus = mitt()
// 歌曲进度事件 1.调整歌曲进度时 获得歌曲当前时间
export const MusicProgressBus = mitt()
// 歌词时间调整事件
export const MusicTimeAlignBus = mitt()
// 收藏夹列表明细更新
export const CollectVideoListBus = mitt()
