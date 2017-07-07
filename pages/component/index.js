var comm = require('../../common/common.js');
var WxParse = require('../../common/wxParse.js');
var app = getApp();
Page({
  data: {
    imgUrls: [
      '/image/bg-1.jpg',
      '/image/bg-2.jpg'
    ],
    products:[],
    goodsXX: [],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
  },
  onLoad() {
    var that = this;
    app.request({
      url: app.domain + '/api/product/list',
      data: {
        list_num: 6,
        product_category: 0
      },
      method: 'GET',
      success: function (res) {
        var resdata = res.data.data
        that.setData({
          products: resdata
        })
        if (resdata.length>0){
          app.globalData.firstPid = resdata[0].id
        }
      },
      fail: function () {
        console.log('fail');
      },
      complete: function () {
        console.log('complete!');
      }
    })
  },
  toCategory(){
    wx.switchTab({
      url: 'category/category',
    })
  }
})