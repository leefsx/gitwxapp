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
    product_category: 0,
    list_page: 1,
    curIndex: 0,
    prompt:{
      hidden:true,
    },
    config: []
  },
  onShow(){
    if (this.data.products.length<1){
      this.getProductsFromServer(4, 1)
      wx.stopPullDownRefresh()
    }
    this.setData({
      config: {
        'website_name': config.website_name,
        'logo': config.logo
      }
    })
  },
  switchTab(e) {
    var that = this
    var cateid = e.target.dataset.id;
    var curIndex = e.currentTarget.dataset.index;
    console.log(curIndex)
    that.setData({
      curIndex: curIndex
    })
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
          product_category: cateid,
          curIndex: curIndex,
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
    var product_category = that.data.product_category
    app.request({
      url: app.domain + '/api/product/catelist',
      data: {
        
      },
      method: 'GET',
      success: function (res) {
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
        product_category: product_category,
        p: page
      },
      method: 'GET',
      success: function (res) {
        var resdata = res.data.data
        if (page > 1 && resdata.length > 0) {
          var this_products = that.data.products
          this_products = this_products.concat(resdata)
        }else{
          var this_products = resdata
        }
        that.setData({
          products: this_products,
          website_name: config.website_name,
          list_page: page
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
  load_more() {
    var this_page = this.data.list_page
    if (this_page > 0) {
      this.getProductsFromServer(4, this_page + 1)
    }
  },
  onReachBottom() {
    this.load_more()
  }

})