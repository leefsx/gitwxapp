
var comm = require('../../common/common.js');

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "profile",
  /**
   * 页面的初始数据
   */

  data: {
    userInfo:[]
  
  },
  onLoad () {
    var that = this
    var openid = wx.getStorageSync('openid');
    if (app.globalData.userInfo){
      that.setData({
        userInfo: app.globalData.userInfo
      })
    }else{
      app.getUserInfo(function (userInfo) {
        that.setData({
          userInfo: userInfo
        })
      })
    }
    console.log(that.data.userInfo.avatarUrl)
    if(openid){
      var url = comm.parseToURL('weixin','signin')
      var uinfo = that.data.userInfo
      app.request({
        url: url,
        data: { 
          openid: openid
        },
        method: 'GET',
        success: function(res){
          if(res.data.result=='OK'){
            wx.switchTab({
              url: `../signin/signin`
            })
          }else{
            console.log(res.data)
          }
        }
      })
      
    }
    
  },
  auto_registered: function(opt){
    var that = this
    var openid = wx.getStorageSync('openid');
    console.log(that.data.userInfo.avatarUrl)
    app.request({
      url: comm.parseToURL('weixin','auto_registered'),
      data: {
        openid: openid,
        headphoto: that.data.userInfo.avatarUrl
      },
      method: 'POST',
      success: function(res){
        console.log(res)
        if(res.data.result=='OK'){
          app.globalData.APISESSID = res.data.APISESSID
          wx.switchTab({
            url: `../signin/signin`
          })
        }else{
          wx.showToast({
            title: '请求失败！'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh () {
    
  }

  
})

