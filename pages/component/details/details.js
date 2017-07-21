// page/component/details/details.js
var WxParse = require('../../../common/wxParse.js');
var comm = require('../../../common/common.js');
var app = getApp();
Page({
  data: {
    product_id: '',
    detail_data: [],
    detail_desc: '',
    carts:[],

    fir_ord: 0,
    sec_ord: 0,
    good_ord: 0,
    curIndex: 0,
    duration: 500,
    currentState: false,
    food: {
      "name": "坚果零食大礼包",
      "good_ord": "0",
      "fir_ord": "0",
      "sec_ord": "1",
      "url": "/image/o1.jpg",
      "old_price": "￥150",
      "price": "￥150",
      "dec": "一份价钱，尽享10种零",
      "total_count": 200,
      "num": 1,
      "dec_detail": {
      }
    },
    tradeRate: [],
    salesRecords: [],
    productMessage: []

  },
  changState() {
    this.setData({
      currentState: (!this.data.currentState)
    })
  },
  addCount() {
    
    let food = this.data.food;
    let num = food.num;
    const count = food.total_count;
    if (num >= count) {
      return false;
    }
    num = num + 1;
    food.num = num;
    this.setData({
      food: food
    });
  },

  minusCount() {
    let food = this.data.food;
    let num = food.num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    food.num = num;
    this.setData({
      food: food
    });
  },
  toCart() {
    var that = this;
    var carts = that.data.carts
    var cart_index = carts.length
    var detail_data = that.data.detail_data
    var hadInCart = false
    
    if (cart_index > 0) {
      for (var i = 0; i < cart_index; i++) {
        
        if (carts[i].cid == detail_data.id) {
          carts[i].sum = detail_data.price;
          carts[i].price = detail_data.price;
          carts[i].num += that.data.food.num;
          hadInCart = true
        }
      }

    }
    if (hadInCart == false) {
      var send_data = {
        cid: detail_data.id,
        title: detail_data.name,
        image: detail_data.feature_img,
        num: that.data.food.num,
        price: detail_data.price,
        sum: detail_data.price,
        selected: true,
        max_kc: detail_data.num
      }
      carts.push(send_data)
    }
    
    app.globalData.carts = carts
    wx.switchTab({
      url: '../cart/cart',
    })
  },
  toConfirm(){
    
    var that = this
    var detail_data = that.data.detail_data
    var carts = [{
      cid: detail_data.id,
      title: detail_data.name,
      image: detail_data.feature_img,
      num: that.data.food.num,
      price: detail_data.price,
      sum: detail_data.price,
      selected: true,
      max_kc: detail_data.num
    }]
    
    app.globalData.carts = carts
    wx.switchTab({
      url: '../cart/cart',
    })
    
    
  },
  onLoad(options){
    if (!options.id) options.id = app.globalData.firstPid
    if (options.id) {
      var that = this;
      that.setData({
        carts: app.globalData.carts
      })
      app.request({
        url: app.domain + '/api/product/detail',
        dataType: 'json',
        data: {
          id: options.id
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data.productMessage)
          var detail = res.data.data.description;
          WxParse.wxParse('detail_desc', 'html', detail, that, 0);
          that.setData({
            detail_data: res.data.data,
            product_id: options.id,
            tradeRate: res.data.tradeRate,
            salesRecords: res.data.salesRecords,
            productMessage: res.data.productMessage
          })
        },
        fail: function () {
          console.log('fail');
        },
        complete: function () {
          console.log('complete!');
        }
      })

    } else {
      wx.navigateBack()
    }
  },


  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    
    this.setData({
      curIndex: index
    })
  },

  currentChange(e) {
    
    this.setData({
      curIndex: e.detail.current
    })
  },


  oTs: function (e) {
    var m = this;
    console.log(e)
    m._x = e.touches[0].clientX;
  },
  oTe: function (e) {
    console.log(e)
    var m = this;
    var curIndex = parseInt(this.data.curIndex);

    m._new_x = e.changedTouches[0].clientX;

    if (m._new_x - m._x > 8 && curIndex > 0) {
      curIndex = curIndex - 1;
    }

    if (m._new_x - m._x < -8 && curIndex < 3) {
      curIndex += 1;
    }

    this.setData({
      curIndex: curIndex
    });
  },


})