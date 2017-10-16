var comm = require('../../common/common.js');
var config = require('../../common/config.js');
var WxParse = require('../../common/wxParse.js');
var app = getApp();
Page({
  data: {
    imgUrls: [],
    products:[],
    goodsXX: [],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    website_name: '',
    list_page: 1,
    index_middle_img: [],
    index_middle2_img: '',
    config: [],
    hadmore: true,
    loading: false,
    detail_data: [],
    carts: [],
    currentState: false,
    product_id: '',
    propertys: [],
    skulist: [],
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
    attr_data: [],
    tradeRate: [],
    salesRecords: [],
    productMessage: [],
    prevnext: []
  },
  onLoad() {

  },
  onShow: function () {
    this.getProductsFromServer(6, 1),
      this.setData({
        imgUrls: config.index_autoplay_img,
        index_middle_img: config.index_middle_img,
        index_middle2_img: config.index_middle2_img,
        carts: app.globalData.carts,
        config: {
          'website_name': config.website_name,
          'logo': config.logo,
          'hotline_logo': config.hotline_logo,
          'hotline_no': config.hotline_no,
          'copyright': config.copyright,
          'product_title': config.product_title,
          'index_middle_title': config.index_middle_title,
          'logourl': config.logourl,
          'customer_service': config.customer_service,
          'customer_service_bgcolor': config.customer_service_bgcolor
        },
        index_autoplay_imgurl: config.index_autoplay_imgurl,
        index_middle_imgurl: config.index_middle_imgurl,
        list_page: 1
      })
    app.globalData.hadInLoginPage = false
    
  },


// 直接添加到购物车--开始
  initCart() {
    this.setData({
      detail_data: [],
      currentState: false,
      product_id: '',
      propertys: [],
      skulist: [],
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
      attr_data: []
    })
  },
  directAddCart(e) {
    var that = this
    var itemId = e.currentTarget.dataset.id;
    console.log(itemId)
    app.request({
      url: app.domain + '/api/product/detail',
      dataType: 'json',
      data: {
        id: itemId
      },
      method: 'GET',
      success: function (res) {
        that.setData({
          detail_data: res.data.data,
          product_id: itemId,
          tradeRate: res.data.tradeRate,
          salesRecords: res.data.salesRecords,
          productMessage: res.data.productMessage,
          prevnext: res.data.PrevNext,
          propertys: res.data.newsku,
          skulist: res.data.skulist
        })
        console.log(res.data.data)
        var carts = that.data.carts
        var cart_index = carts.length
        var detail_data = res.data.data
        var skulist = res.data.skulist
        var attr_data = that.data.attr_data;
        var hadInCart = false
        var propertys = res.data.newsku;
        if (skulist && Object.keys(skulist).length > 0) {
          console.log('m')
          that.setData({
            currentState: (!that.data.currentState)
          })
        } else {
          console.log('n')
          wx.showLoading({
            title: '请求中',
            mask: true
          })
          if (cart_index > 0) {
            for (var i = 0; i < cart_index; i++) {
              if (detail_data.skuid && carts[i].cid == detail_data.id && carts[i].skuid == detail_data.skuid) {
                carts[i].num += that.data.food.num;
                hadInCart = true
              } else if (!detail_data.skuid && carts[i].cid == detail_data.id) {
                carts[i].num += that.data.food.num;
                hadInCart = true
              }
            }
          }
          if (hadInCart == false) {
            var send_data = {
              cid: detail_data.id,
              title: detail_data.name,
              image: detail_data.feature_img[0],
              num: that.data.food.num,
              price: detail_data.price,
              sum: detail_data.price,
              selected: true,
              max_kc: detail_data.num,
              skuid: detail_data.skuid || 0
            }
            carts.push(send_data)
          }
          app.globalData.carts = carts
          wx.showToast({
            title: '添加成功'
          })

          that.initCart()
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
  directAddCartOK() {
    var that = this
    var carts = that.data.carts
    var cart_index = carts.length
    var detail_data = that.data.detail_data
    var skulist = that.data.skulist
    var attr_data = that.data.attr_data;
    var hadInCart = false
    var propertys = that.data.propertys
    var isFull = true
    var food = that.data.food
    var num = parseInt(food.num)
    if (attr_data.length == 0) {
      isFull = false
    } else {
      for (var i = 0; i < attr_data.length; i++) {
        console.log(1)
        if (attr_data[i] == '' || attr_data[i] == undefined || attr_data.length < propertys.length) {
          isFull = false
          break
        }
        isFull = true
      }
    }
    if (!isFull) {
      wx.showToast({
        title: '请选择商品属性'
      })
    } else {
      wx.showLoading({
        title: '请求中',
        mask: true
      })
      if (cart_index > 0) {
        for (var i = 0; i < cart_index; i++) {
          if (detail_data.skuid && carts[i].cid == detail_data.id && carts[i].skuid == detail_data.skuid) {
            console.log(carts[i].num)
            var cartNum = parseInt(carts[i].num)
            carts[i].num = cartNum += num;
            hadInCart = true
          } else if (!detail_data.skuid && carts[i].cid == detail_data.id) {
            var cartNum = parseInt(carts[i].num)
            carts[i].num = cartNum += num;
            hadInCart = true
          }
        }
      }
      if (hadInCart == false) {
        var send_data = {
          cid: detail_data.id,
          title: detail_data.name,
          image: detail_data.feature_img[0],
          num: that.data.food.num,
          price: detail_data.price,
          sum: detail_data.price,
          selected: true,
          max_kc: detail_data.num,
          skuid: detail_data.skuid || 0
        }
        carts.push(send_data)
      }
      app.globalData.carts = carts
      wx.showToast({
        title: '添加成功'
      })
      that.initCart()
    }
  },
  switchDetState(e) {
    let propertys = this.data.propertys;
    const idx = parseInt(e.currentTarget.dataset.index);
    const id = parseInt(e.currentTarget.dataset.id);
    const pid = parseInt(e.currentTarget.dataset.pid);
    const did = parseInt(e.currentTarget.dataset.did);
    var attr_data = this.data.attr_data;
    var skulist = this.data.skulist
    var detail_data = this.data.detail_data
    var isFull = true
    if (propertys[id].details[idx].detail_state != "disable" && propertys[id].details[idx].detail_state != "active") {
      propertys[id].details.forEach(function (e) {
        if (e.detail_state == "active") {
          e.detail_state = "";
        }
      })
      propertys[id].details[idx].detail_state = "active"
    }

    attr_data[id] = pid + ':' + did
    for (var i = 0; i < attr_data.length; i++) {
      console.log(1)
      if (attr_data[i] == '' || attr_data[i] == undefined) {
        isFull = false
        break
      }
      isFull = true
    }
    if (attr_data.length > 0 && attr_data.length == propertys.length && isFull) {
      var attr_str = attr_data.join(';')
      var skuid = skulist[attr_str]

      detail_data.price = skuid.price
      detail_data.num = skuid.quantity
      detail_data.skuid = skuid.id
    }
    this.setData({
      propertys: propertys,
      attr_data: attr_data,
      detail_data: detail_data
    })
  },
  changState() {
    this.setData({
      currentState: (!this.data.currentState)
    })
    this.initCart()
  },
  addCount() {

    let food = this.data.food;
    let num = food.num;
    let detail_data = this.data.detail_data
    const count = parseInt(detail_data.num);
    console.log(count)
    num = num + 1;
    if (num > count) {
      num = parseInt(count);
      wx.showToast({
        title: '数量超出范围~'
      })
    }
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
// 直接添加到购物车--结束
  toCategory(e){
    var cindex = e.currentTarget.dataset.index
    var type = e.currentTarget.dataset.type
    var imgdata = []
    if (type == 'index_autoplay_imgurl') {
      imgdata = config.index_autoplay_imgurl
    } else if (type == 'index_middle_img') {
      imgdata = config.index_middle_imgurl
    } else if (type == 'logourl') {
      imgdata[0] = config.logourl
    }
    if (typeof (imgdata[cindex]['category_id']) != 'undefined') {
      app.globalData.cateid = imgdata[cindex]['category_id']
      //app.globalData.catename = 
      wx.switchTab({
        url: 'category/category'
      })
    } else if (typeof (imgdata[cindex]['detail_id']) != 'undefined') {
      wx.navigateTo({
        url: 'details/details?id=' + imgdata[cindex]['detail_id'],
      })

    } else {
      wx.switchTab({
        url: 'category/category',
      })
    }
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
  // onReachBottom() {
  //       this.load_more()
  // },
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
        var hadmore = true
        if (page > 1 && resdata.length > 0) {
          var this_products = that.data.products
          if (resdata.length < list_num){
            hadmore = false
          }
          this_products = this_products.concat(resdata)
          that.setData({
            products: this_products,
            list_page: page,
            hadmore: hadmore
          })
          
          return resdata;
        }else{
          if (resdata.length < list_num){
            hadmore = false
          }
          that.setData({
            products: resdata,
            website_name: config.website_name,
            hadmore: hadmore
          })
          if (resdata.length > 0) {
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
  },
  tocategory(opt){
    var cateid = opt.target.dataset.id
    if (cateid){
      app.globalData.cateid = cateid
      wx.switchTab({
        url: 'category/category'
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: config.website_name,
      path: 'pages/component/index'
    }
  },
  calling(){
    var hotline_no = config.hotline_no
    if(hotline_no){
      var hotline = hotline_no.replace(/[\-\_\,\!\|\~\`\(\)\*\{\}\:\;\"\L\<\>\?]/g, '');
      wx.makePhoneCall({
        phoneNumber: hotline
      })
    }
  }

})