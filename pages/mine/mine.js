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
    order: 'create_time'
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
  ossDomain: globalVars.aliyun.ossDomain,
  imgRule: globalVars.imgRule
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
      // 初始化数据
      _this.initData();
    });
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
  // 初始化数据
  initData: function() {
    var userInfo = this.data.userInfo;
    if(userInfo) {
      this.data.diaryListParams.uid = userInfo.id;
      this.data.collectionListParams.uid = userInfo.id;
      this.renderDiaryList();
    }
  },
  // 点击登录
  onTapWxLogin: function(e) {
    var _this = this;

    app.onTapWxLogin(function(userInfo) {
      _this.setData({
        userInfo: userInfo
      });
      // 初始化数据
      _this.initData();
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
  // touchStart事件，判断是tap 还是 longtap
  onTouchStart: function(e) {
    this.setData({
      touchStartTime: Date.now()
    });
  },
  // 点击梦想录，进入梦想录详情页
  onTapCollection: function (e) {
    var timeDiff = Date.now() - this.data.touchStartTime;
    if (timeDiff >= 200) {
      return;
    }
    wx.navigateTo({
      url: app.globalData.pageUrl.collectionDetail
    });
  },
  // 长按梦想录，提供选项，编辑、删除
  onLongTapCollection: function(e) {
    var _this = this;
    var itemData = e.currentTarget.dataset;
    // 梦想录信息
    var itemId = itemData.itemid;
    var itemTitle = itemData.itemtitle;
    var itemIndex = itemData.itemindex;
    // 用户信息
    var userInfo = this.data.userInfo;

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
          wx.showModal({
            title: '删除梦想录',
            content: '确认删除梦想录《' + itemTitle +'》吗？',
            confirmColor: '#f00',
            success: function(res) {
              if(res.confirm) {
                // 确认按钮
                _this.doDelCollection(itemId, itemIndex);
              }
            }
          });
        }
      }
    });
  },
  // 点击轨迹选项
  onTapDiaryOption: function(e) {
    var _this = this;
    var itemData = e.currentTarget.dataset;
    // 轨迹信息
    var itemId = itemData.itemid;
    var itemIndex = itemData.itemindex;

    // 选项菜单
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor: '#f00',
      success: function(res) {
        var tapIndex = res.tapIndex;
        if(tapIndex == 0) {
          // 删除
          wx.showModal({
            title: '删除轨迹',
            content: '确认删除该条内容吗？',
            confirmColor: '#f00',
            success: function (res) {
              if (res.confirm) {
                // 确认按钮
                _this.doDelDiary(itemId, itemIndex);
              }
            }
          });
        }
      }
    });
  },
  // 图片预览
  onPreviewImg: function(e) {
    console.log(e);
    var data = e.currentTarget.dataset;
    wx.previewImage({
      urls: data.imgurls,
      current: data.curimg
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
  // 删除梦想录
  doDelCollection: function(itemId, itemIndex) {
    var _this = this;
    var collectionList = this.data.collectionList;
    // 请求数据
    var reqData = {
      id: itemId,
      uid: this.data.userInfo.id,
      sessionId: wx.getStorageSync('sessionId')
    };
    // 请求接口
    this.reqDelCollectionApi(reqData, function (res) {
      var code = res.code;
      if(code == 200) {
        wx.showToast({
          title: '删除成功~'
        });
        // 删除列表中数据
        collectionList.splice(itemIndex, 1);
        _this.setData({
          collectionList: collectionList
        });
      }
    });
  },
  // 删除轨迹
  doDelDiary: function(itemId, itemIndex) {
    var _this = this;
    var diaryList = this.data.diaryList;
    // 请求数据
    var reqData = {
      id: itemId,
      uid: this.data.userInfo.id,
      sessionId: wx.getStorageSync('sessionId')
    };
    // 请求接口
    this.reqDelDiaryApi(reqData, function (res) {
      var code = res.code;
      if (code == 200) {
        wx.showToast({
          title: '删除成功~'
        });
        // 删除列表中数据
        diaryList.splice(itemIndex, 1);
        _this.setData({
          diaryList: diaryList
        });
      }
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
        setTimeout(function() {
          wx.stopPullDownRefresh();
        }, 500);
      }
    });
  },
  // 处理轨迹列表数据
  checkDiaryListData: function(data) {
    if(!data) {
      return;
    }
    var i = 0, j = 0;
    for(i=0; i<data.length; i++) {
      data[i].imgArr = data[i].img_url.split(',');
      data[i].timeline = $getDateDiff((new Date(data[i].create_time)).getTime())
      for (j=0; j<data[i].imgArr.length; j++) {
        data[i].imgArr[j] = globalVars.aliyun.ossDomain + '/' + data[i].imgArr[j];
      }
    }

    return data;
  },
  // 请求删除梦想录接口
  reqDelCollectionApi: function(reqData, callback) {
    wx.showLoading({
      title: '删除中...'
    });
    wx.request({
      url: globalVars.apiDomain + '/api/collection/del',
      method: 'POST',
      data: reqData,
      success: function(res) {
        if(callback) {
          callback(res.data);
        }
      },
      complete: function() {
        wx.hideLoading();
      },
      fail: function() {}
    });
  },
  // 请求删除轨迹接口
  reqDelDiaryApi: function(reqData, callback) {
    wx.showLoading({
      title: '删除中...'
    });
    wx.request({
      url: globalVars.apiDomain + '/api/diary/del',
      method: 'POST',
      data: reqData,
      success: function (res) {
        if (callback) {
          callback(res.data);
        }
      },
      complete: function () {
        wx.hideLoading();
      },
      fail: function () { }
    });
  }
});
