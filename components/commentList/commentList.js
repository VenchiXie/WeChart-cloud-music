// components/commentList/commentList.js
import request from '../../utils/request';
import moment from 'moment';


let floorCommentTime = ''; // time: 分页参数,取上一页最后一项的 time 获取下一页数据
let commentId = '';      // 当前评论的id
let resourceTypeNum = 0; // 当前资源类型

 
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // // 资源id
    musicId: {
      type: String,
      value: '',
    },

    commentListHeight: {
      type: String,
      value: '100vh',
    },
    // 资源类型
    resourceType: {
      type: String,
      value: 'music'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isFloorCommentListShow: false,  // 是否显示楼层评论列表
    floorComment: {},  // 楼层评论数据
    isFloorLoad: true, // 是否显示楼层评论的loading组件
    commentList: [],   // 评论列表
    page: 1,           // 当前评论页数
    isLoad: true,      // 是否显示loading组件
    total: 0,          // 评论总条数
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击遮罩层隐藏楼层评论列表
    hideList() {
      // console.log(123);
      this.setData({
        isFloorCommentListShow: false,
        floorComment: {},
      })
    },

    // 点击遮罩层隐藏楼层评论列表
    async showList(e) {
      // 先滑出楼层评论框，提升用户体验
      this.setData({
        isFloorLoad: true,
        isFloorCommentListShow: true
      })
      commentId = e.currentTarget.dataset.commentid;
      let floorComment = await request('/comment/floor', { parentCommentId: commentId, id: this.data.musicId, limit: 10, type: resourceTypeNum })
      console.log(floorComment);
      floorComment = floorComment.data;
      if (floorComment.comments.length == 10) {
        // 在处理时间前先保存
        floorCommentTime = floorComment.comments[floorComment.comments.length - 1].time;
      } else {
        this.setData({
          isFloorLoad: false
        })
      }
      // 对时间进行处理
      floorComment.ownerComment.time = moment(floorComment.ownerComment.time).format('yyyy年M月Do');
      floorComment.comments.forEach(item => {
        item.time = moment(item.time).format('yyyy年M月Do');
      })
      this.setData({
        floorComment
      })
    },

    // 楼层评论滑动到底部
    async reachFloorBottom() {
      if (floorCommentTime == '') {
        return
      }
      let floorComment = this.data.floorComment;
      let result = await request('/comment/floor', { parentCommentId: commentId, id: this.data.musicId, limit: 10, type: resourceTypeNum, time: floorCommentTime })
      if (result.data.comments.length == 0) {
        this.setData({
          isFloorLoad: false
        })
        return
      }
      result = result.data.comments;
      // 在处理时间前先保存
      floorCommentTime = result[result.length - 1].time;
      // 处理时间
      result.forEach(item => {
        item.time = moment(item.time).format('yyyy年M月Do');
      })
      floorComment.comments.push(...result)
      this.setData({
        floorComment
      })
    },

    // 获取评论列表的函数
    async getCommentList(id, page) {
      let commentList = this.data.commentList;
      let commentData = await request('/comment/new', { id, pageSize: 10, pageNo: page, sortType: 2, type: resourceTypeNum });
      console.log(commentData);
      // 给total赋值
      if (this.data.total == 0 && commentData.data.totalCount != 0) {
        this.setData({
          total: commentData.data.totalCount
        })
      }
      // 判断评论是否为 0，为 0关闭Load组件并return
      if (commentData.data.comments.length == 0) {
        this.setData({
          isLoad: false
        })
        return;
      }

      commentData.data.comments.forEach(async item => {
        item.time = moment(item.time).format('yyyy年M月Do');
      })
      commentList.push(...commentData.data.comments)
      this.setData({
        commentList
      })
    },

    // 评论列表触底时触发的事件
    reachBottom() {
      // console.log('触底');
      this.setData({
        page: this.data.page + 1
      })
      this.getCommentList(this.data.musicId, this.data.page)
    },
  },

  lifetimes: {
    ready: function () {
      // 在组件实例进入页面节点树时执行
      // 判断资源类型
      if (this.data.resourceType == 'music') {
        resourceTypeNum = 0
      } else if (this.data.resourceType == 'video') {
        resourceTypeNum = 5
      } else if (this.data.resourceType == 'mv') {
        resourceTypeNum = 1
      }

      // 获取评论数据
      this.getCommentList(this.data.musicId, this.data.page)
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
})
