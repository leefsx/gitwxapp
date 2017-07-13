var app = getApp()

function parseToURL(m,a,arr){
  var domain = app.domain+'/api/'+m+'/'+a+'/';
  var url = domain
  var i = 0
  for(var key in arr){
    if(i==0){
      url += '?' + key + '=' + arr[key];
    }else{
      url += '&' + key + '=' + arr[key];
    }
    i++
  }
  return url;
}

function get_cuser(obj){
  if (app.globalData.cuser){
    return app.globalData.cuser
  }else{
    var openid = wx.getStorageSync('openid');
    if (openid) {
      wx.request({
        url: parseToURL('weixin', 'signin'),
        method: 'GET',
        data: { openid: openid },
        success: function (res) {
          if (res.data.result == 'OK') {
            app.globalData.cuser = res.data
            typeof obj.success == "function" && obj.success(res.data)
          } else {
            typeof obj.success == "function" && obj.success(false)
          }
        },
        fail: function () {
          typeof obj.success == "function" && obj.success(false)
        }
      })
    }
  }
  return false
  
}

function get_now(){
  var myDate = new Date();
  var year = myDate.getFullYear();
  var month = myDate.getMonth();
  var day = myDate.getDate();
  var hour = myDate.getHours();
  var minute = myDate.getMinutes();
  return year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
}


module.exports.parseToURL = parseToURL
module.exports.get_cuser = get_cuser
module.exports.get_now = get_now
