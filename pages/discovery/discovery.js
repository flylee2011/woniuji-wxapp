// 获取应用实例
var app = getApp();

// 数据
var pageData = {
  userInfo: {},
  diaryList: [{}, {}, {}]
};

// 注册页面
Page({
  data: pageData,
  // 页面加载
  onLoad: function () {
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
    });
  },
  // 初次渲染完成
  onReady: function () {
    
  },
  // 分享
  onShareAppMessage: function () {
    return {
      title: app.globalData.shareTitle
    }
  }
});
