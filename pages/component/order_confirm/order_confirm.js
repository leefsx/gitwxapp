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
    cuser: [],
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
    pay_mode:["货到付款"],
    index_pay:0,
    lastPrice:0
    
  },
  lastPay(){
    var oid = this.data.oid
    if(oid){
      var order_data = {
        delivery_mode: this.data.delivery_mode,
        delivery_time: this.data.delivery_time,
        address: this.data.address,
        invoice_mode: this.data.invoice_mode,
        total_price: this.data.total_price
      }
      app.request({
        url: comm.parseToURL('order','dopayment'),
        data:{
          oid: oid,
          order_data: JSON.stringify(order_data)
          
          
        },
        method: 'POST',
        success: function(res){
          console.log(res)
          if(res.data.result=='OK'){
            wx.showToast({
              title: '支付成功'
            })
          }else{
            wx.showToast({
              title: '支付失败'
            })
          }
          wx.switchTab({
            url: '../user/user',
          })
        }
      })
    }else{
      wx.showToast({
        title: '请求失败'
      })
    }
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
    var cuser = comm.get_cuser();
    if(carts.length>0){
      var total_price = 0
      for(var i=0;i<carts.length;i++){
        total_price += carts[i].price * carts[i].num
      }
      var now = comm.get_now()
      this.setData({
        carts: carts,
        total_price: total_price.toFixed(2),
        nowtime: now,
        oid: options.oid,
        cuser: cuser
      })
    }
  },
  onShow: function () {
    let start_date=util.formatTime2(new Date);
    //console.log(start_date)
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




