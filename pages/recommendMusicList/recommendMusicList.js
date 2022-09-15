// pages/recommentMusicList.js
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 推荐歌单数据
    recommendMusicList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.getRecommendMusicList()
  },

  // 请求每日推荐歌单数据
  async getRecommendMusicList() {
    // 判断是否登录
    let res = await request('/recommend/resource');
    // console.log(res);
    this.setData({
      recommendMusicList: res.recommend,
    })
  },

  // 跳转至歌单详情页面
  toMusicList(e) {
    wx.navigateTo({
      url: '/pages/musicList/musicList?musiclistid=' + e.detail.currentTarget.dataset.musiclistid,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})