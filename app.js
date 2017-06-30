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
          // console.log('userinfo,', res);
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
    // 微信用户数据
    userInfo: null,
    // 接口域名
    apiDomainDebug: 'http://local.woniuji.cn',
    apiDomain: 'https://woniuji.cn',
    // oss 域名
    ossDomain: 'http://woniuji.oss-cn-beijing.aliyuncs.com',
    // 页面 url
    pageUrl: {
      // tabbar 页
      // 首页
      index: '/pages/index/index',
      // 发现
      discovery: '/pages/discovery/discovery',
      // 写轨迹
      publish: '/pages/publish/publish',
      // 梦境列表
      bottle: '/pages/bottle/bottle',
      // 我的
      mine: '/pages/mine/mine',
      // 新建梦想录
      addCollection: '/pages/addCollection/addCollection',
      // 梦想录详情
      collectionDetail: '/pages/collectionDetail/collectionDetail',
      // 评论列表
      commentList: '/pages/commentList/commentList',
      // 关注/粉丝
      followList: '/pages/followList/followList',
      // 编辑基础资料
      editInfo: '/pages/editInfo/editInfo',
      // 问题反馈
      feedback: '/pages/feedback/feedback',
      // 新建梦境
      addBottle: '/pages/addBottle/addBottle'
    },
    // 分享数据
    shareTitle: '蜗牛记-让世界看到你的坚持'
  }
});
