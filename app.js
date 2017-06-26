// app.js
App({
  // 初始化
  onLaunch: function() {
    // 调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  // app 显示
  onShow: function() {
    console.log('app show');
  },
  // app 隐藏
  onHide: function() {
    console.log('app hide');
  },
  // 错误监听
  onError: function() {
    console.log('app error');
  },
  // 自定义方法
  // 获取微信用户数据
  getUserInfo: function(cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          console.log('userinfo,', res);
          that.globalData.userInfo = res.userInfo
          typeof cb == "function" && cb(that.globalData.userInfo)
        }
      })
    }
  },
  // 全局数据
  globalData: {
    // 调试
    debug: true,
    userInfo: null,
    // 接口域名
    apiDomainDebug: 'http://local.woniuji.cn',
    apiDomain: 'https://woniuji.cn',
    // 分享数据
    shareTitle: '蜗牛记-让世界看到你的坚持'
  }
});
