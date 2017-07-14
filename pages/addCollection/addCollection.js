/**
 * 新增/编辑梦想录页
 */
// 应用实例
var app = getApp();
// 配置
var globalVars = require('../../utils/globalVars');
// 图片上传组件
var $uploadFile = require('../../utils/alioss/uploadFile');
// 页面数据
var pageData = {
  userInfo: null,
  coverImgTempPath: '',
  coverImgUrl: '',
  title: '',
  desc: '',
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
    app.getUserInfo(function(userInfo) {
      _this.setData({
        userInfo: userInfo
      });
    });

    console.log('query, ', options.query);
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
  doUploadCover: function(filePath, callback) {
    if(!filePath) {
      return;
    }
    $uploadFile({
      filePath: filePath,
      callback: function(res) {
        if(callback) {
          callback(res);
        }
      }
    });
  },
  // 提交表单
  onSubmitForm: function(e) {
    var _this = this;
    var formVal = e.detail.value;
    var reqData = {
      uid: app.globalData.userInfo.id,
      sessionId: wx.getStorageSync('sessionId'),
      title: formVal.title,
      desc: formVal.desc,
      coverUrl: ''
    };
    var coverImgTempPath = this.data.coverImgTempPath;
    if (this.data.reqLock) {
      return;
    }
    this.setData({
      reqLock: true
    });

    if(coverImgTempPath) {
      // 有图片，上传图片
      _this.doUploadCover(coverImgTempPath, function(res) {
        if(res.code == 200) {
          reqData.coverUrl = res.data;
          _this.reqAddCollectionApi(reqData);
        }else {
          
        }
      });
    }else {
      _this.reqAddCollectionApi(reqData);
    }
  },
  // 请求新增梦想录接口
  reqAddCollectionApi: function(data) {
    var _this = this;
    wx.request({
      url: globalVars.apiDomain + '/api/collection/add',
      method: 'POST',
      data: data,
      success: function (res) {
        res = res.data;
        if (res.code == 200) {
          wx.showToast({
            title: '创建成功',
          });
        } else {

        }
      },
      complete: function() {
        _this.setData({
          reqLock: false
        });
      },
      fail: function() {

      }
    });
  },
  // 请求更新梦想录接口
  reqUpdateCollectionApi: function (data, callback) {

  },
  // 请求梦想录详情接口
  reqCollectionDetailApi: function() {

  }
});