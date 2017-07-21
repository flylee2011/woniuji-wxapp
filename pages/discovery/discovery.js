/**
 * 发现页
 */
// 获取应用实例
var app = getApp();
// 配置
var globalVars = require('../../utils/globalVars');

// 数据
var pageData = {
  // 用户信息
  userInfo: null,
  // 列表数据，榜单轨迹、关注轨迹、梦想录、梦想家
  listData: [
    [], [], [], []
  ],
  listParams: [
    {
      page: 1,
      pageSize: globalVars.listPageSize,
      order: 'like_count'
    },
    {
      page: 1,
      pageSize: globalVars.listPageSize,
      order: 'create_time'
    },
    {
      page: 1,
      pageSize: 15,
      order: 'update_time'
    },
    {
      page: 1,
      pageSize: globalVars.listPageSize,
      order: 'update_time'
    }
  ],
  listLock: [
    false, false, false, false
  ],
  listDone: [
    false, false, false, false
  ],

  // // 榜单轨迹列表
  // hotDiaryList: [],
  // hotDiaryListParams: {
  //   page: 1,
  //   pageSize: globalVars.listPageSize,
  //   order: 'like_count'
  // },
  // hotDiaryListLock: false,
  // hotDiaryListDone: false,
  // // 关注轨迹列表
  // followDiaryList: [],
  // // 梦想录列表
  // collectionList: [],
  // collectionListParams: {
  //   page: 1,
  //   pageSize: 15
  // },
  // collectionListLock: false,
  // collectionListDone: false,
  // // 梦想家列表
  // peopleList: [],
  // peopleListParams: {
  //   page: 1,
  //   pageSize: 20
  // },
  // peopleListLock: false,
  // peopleListDone: false,
  // 当前 tab 位置
  curTabIndex: 0,
  tabStyle: ['active', '', '', '']
};

// 注册页面
Page({
  data: pageData,
  // 页面加载
  onLoad: function () {
    var _this = this;

    // 获取用户数据
    app.getUserInfo(function (userInfo) {
      _this.setData({
        userInfo: userInfo
      });
    });
    // 初始化数据
    this.initData();
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
  // 初始化数据
  initData: function() {

  },
  // 加载列表
  loadList: function() {
    var curTabIndex = this.data.curTabIndex;
    this.reqListApi(curTabIndex, function(res) {
      var code = res.code;
      if(code == 200) {
        // 列表数据
      }
    });
  },
  // // 加载梦想录列表
  // loadCollectionList: function() {

  // },
  // // 加载用户列表
  // loadPeopleList: function() {

  // },
  // 请求列表接口
  reqListApi: function(tabIndex, callback) {
    var _this = this;
    var lock = this.data.listLock[tabIndex];
    if(lock) {
      return;
    }
    // var lockData = 'listLock['+ tabIndex +']';
    // this.setData({
    //   'listLock['+ tabIndex + ']': true
    // });
    // 请求接口
    wx.request({
      url: '',
      data: reqData,
      success: function(res) {

      },
      complete: function() {

      }
    });
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
