// pages/index/index.js

import request from '../../utils/request'


let allTopList = []; // 存放所有排行榜完整数据
let currentPage = 0; // 排行榜swiper当前所处的current

Page({

  /**
   * 页面的初始数据
   */
  data: {

    bannerList: [],    // 轮播图数据
    recommendList: [], // 推荐歌单数据
    topList: [],       // 排行榜数据
    // 提供给songDetail查询歌曲列表使用
    // musicListId: '',  // 下面定义了
    // 下面是保存从songDetail获得的数据
    // 当前播放歌单id
    musicListId: '',
    isPlay: false,     // 是否播放
    isStartShow: true, // 是否显示开屏动画
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {

    wx.hideTabBar()

    let bannerListData = await request('/banner', {
      type: 1
    })
    this.setData({
      bannerList: bannerListData.banners
    })

    // 获取推荐歌单数据
    let recommmendListData = await request('/personalized')
    this.setData({
      recommendList: recommmendListData.result
    })

    // 获取排行榜列表
    let toplist = await request('/toplist')
    toplist.list.splice(5)
    toplist = toplist.list
    // 根据排行榜的id通过查询歌单查询排行榜详情
    // 查询5个排行榜，循环五次
    let index = 0
    let listItem = {};
    let topList = [];
    while (index < 5) {
      let topListData = await request('/playlist/detail', {
        id: toplist[index].id
      })
      allTopList.push(topListData.playlist.tracks)
      listItem = {
        name: topListData.playlist.name,
        id: topListData.playlist.id,
        tracks: topListData.playlist.tracks.slice(0, 3)
      }
      index++;
      topList.push(listItem)
      this.setData({
        topList,
      })
      if (this.data.isStartShow == true) {
        this.setData({
          isStartShow: false
        })
        wx.showTabBar({
          animation: true
        })
      }
    }

  },

  // 跳转至每日推荐页面
  goToRecommend() {
    wx.navigateTo({
      url: '/pages/recommendSong/recommendSong',
    });
  },

  // 跳转至点击歌曲的详情页面
  async toSongDetail(event) {
    // console.log(event);
    let {
      song
    } = event.currentTarget.dataset;
    // await this.getPlayingMusicList(musiclist)
    wx.setStorageSync('playingMusicList', allTopList[currentPage])
    wx.navigateTo({
      url: '/pages/songDetail/songDetail?song=' + JSON.stringify(song)
    })
  },


  // 跳转至音乐列表页面
  toMusicList(e) {

    wx.navigateTo({
      url: '/pages/musicList/musicList?musiclistid=' + e.currentTarget.dataset.musiclistid
    })
  },

  // 跳转至搜索页面
  toSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  // 跳转至歌单广场页面
  goToMusicListSquare() {
    wx.navigateTo({
      url: '/pages/musicListSquare/musicListSquare'
    })
  },

  // 获取排行榜当前所处的页数
  getCurrentPage(e) {
    // console.log(e);
    currentPage = e.detail.current
  },

  // 跳转至推荐歌单页面
  getMoreRecommendMusicList() {
    wx.navigateTo({
      url: '/pages/recommendMusicList/recommendMusicList'
    })
  },

  // 跳转至排行榜页面
  goToRanking() {
    wx.navigateTo({
      url: '/pages/ranking/ranking'
    })
  },

})