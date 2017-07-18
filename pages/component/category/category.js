var config = require('../../../common/config.js');
var app = getApp()
Page({
  data: {
    products:[],
    category: [],
    website_name: '',
    goods: [
      {
        "first_level_category": "坚果炒货2",
        "fir_ord": "1",
        "content": [
          {
            "second_level_category": "碧根果",
            "sec_ord": "0",
            "good": []
          }
        ]
      }
    ],
    detail: [],
    curFirIndex: 0,
    curSecIndex: 0,
    prompt:{
      hidden:true,
    }
  },
  onShow(){
    if (this.data.products.length<1){
      this.getProductsFromServer(4, 1)
      wx.stopPullDownRefresh()
    }
  },
  switchTab(e) {
    var that = this
    var cateid = e.target.dataset.id;
    app.request({
      url: app.domain + '/api/product/list',
      data: {
        list_num: 6,
        product_category: cateid
      },
      method: 'GET',
      success: function (res) {
        var resdata = []
        if (res.data.result=='OK'){
          resdata = res.data.data
        }
        that.setData({
          products: resdata,
          'prompt.hidden': resdata.length
        })
      },
      fail: function () {
        console.log('fail');
      },
      complete: function () {
        console.log('complete!');
      }
    })
   
    
  },
  onPullDownRefresh() {
    this.getProductsFromServer(4, 1)
    wx.stopPullDownRefresh()
  },
  getProductsFromServer(list_num, page) {

    var that = this;
    app.request({
      url: app.domain + '/api/product/catelist',
      data: {

      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.result == 'OK') {
          that.setData({
            category: res.data.data
          })
        } else {
          wx.showToast({
            title: '请求失败'
          })
        }
      }
    })
    app.request({
      url: app.domain + '/api/product/list',
      data: {
        list_num: list_num,
        product_category: 0,
        p: page
      },
      method: 'GET',
      success: function (res) {
        var resdata = res.data.data
        that.setData({
          products: resdata,
          website_name: config.website_name
        })
      },
      fail: function () {
        console.log('fail');
      },
      complete: function () {
        console.log('complete!');
      }
    })
  }

})