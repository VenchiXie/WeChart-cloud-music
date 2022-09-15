import request from "../../utils/request"

// pages/ranking/ranking.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankingList: [[], []]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRankingList()
  },

  // 请求榜单列表
  async getRankingList() {
    let res = await request('/toplist/detail')
    // console.log(res);
    // 对榜单进行分类
    let rankingList = [[], []];
    res.list.forEach(item => {
      if (item.tracks.length != 0) {
        rankingList[0].push(item)
      } else {
        rankingList[1].push(item)
      }
    })
    this.setData({
      rankingList
    })
  },

  // 跳转至musicList
  toMusicList(e) {
    console.log(e);
    if (e.currentTarget.dataset.musiclistid) {
      wx.navigateTo({
        url: '/pages/musicList/musicList?musiclistid=' + e.currentTarget.dataset.musiclistid,
      });
    } else {
      wx.navigateTo({
        url: '/pages/musicList/musicList?musiclistid=' + e.detail.currentTarget.dataset.musiclistid,
      });
    }
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