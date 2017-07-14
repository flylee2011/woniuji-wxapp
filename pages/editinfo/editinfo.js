/**
 * 编辑基础资料页
 */
// 获取应用实例
var app = getApp();
// 配置
var globalVars = require('../../utils/globalVars');
// 页面数据
var pageData = {
  userInfo: null,
  genderList: ['保密', '男', '女'],
  curGenderIndex: 0,
  reqLock: false
};

Page({
  /**
   * 页面的初始数据
   */
  data: pageData,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    // 获取用户数据
    app.getUserInfo(function (userInfo) {
      _this.setData({
        userInfo: userInfo,
        curGenderIndex: userInfo.gender
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  // 自定义
  // 提交表单
  onSubmitForm: function(e) {
    var _this = this;
    var userInfo = this.data.userInfo;
    var formVal = e.detail.value;
    // 请求数据
    var reqData = {
      sessionId: wx.getStorageSync('sessionId'),
      uid: userInfo.id,
      nickname: formVal.nickname,
      gender: formVal.gender,
      motto: formVal.motto
    };
    this.reqUpdateUserInfoApi(reqData, function(res) {
      var code = res.code;
      if(code == 200) {
        wx.showToast({
          title: '修改成功'
        });
        app.globalData.userInfo.nickname = reqData.nickname;
        app.globalData.userInfo.gender = reqData.gender;
        app.globalData.userInfo.motto = reqData.motto;
        setTimeout(function() {
          wx.switchTab({
            url: app.globalData.pageUrl.mine
          });
        }, 1500);
      }else {
        wx.showToast({
          title: '修改失败'
        });
      }
    });
  },
  // 请求更新用户信息接口
  reqUpdateUserInfoApi: function(data, callback) {
    var _this = this;
    if(this.data.reqLock) {
      return;
    }
    this.setData({
      reqLock: true
    });
    wx.request({
      url: globalVars.apiDomain + '/api/user/update_userinfo',
      method: 'POST',
      data: data,
      success: function(res) {
        if(callback) {
          callback(res.data);
        }
      },
      complete: function() {
        _this.setData({
          reqLock: false
        });
      },
      fail: function(res) {
        wx.showToast({
          title: '系统繁忙'
        });
      }
    });
  }
});