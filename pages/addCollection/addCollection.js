/**
 * 新增/编辑梦想录页
 */
// 应用实例
var app = getApp();
// 配置
var globalVars = require('../../utils/globalVars');
// 页面数据
var pageData = {
  coverImgTempPath: '',
  coverImgUrl: '',
  title: '',
  desc: ''
};
// 图片上传组件
var $uploadFile = require('../../utils/alioss/uploadFile');

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

    if(!app.globalData.userInfo) {
      // 需要登录
      console.log('need login');
    }

    console.log('query, ', options.query);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  // 自定义
  // 点击选择封面图
  onTapCover: function() {
    var _this = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      success: function(res) {
        _this.setData({
          coverImgTempPath: res.tempFilePaths[0]
        });
      }
    });
  },
  // 上传封面图
  doUploadCover: function(filePath) {
    $uploadFile({
      filePath: filePath,
      callback: function(res) {
        console.log(res);
      }
    });
  },
  // 提交表单
  onSubmitForm: function(e) {
    console.log(e.detail.value);

    var formVal = e.detail.value;
    var reqData = {
      uid: app.globalData.userInfo.id,
      sessionId: wx.getStorageSync('sessionId'),
      title: formVal.title,
      desc: formVal.desc
    };
    wx.request({
      url: globalVars.apiDomain + '/api/collection/add',
      method: 'POST',
      data: reqData,
      success: function(res) {
        console.log(res);
      }
    });
  }
});