import request from '../../utils/request'

// pages/videoPlayer/videoPlayer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 视频信息
    videoInfo: {},
    // 视频url
    videoUrl: '',
    // 视频类型 0为mv 1为video
    videoType: 0,
    // 当前评论页数
    commentPage: 1,
    // 视频评论
    videoComment: [],
    // 是否存在更多评论
    isMore: false,
    // 视频id videoInfo获取有一定延迟 这里另外再存一份id用于获取评论
    videoId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.videovid);
    // console.log(options.videotype);
    // let videoInfo = wx.getStorageSync('videoinfo');
    this.setData({
      videoType: options.videotype,
      videoId: options.videovid
    })

    this.getVideoUrl(options.videovid, options.videotype)
    this.getVideoInfo(options.videovid, options.videotype)
  },

  // 根据获得的videoId查询video的url
  async getVideoUrl(id, type) {
    let videoUrl;
    console.log(type);
    if (type == 1) {
      videoUrl = await request('/video/url', { id })
      this.setData({
        videoUrl: videoUrl.urls[0].url
      })
    }
    else {
      videoUrl = await request('/mv/url', { id })
      this.setData({
        videoUrl: videoUrl.data.url
      })
    }
  },

  // 获取videoInfo
  async getVideoInfo(id, type) {
    let videoInfo;
    if (type == 1) {
      videoInfo = await request('/video/detail', { id })
    }
    else {
      videoInfo = await request('/mv/detail', { mvid: id })
    }
    console.log(videoInfo);
    this.setData({
      videoInfo: videoInfo.data
    })
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
  onShareAppMessage: function ({ from }) {
    console.log(from);
    if (from === 'button') {
      return {
        title: this.data.videoInfo.title,
        imageUrl: this.data.videoInfo.coverUrl
      }
    } else if (from === 'menu') {
      return {
        title: this.data.videoInfo.title,
        imageUrl: this.data.videoInfo.coverUrl
      }
    }

  }
})