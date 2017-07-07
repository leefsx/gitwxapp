// page/component/new-pages/user/user.js
var comm = require('../../../common/common.js');
var app = getApp();
Page({
  data:{
    thumb:'',
    nickname:'',
    orders:[],
    hasAddress:false,
    address:{},
    order_pro_rel:[]
  },
  onLoad(){
  },
  onShow() {
    var self = this;
    var openid = wx.getStorageSync('openid');
    if (openid) {
      var url = comm.parseToURL('weixin', 'signin')
      var uinfo = self.data.userInfo
      app.request({
        url: url,
        data: {
          openid: openid
        },
        method: 'GET',
        success: function (res) {
          if (res.data.result == 'OK') {
            if (app.globalData.userInfo) {
              self.setData({
                userInfo: app.globalData.userInfo
              })
            } else {
              app.getUserInfo(function (userInfo) {
                console.log(userInfo)
                self.setData({
                  userInfo: userInfo
                })
              })
            }
            app.request({
              url: comm.parseToURL('user', 'order_list'),
              method: 'GET',
              data: [],
              success: function (res) {
                console.log(res.data)
                if (res.data.result == 'OK') {
                  self.setData({
                    orders: res.data.data,
                    order_pro_rel: res.data.order_pro_rel
                  })
                }
              }

            })
          } else {
            wx.navigateTo({
              url: '../profile/profile'
            })
          }
        }
      })

    } else {
      wx.navigateTo({
        url: '../profile/profile'
      })
    }
   },
  /**
   * 发起支付请求
   */
  payOrders() {
    wx.showToast({
      title: '请求中...',
      icon: 'loading',
      duration: 5000
    })
  }
})