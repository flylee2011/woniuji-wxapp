/**
 * 首页
 */

// 获取应用实例
var app = getApp();

// 数据
var pageData = {
  userInfo: null,
  diaryList: [{}, {}, {}],
  diarySetsList: [{
    coverUrl: 'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png'
  }, {
    coverUrl: 'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png'
  }, {
    coverUrl: 'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png'
  }, {
    coverUrl: 'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png'
  }, {
    coverUrl: 'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png'
  }],
  curTabIndex: 1
};

// 注册页面
Page({
  data: pageData,
  // 页面加载
  onLoad: function () {
    var that = this;
    // 获取微信用户数据
    app.getUserInfo(function(userInfo){
      that.setData({
        userInfo:userInfo
      });
    });
  },
  // 初次渲染完成
  onReady: function() {

  },
  // 分享
  onShareAppMessage: function() {
    return {
      title: app.globalData.shareTitle
    }
  },
  // 自定义
  // 切换 tab
  onToggleTab: function(e) {
    var curTabIndex = e.currentTarget.dataset.tabindex;
    this.setData({
      curTabIndex: curTabIndex
    });
  },
  // 点击用户昵称和头像
  onClickUser: function(e) {

  },
  // 点击评论
  onClickComment: function(e) {
    wx.navigateTo({
      url: app.globalData.pageUrl.commentList
    });
  },
  // 点击赞
  onClickLike: function(e) {
    console.log(e);
  },
  // 点击梦想录
  onClickCollection: function(e) {
    wx.navigateTo({
      url: app.globalData.pageUrl.collectionDetail
    });
  },
  // 点击新增梦想录
  onClickAddCollection: function(e) {
    wx.navigateTo({
      url: app.globalData.pageUrl.addCollection
    });
  }
});
