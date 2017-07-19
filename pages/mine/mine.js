/**
 * 我的页
 */

// 获取应用实例
var app = getApp();
var globalVars = require('../../utils/globalVars');
var $getDateDiff = require('../../utils/getDateDiff');

// 页面数据
var pageData = {
  // 用户信息
  userInfo: null,
  // 默认用户封面图
  userDefaultCover: 'http://woniuji.oss-cn-beijing.aliyuncs.com/assets/user_cover_1.jpg',
  // 默认梦想录封面图
  collectionDefaultCover: '',
  // 轨迹列表
  diaryList: [],
  diaryListParams: {
    page: 1,
    pageSize: globalVars.listPageSize,
    order: 'update_time'
  },
  diaryListDone: false,
  // 梦想录列表
  collectionList: [],
  collectionListParams: {
    page: 1,
    pageSize: 1000,
    order: 'update_time'
  },
  collectionListDone: false,
  // tab 位置
  curTabIndex: 1,
  ossDomain: globalVars.aliyun.ossDomain
};

// 注册页面
Page({
  data: pageData,
  // 页面加载
  onLoad: function () {
    var _this = this;
    // 获取用户数据
    app.getUserInfo(function(userInfo) {
      _this.setData({
        userInfo: userInfo
      });

      if(userInfo) {
        // 已登录，初始化列表
        _this.data.diaryListParams.uid = userInfo.id;
        _this.data.collectionListParams.uid = userInfo.id;
        _this.renderDiaryList();
      }
    });
  },
  // 初次渲染完成
  onReady: function() {

  },
  // 分享
  onShareAppMessage: function() {
    return {
      title: globalVars.shareTitle
    }
  },
  // 页面滚动到底部，加载列表
  onReachBottom: function() {
    var curTabIndex = this.data.curTabIndex;
    var diaryListDone = this.data.diaryListDone;
    if(!diaryListDone && curTabIndex == 1) {
      // 轨迹列表
      this.renderDiaryList();
    }
  },
  // 下拉刷新
  onPullDownRefresh: function() {
    var curTabIndex = this.data.curTabIndex;
    this.resetListData();
    if(curTabIndex == 1) {
      // 轨迹列表
      this.renderDiaryList();
    } else {
      // 梦想录列表
      this.renderCollectionList();
    }
  },

  // 自定义
  // 点击登录
  onTapWxLogin: function(e) {
    var _this = this;

    app.onTapWxLogin(function(userInfo) {
      _this.setData({
        userInfo: userInfo
      });
    });
  },
  // 切换 tab
  onToggleTab: function(e) {
    var targetTabIndex = e.currentTarget.dataset.tabindex;
    if(targetTabIndex == this.data.curTabIndex) {
      return;
    }
    this.setData({
      curTabIndex: targetTabIndex
    });
    if(targetTabIndex == 1) {
      // 轨迹列表
      this.renderDiaryList();
    } else {
      // 梦想录列表
      this.renderCollectionList();
    }
  },
  // 点击用户昵称和头像
  onTapUser: function(e) {

  },
  // 点击评论
  onTapComment: function(e) {
    wx.navigateTo({
      url: app.globalData.pageUrl.commentList
    });
  },
  // 点击赞
  onTapLike: function(e) {
    console.log(e);
  },
  // 点击梦想录
  onTapCollection: function(e) {
    wx.navigateTo({
      url: app.globalData.pageUrl.collectionDetail
    });
  },
  // 点击新增梦想录
  onTapAddCollection: function(e) {
    wx.navigateTo({
      url: app.globalData.pageUrl.addCollection
    });
  },
  // 点击设置
  onTapSetting: function(e) {
    wx.navigateTo({
      url: app.globalData.pageUrl.setting
    });
  },
  // 点击新建轨迹
  onTapAddDiary: function() {
    wx.switchTab({
      url: app.globalData.pageUrl.publish
    });
  },
  // 点击新建梦想录
  onTapAddCollection: function() {
    wx.navigateTo({
      url: app.globalData.pageUrl.addCollection
    });
  },
  // 长按梦想录，提供选项，编辑、删除
  onLongTapCollection: function(e) {
    // 梦想录 id
    var itemId = e.currentTarget.dataset.itemid;
    // 选项菜单
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: function(res) {
        var tapIndex = res.tapIndex;
        if (tapIndex == 0) {
          // 编辑
          wx.navigateTo({
            url: app.globalData.pageUrl.addCollection + '?itemid=' + itemId
          });
        } else if(tapIndex == 1) {
          // 删除
        }
      }
    });
  },

  // 渲染轨迹列表
  renderDiaryList: function() {
    var _this = this;
    // 请求接口
    this.reqDiaryListApi(function (res) {
      var code = res.code;
      var data = res.data;
      var diaryListParams = _this.data.diaryListParams;
      if (code == 200) {
        // 成功
        var totalPage = Math.ceil(data.total_count / diaryListParams.pageSize);
        var newList = _this.checkDiaryListData(data.list);
        var originList = _this.data.diaryList;
        // 更新数据
        _this.setData({
          diaryList: diaryListParams.page == 1 ? newList : originList.concat(newList),
          diaryListDone: (diaryListParams.page >= totalPage ? true : false),
          'diaryListParams.page': (diaryListParams.page >= totalPage ? diaryListParams.page : diaryListParams.page + 1)
        });
      }
    });
  },
  // 渲染梦想录列表
  renderCollectionList: function() {
    var _this = this;
    // 请求接口
    this.reqCollectionListApi(function (res) {
      var code = res.code;
      var data = res.data;
      if (code == 200) {
        // 成功
        // 更新数据
        _this.setData({
          collectionList: data.list,
          collectionListDone: true
        });
      }
    });
  },
  // 重置数据
  resetListData: function() {
    this.setData({
      'diaryListParams.page': 1
    });
  },
  // 请求轨迹列表接口
  reqDiaryListApi: function(callback) {
    var reqData = this.data.diaryListParams;
    wx.request({
      url: globalVars.apiDomain + '/api/diary/list',
      data: reqData,
      success: function(res) {
        if(callback) {
          callback(res.data);
        }
      },
      complete: function() {
        setTimeout(function() {
          wx.stopPullDownRefresh();
        }, 500);
      }
    });
  },
  // 请求梦想录列表接口
  reqCollectionListApi: function(callback) {
    var reqData = this.data.collectionListParams;
    wx.request({
      url: globalVars.apiDomain + '/api/collection/list',
      data: reqData,
      success: function (res) {
        if(callback) {
          callback(res.data);
        }
      },
      complete: function () {
        wx.stopPullDownRefresh();
      }
    });
  },
  // 处理轨迹列表数据
  checkDiaryListData: function(data) {
    if(!data) {
      return;
    }
    var i = 0;
    for(i=0; i<data.length; i++) {
      data[i].imgArr = data[i].img_url.split(',');
      data[i].timeline = $getDateDiff((new Date(data[i].create_time)).getTime())
    }

    return data;
  }
});
