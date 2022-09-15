// pages/comment/comment.js

Page({

  /**
   * 页面的初始数据
   */
  data: {

    musicId: '', // 当前评论页面的音乐id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData({
      musicId: options.musicid,
    })
  },
})