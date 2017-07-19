/**
 * app 入口
 */
var globalVars = require('./utils/globalVars');

App({
  // 初始化
  onLaunch: function() {
    // 登录流程
    this.initWxLogin();
  },

  // 自定义方法
  // 微信登录流程
  initWxLogin: function() {
    var _this = this;

    // 判断是否有 session
    var sessionId = wx.getStorageSync('sessionId');
    if (!sessionId) {
      this.doWxLogin();
      return;
    }
    // 检测登录态时效性
    wx.checkSession({
      success: function () {
        // 登录态有效
      },
      fail: function () {
        // 登录态过期，需要重新登录
        _this.doWxLogin();
      }
    });
  },
  // 调用微信登录接口，获取登录凭证code和session
  doWxLogin: function (callback) {
    var _this = this;

    wx.login({
      success: function (res) {
        var code = res.code;
        // 请求微信登录接口获取session
        wx.request({
          url: globalVars.apiDomain + '/api/user/wxapp_login',
          data: {
            code: code
          },
          success: function (res) {
            res = res.data;
            var code = res.code;
            if(code == 200) {
              // 成功
              // 在本地存储保存 session 信息
              wx.setStorageSync('sessionId', res.data.sessionId);
              if(callback) {
                callback();
              }
            }
          },
          fail: function() {
            console.log('req wxapp_login api fail');
          }
        });
      },
      fail: function () {},
      complete: function () {}
    });
  },
  // 获取用户信息，在对应的 page 调用
  getUserInfo: function(cb) {
    var _this = this;
    if (this.globalData.userInfo) {
      // 全局数据有用户信息
      typeof cb == "function" && cb(this.globalData.userInfo);
    } else {
      // 全局数据没有用户信息
      wx.getUserInfo({
        withCredentials: true,
        success: function(res) {
          var sessionId = wx.getStorageSync('sessionId');
          // 判断是否有客户端 session
          // 如果没有，需要走 wx.login 流程
          // 如果有，走自动注册
          if (!sessionId) {
            console.log('no sessionId');
            _this.doWxLogin(function() {
              _this.doWxappAutoreg(res, function() {
                typeof cb == "function" && cb(_this.globalData.userInfo);
              });
            });
          }else {
            _this.doWxappAutoreg(res, function () {
              typeof cb == "function" && cb(_this.globalData.userInfo);
            });
          }
        },
        fail: function() {}
      });
    }
  },
  // 自动注册
  // 没有用户自动注册，有用户返回用户信息
  doWxappAutoreg: function(data, callback) {
    var _this = this;
    // 请求数据，需要解密
    var reqData = {
      encryptedData: data.encryptedData,
      iv: data.iv,
      sessionId: wx.getStorageSync('sessionId')
    };
    // 调用户接口
    wx.request({
      url: globalVars.apiDomain + '/api/user/wxapp_autoreg',
      data: reqData,
      success: function (res) {
        res = res.data;
        var code = res.code;
        if (code == 200) {
          // 保存用户信息到全局数据字段
          _this.globalData.userInfo = res.data;
        }
      },
      complete: function() {
        if(callback) {
          callback();
        }
      }
    });
  },

  // 点击登录按钮，供需要的 page 调用
  onTapWxLogin: function(callback) {
    wx.showLoading({
      title: '登录中...',
    });
    // 获取用户数据
    this.getUserInfo(function (userInfo) {
      wx.hideLoading();
      if(callback) {
        callback(userInfo);
      }
    });
  },

  // 全局数据
  globalData: {
    // 用户数据
    userInfo: null,
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
      // 设置页
      setting: '/pages/setting/setting',
      // 编辑基础资料
      editInfo: '/pages/editInfo/editInfo',
      // 问题反馈
      feedback: '/pages/feedback/feedback',
      // 新建梦境
      addBottle: '/pages/addBottle/addBottle'
    }
  }
});
