// order_confirm.js
// <import src ="utils/common/nav.wxml" />
import util from "../../../utils/util.js"  
var comm = require('../../../common/common.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carts:[],
    total_price:0,
    nowtime: '',
    oid: '',
    order:{
      "id": 1,
      "number": "A4501354410893725",
      "url": "/image/o1.jpg",
      "name": "坚果零食大礼包",
      "count": "3个",
      "status": 0,
      "money": "450",
      "time": "2017-7-5 17:30"
    },
    pay_ways:[
      {
        way_id: 0,
        src: "../../../image/wx.png"
      },
    ],
    pay_way_id:0,
    delivery_mode:["无需配送(虚拟物品)","用户自提","中国邮政"],
    delivery_time:["9:00-12:00","12:00-18:00","18:00-22:00"],
    coupon_mode:["未使用"],
    integral_mode:[0],
    balance_mode:[0.00],
    index_mode: 0,
    index_time: 0,
    index_coupon:0,
    index_integral:0,
    index_balance:0,
    delivery_money:20,
    delivery_addr: false,
    start_date:"",
    date:"",
    time: "9:00-12:00",
    address: {
      name: '',
      phone: '',
      detail: ''
    },
    coupon:0,
    integral:0,
    balance:0.00,
    invoice_mode: ["不需要","需要"],
    index_invoice: 0,
    pay_mode:["在线支付","货到付款"],
    index_pay:0,
    lastPrice:0
    
  },
  lastPay(){
    wx.navigateTo({
      url: '../pay/pay',
    })
  },
  bindPickerChange(e){
    this.setData({
      index_mode: e.detail.value
    })
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange(e){
    this.setData({
      index_time: e.detail.value
    })
  },
  addAddr(){
    wx.navigateTo({
      url: '../address/address',
    })
  },
  bindInvoiceChange(e){
    this.setData({
      index_invoice: e.detail.value
    })
  },
  bindPayChange(e) {
    this.setData({
      index_pay: e.detail.value
    })
  },
  changePay(e){
    let way_id = e.target.dataset.id
    this.setData({
      pay_way_id: way_id
    })
  },
  onLoad: function (options) {
    var carts = app.globalData.carts
    if(carts.length>0){
      var total_price = 0
      for (var key in carts){
        total_price += carts[key]['price'] * carts[key]['num']
      }
      var now = comm.get_now()
      this.setData({
        carts: carts,
        total_price: total_price,
        nowtime: now,
        oid: options.oid
      })
    }
  },
  onShow: function () {
    let start_date=util.formatTime2(new Date);
    console.log(start_date)
    this.setData({
      start_date: start_date,
      date: start_date
    })
    var self = this;
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function (res) {
        self.setData({
          delivery_addr: true,
          address: res.data
        })
      }
    })
  },
})
// Page({

//   /**
//    * 页面的初始数据
//    */
//   data: {
    
//   },

//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
    
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {
    
//   },

//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {
    
//   },

//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {
    
//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {
    
//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {
    
//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {
    
//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {
    
//   }
// })




