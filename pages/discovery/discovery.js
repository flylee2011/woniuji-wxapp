/**
 * 发现页
 */
// 获取应用实例
var app = getApp();
var globalVars = require('../../utils/globalVars');

// 数据
var pageData = {
  userInfo: null,
  // 关注轨迹列表
  followDiaryList: [],
  // 榜单列表
  hotDiaryList: [],
  // 梦想录列表
  collectionList: [],
  // 梦想家列表
  peopleList: [],
  // 当前 tab 位置
  curTabIndex: 0,
  tabStyle: ['active', '', '', '']
};

// 注册页面
Page({
  data: pageData,
  // 页面加载
  onLoad: function () {
    var that = this;
    // 获取用户数据
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      });
    });

    // 测试数据
    this.setData({
      followDiaryList: [
        {
          itemid: 1,
          nickname: '三年二胎周杰伦',
          avatar: 'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png',
          timeline: '1小时前',
          pic: [
            'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png'
          ],
          content: '如果你无法简洁的表达你的想法，那只说明你还不够了解它。-- 阿尔伯特·爱因斯坦',
          collectionName: '梦想录 xxx',
          collectionId: 1
        }
      ]
    });
  },
  // 初次渲染完成
  onReady: function () {
    
  },
  // 分享
  onShareAppMessage: function () {
    return {
      title: globalVars.shareTitle
    }
  },

  // 自定义
  // 切换 tab 栏
  toggleTab: function(e) {
    var curTabIndex = e.currentTarget.dataset.tabindex;
    this.setData({
      curTabIndex: curTabIndex,
      tabStyle: ['', '', '', '']
    });
    switch(curTabIndex) {
      case '0':
        this.setData({
          'tabStyle[0]': 'active'
        });
        break;
      case '1':
        this.setData({
          'tabStyle[1]': 'active'
        });
        break;
      case '2':
        this.setData({
          'tabStyle[2]': 'active'
        });
        break;
      case '3':
        this.setData({
          'tabStyle[3]': 'active'
        });
        break;
    }
  },
  // 点击梦想录
  onClickCollection: function(e) {
    wx.navigateTo({
      url: app.globalData.pageUrl.collectionDetail
    });
  },
  // 点击评论
  onClickComment: function(e) {
    wx.navigateTo({
      url: app.globalData.pageUrl.commentList
    });
  },
  // 点击赞
  onClickLike: function(e) {}
});
