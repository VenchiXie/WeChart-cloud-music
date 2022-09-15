// components/musicListCard.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 歌单数据
    musicList: {
      type: Array,
      value: [],
    },
    // 是否还有更多
    isMore: {
      type: Boolean,
      value: false,
    },
    // 组件的margin-top
    cardMarginTop: {
      type: String,
      value: '0rpx'
    },
    // 组件的高度
    cardHeight: {
      type: String,
      value: 'calc(100vh - 110rpx)'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    reachBottom() {
      this.triggerEvent('reachBottom')
    },

    toMusicList(event) {
      // console.log(event);
      this.triggerEvent('toMusicList', event)
    }
  }
})
 