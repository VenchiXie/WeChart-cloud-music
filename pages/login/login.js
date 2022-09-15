// pages/login/login.js
 
import request from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',  // 手机号
    password: '',  // 密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 表单项内容发生改变的回调
  handleInput(event) {
    // let type = event.currentTarget.id; // id传值 取值 phone || password
    // console.log(event);
    let type = event.currentTarget.dataset.type;  // data-key=value 传值   用data-key形式可以传多个数据 而id是唯一的
    // console.log(type, event.detail.value);
    this.setData({
      // type是变量，对象里面操作属性用中括号
      [type]: event.detail.value
    })
  },

  // 登录的回调
  async login() {
    // 收集表单项数据
    let { phone, password } = this.data;
    // 前端验证
    if (!phone.trim()) {
      //提示用户
      wx.showToast({
        title: '手机号不能为空!',
        icon: 'none'
      })
      return;
    }

    // 正则表单式
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if (!phoneReg.test(phone)) {
      //提示用户
      wx.showToast({
        title: '手机号格式不正确!',
        icon: 'none'
      })
      return;
    }

    if (!password.trim()) {
      //提示用户
      wx.showToast({
        title: '密码不能为空!',
        icon: 'none'
      })
      return;
    }

    // 后端验证
    let result = await request('/login/cellphone', { phone, password, isLogin: true })
    console.log(result);
    if (result.code === 200) {
      wx.showToast({
        title: '登陆成功'
      })

      // 将用户的信息存储至本地
      wx.setStorageSync('userInfo', JSON.stringify(result.profile));
      wx.setStorageSync('userId', result.profile.userId)

      // 跳转至个人中心personal页面
      wx.reLaunch({
        url: '/pages/index/index'
      });
    } else if (result.code === 400) {
      wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })
    } else if (result.code === 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '登录失败，请重新登录!',
        icon: 'none'
      })
    }
  },

})