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
  // 用户数据
  userInfo: null,
  // 梦想录 id，编辑时用
  collectionId: 0,
  // 封面图
  localCoverImgUrl: '',
  uploadCoverImgUrl: '',
  // 标题
  title: '',
  // 简介
  desc: '',
  // oss 域名
  ossDomain: globalVars.aliyun.ossDomain,
  // 请求锁
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
  onLoad: function (option) {
    var _this = this;
    // 获取用户数据
    app.getUserInfo(function(userInfo) {
      _this.setData({
        userInfo: userInfo
      });
    });

    var collectionId = option.itemid;
    this.setData({
      collectionId: collectionId ? collectionId : 0
    });
    if (collectionId) {
      // 编辑页面
      // 渲染梦想录信息
      this.renderCollectionDetail();
    }
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
          localCoverImgUrl: res.tempFilePaths[0]
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
    // 表单数据
    var formVal = e.detail.value;
    // 本地图片
    var localCoverImgUrl = this.data.localCoverImgUrl;
    // 请求接口数据
    var reqData = {
      uid: app.globalData.userInfo.id,
      sessionId: wx.getStorageSync('sessionId'),
      title: formVal.title,
      desc: formVal.desc,
      coverUrl: ''
    };
    if (this.data.uploadCoverImgUrl) {
      // 如果是编辑页，有封面图片线上地址
      reqData.coverUrl = this.data.uploadCoverImgUrl.replace(globalVars.aliyun.ossDomain + '/', '');
    }
    
    if (this.data.reqLock) {
      return;
    }
    this.setData({
      reqLock: true
    });

    if (localCoverImgUrl) {
      // 有图片，上传图片
      _this.doUploadCover(localCoverImgUrl, function(res) {
        if(res.code == 200) {
          reqData.coverUrl = res.data;
          _this.doSubmit(reqData);
        } else {
          
        }
      });
    } else {
      _this.doSubmit(reqData);
    }
  },
  doSubmit: function(reqData) {
    var collectionId = this.data.collectionId;
    if(collectionId) {
      // 编辑页面
      reqData.id = collectionId;
      this.reqUpdateCollectionApi(reqData);
    } else {
      // 新增页面
      this.reqAddCollectionApi(reqData);
    }
  },
  // 渲染梦想录信息
  renderCollectionDetail: function() {
    var _this = this;
    // 请求接口
    this.reqCollectionDetailApi(function(res) {
      var code = res.code;
      var data = res.data;
      if(code == 200) {
        _this.setData({
          uploadCoverImgUrl: globalVars.aliyun.ossDomain + '/' + data.cover_url,
          title: data.title,
          desc: data.description
        });
      }
    });
  },
  // 请求梦想录详情接口
  reqCollectionDetailApi: function (callback) {
    var reqData = {
      id: this.data.collectionId
    };
    wx.request({
      url: globalVars.apiDomain + '/api/collection/detail',
      data: reqData,
      success: function (res) {
        if (callback) {
          callback(res.data);
        }
      }
    });
  },
  // 请求新增梦想录接口
  reqAddCollectionApi: function(reqData) {
    var _this = this;
    wx.request({
      url: globalVars.apiDomain + '/api/collection/add',
      method: 'POST',
      data: reqData,
      success: function (res) {
        res = res.data;
        if (res.code == 200) {
          wx.showToast({
            title: '创建成功',
          });
          setTimeout(function() {
            wx.navigateBack();
          }, 2000);
        } else {
          wx.showModal({
            title: '出错啦~',
            content: '错误码: ' + res.code
          });
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
  reqUpdateCollectionApi: function(reqData, callback) {
    var _this = this;
    wx.request({
      url: globalVars.apiDomain + '/api/collection/update',
      method: 'POST',
      data: reqData,
      success: function(res) {
        res = res.data;
        if (res.code == 200) {
          wx.showToast({
            title: '更新成功',
          });
          setTimeout(function () {
            wx.navigateBack();
          }, 2000);
        } else {
          wx.showModal({
            title: '出错啦~',
            content: '错误码: ' + res.code
          });
        }
      },
      complete: function () {
        _this.setData({
          reqLock: false
        });
      },
      fail: function () {
        
      }
    });
  }
});