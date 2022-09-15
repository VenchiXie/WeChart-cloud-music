// import PubSub from 'pubsub-js'

// pages/recommendSong/recommendSong.js
import request from '../../utils/request'

// let startY = 0;
// let moveY = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recommendList: [],
    day: '',
    month: '',
    isScroll: false,
    // 图片高斯模糊度
    num: 0,
    // 当前机型的状态栏高度
    barHeight: 0,
    // isBottom: false,
    // 点击音乐的下标
    index: 0,
    // 当前播放歌曲的歌单
    playingMusicList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取当前机型的状态栏高度
    wx.getSystemInfo({
      success: e => {
        // t.barheight = e.statusBarHeight; //状态栏高
        // console.log(e.statusBarHeight);
        this.setData({
          barHeight: e.statusBarHeight
        })
      }
    })

    // 判断用户是否登录
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success: () => {
          // 跳转至登录界面
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
      return;
    }
    this.getRecommendList();

  },

  // 请求每日推荐列表
  async getRecommendList() {
    let result = await request('/recommend/songs')
    this.setData({
      recommendList: result.data.dailySongs
    })
  },

  // 跳转至点击歌曲的详情页面
  async toSongDetail(event) {
    // 暂停播放音乐，提升用户体验
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    let { song } = event.currentTarget.dataset;

    wx.setStorageSync('playingMusicList', this.data.recommendList);

    wx.navigateTo({
      url: '/pages/songDetail/songDetail?song=' + JSON.stringify(song)
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1,

    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },



  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  handleTouchEnd(e) {
    // startY = e.touches[0].clientY
    // console.log(e);
    if (e.changedTouches[0].pageY - e.changedTouches[0].clientY <= 50) {
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 500
      })
      this.setData({
        isScroll: false
      })
    } else {
      wx.pageScrollTo({
        scrollTop: 99999,
        duration: 500
      })
      this.setData({
        isScroll: true
      })
    }

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})