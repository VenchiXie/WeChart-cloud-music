// pages/musicListSquare/musicListSquare.js

import request from '../../utils/request'

// 当前分类的tag名称
let tagName = '';
// 存放tagMusicList数据
let tagMusicListData = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前显示的页面
    showPage: 0,
    // 头部标签信息
    headTags: [],
    // 当前选择的分类索引
    categoryIndex: 0,
    // 存放tag下的歌单
    tagMusicList: [],
    // 是否存在更多歌单数据
    isMore: true,
    // 存放所有的tags标签数据
    allTags: [],
    // 点击allTag中的标签的详情数据
    tagDetail: [],
    // 当前标签详情的名称
    tagName: '',
    // 是否显示遮罩层
    isMaskShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await this.getHeadTags()
    let tagName = this.data.headTags[this.data.categoryIndex].name;
    this.getTagMusicList(tagName)
  },

  // 获取头部标签信息
  async getHeadTags() {
    let { tags } = await request('/playlist/hot');
    // 创建空数组为swiper占位
    let tagMusicList = [];
    tags.forEach(() => {
      tagMusicList.push([])
      // 避免浅拷贝共享地址
      tagMusicListData.push([])
    });
    // console.log(tags);
    this.setData({
      headTags: tags,
      tagMusicList
    })
  },

  // 跳转至tags列表
  goToMoreTags() {
    this.setData({
      showPage: 1
    })
    if (this.data.allTags.length == 0) {
      this.getAllTags()
      console.log(123);
    }
  },

  // 返回歌单广场
  goBackSquare() {
    this.setData({
      showPage: 0
    })
  },

  // 点击头部标签切换tag的回调
  changeTag(e) {
    // console.log(e.currentTarget.id);
    let index = e.currentTarget.id.slice(1);
    // 先判断用户是不是点击了当前所处的分类标签
    if (index != this.data.categoryIndex) {
      this.clearAttributes()
      this.setData({
        categoryIndex: index
      })
      // 更新tagName
      tagName = this.data.headTags[this.data.categoryIndex].name;
      // this.getTagMusicList(tagName)

    } else {
      return
    }
  },

  // 获取该标签下的歌单
  async getTagMusicList(tag, offset) {
    this.setData({
      isMaskShow: true
    })
    if (offset == undefined) {
      offset = ''
    }
    let { more, playlists } = await request('/top/playlist', { cat: tag, limit: 21, offset })
    let tagMusicList = this.data.tagMusicList;
    tagMusicList[this.data.categoryIndex].push(...playlists);
    // 这里也用push 避免浅拷贝导致数据跟着tagMusicList一起被clearAttributes清空
    tagMusicListData[this.data.categoryIndex].push(...playlists);
    // console.log(more);
    this.setData({
      isMore: more,
      tagMusicList,
      isMaskShow: false,
    })
  },

  // 滑动触底时的回调
  // 查询更多musicList
  async reachBottom() {
    if (this.data.isMore == true) {
      // console.log(this.data.tagMusicList[this.data.categoryIndex][this.data.tagMusicList.length - 1].createTime);
      this.getTagMusicList(tagName, this.data.tagMusicList[this.data.categoryIndex].length)
    } else {
      return;
    }
  },

  // 当滑动swiper时的回调
  changeCurrent(e) {
    // console.log(e);
    // console.log(e.detail.current);
    // 更新tagName
    this.clearAttributes()
    this.setData({
      categoryIndex: e.detail.current
    })
    if (tagMusicListData[e.detail.current].length == 0) {
      tagName = this.data.headTags[e.detail.current].name;
      this.getTagMusicList(tagName)
    } else {
      let tagMusicList = this.data.tagMusicList;
      tagMusicList[e.detail.current].push(...tagMusicListData[e.detail.current])
      this.setData({
        tagMusicList,
      })
    }
  },

  // 重置所有属性的函数
  clearAttributes() {
    let tagMusicList = this.data.tagMusicList;
    tagMusicList.forEach((item, index, arr) => {
      arr[index] = []
    })
    this.setData({
      isMore: true,
      tagMusicList,
    })
  },

  // 获取并加载全部标签数据
  async getAllTags() {
    let result = await request('/playlist/catlist');
    console.log(result);
    let allTags = [];
    for (var key in result.categories) {
      allTags.push([{ key: result.categories[key] }, []])
    }
    let index = 0
    allTags.forEach(item => {
      result.sub.forEach(i => {
        if (i.category == index) {
          allTags[index][1].push(i)
        }
      })
      index++;
    })
    console.log(allTags);
    this.setData({
      allTags
    })
  },

  // 点击所有标签中标签的回调
  async selectTag(e) {
    // 更新tagName
    tagName = e.currentTarget.dataset.tagname;
    this.setData({
      showPage: 2,
    })
    this.getTagDetailData(tagName)

  },

  // 将获取tagDetail数据的函数进行封装
  async getTagDetailData(tag, offset) {
    if (offset == undefined) {
      offset = ''
    }
    let { playlists, more } = await request('/top/playlist', { cat: tag, limit: 21, offset })
    // console.log(result);
    let tagDetail = this.data.tagDetail;
    tagDetail.push(...playlists);
    this.setData({
      isMore: more,
      tagDetail,
      tagName,
    })

  },

  // 标签详情触底的回调
  tagDetailReachBottom() {
    if (this.data.isMore == true) {
      this.getTagDetailData(tagName, this.data.tagDetail.length)
    } else {
      return;
    }
  },

  // 从tagDeatil中返回allTags
  goBackTags() {
    this.setData({
      showPage: 1,
    })
    this.setData({
      tagName: '',
      tagDetail: [],
    })
  },

  // 跳转至musiclist页面
  toMusicList(e) {
    // console.log(e);
    wx.navigateTo({
      url: '/pages/musicList/musicList?musiclistid=' + e.detail.currentTarget.dataset.musiclistid,
    });
  },

})