var comm = require('../../common/common.js');
var config = require('../../common/config.js');
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
    website_name: '',
    list_page: 1
  },
  onLoad() {
    this.getProductsFromServer(6,1)
  },
  onShow: function () {
    // 页面显示
    
  },
  toCategory(){
    wx.switchTab({
      url: 'category/category',
    })
  },
  onPullDownRefresh(){
    var list_page = this.data.list_page
    var list_num = 6 * (list_page)
    this.getProductsFromServer(list_num, 1)
    wx.stopPullDownRefresh()
  },
  load_more(){
    var this_page = this.data.list_page
    if (this_page>0){
      var new_list = this.getProductsFromServer(6, this_page+1)
      
      
    }
    
  },
  getProductsFromServer(list_num, page) {
    var that = this;
    app.request({
      url: app.domain + '/api/product/list',
      data: {
        list_num: list_num,
        product_category: 0,
        p: page
      },
      method: 'GET',
      success: function (res) {
        // console.log(res)
        var resdata = res.data.data
        if (page > 1 && resdata.length > 0) {
          var this_products = that.data.products
          this_products = this_products.concat(resdata)
          that.setData({
            products: this_products,
            list_page: page
          })
          
          return resdata;
        }else{
          that.setData({
            products: resdata,
            website_name: config.website_name
          })
          if (resdata.length > 0) {
            // console.log(resdata[0].id)
            app.globalData.firstPid = resdata[0].id
          }
        }
        
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