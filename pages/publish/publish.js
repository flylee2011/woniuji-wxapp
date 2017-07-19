/**
 * 发布轨迹页
 */
// 获取应用实例
var app = getApp();
// 配置
var globalVars = require('../../utils/globalVars');
// 上传组件
var uploadFile = require('../../utils/alioss/uploadFile');

// 页面数据
var pageData = {
  // 用户信息
  userInfo: null,
  // 加载锁
  loadingLock: true,
  // 梦想录列表信息
  collectionList: [],
  curCollectionIndex: 0,
  // 上传图片
  localImgArr: [],
  uploadImgArr: [],
  maxImgCount: 3,
  ossDomain: globalVars.aliyun.ossDomain,
  // 正文内容
  content: '',
  // 请求锁
  uploadLock: false,
  submitFormLock: false
};

// 注册页面
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
    // 获取用户信息
    app.getUserInfo(function(userInfo) {
      _this.setData({
        userInfo: userInfo
      });
      if(userInfo) {
        _this.getCollecionInfo();
      }else {
        // TODO CODE
        // 未登录
      }
    });
  },

  // 自定义
  // 创建梦想录入口
  onTapAddCollection: function() {
    wx.redirectTo({
      url: app.globalData.pageUrl.addCollection
    });
  },
  // 梦想录选择事件
  onChangeDiaryPicker: function(e) {
    var curIndex = e.detail.value;
    this.setData({
      curCollectionIndex: curIndex
    });
  },
  // 点击选择图片
  onTapAddImg: function(e) {
    var _this = this;

    // 图片选择
    wx.chooseImage({
      count: 3,
      success: function(res) {
        var tempFileArr = res.tempFilePaths;
        _this.setData({
          localImgArr: _this.data.localImgArr.concat(tempFileArr)
        });
      }
    });
  },
  // 点击图片执行操作
  onTapImg: function(e) {
    var _this = this;
    // 图片下标
    var itemIndex = e.currentTarget.dataset.itemindex;
    // 图片数据
    var imgArr = this.data.localImgArr;

    // 操作
    wx.showActionSheet({
      itemList: ['删除'],
      itemColor: '#ff0000',
      success: function(res) {
        var tapIndex = res.tapIndex;
        if (tapIndex == 0) {
          // 删除
          imgArr.splice(itemIndex, 1);
          _this.setData({
            localImgArr: imgArr
          });
        }
      }
    });
  },
  // 提交表单
  onSubmitPublishForm: function(e) {
    var _this = this;
    var formVal = e.detail.value;
    var localImgArr = this.data.localImgArr;

    if(!formVal.content && !localImgArr.length) {
      // 检查内容
      wx.showModal({
        title: '错误',
        content: '什么都不写？',
      });
      return;
    }

    this.setData({
      content: formVal.content
    });
    if (localImgArr.length) {
      // 上传图片
      this.doUploadFile(localImgArr, function() {
        // 执行新增轨迹
        _this.doAddDiary();
      });
    } else {
      // 执行新增轨迹
      _this.doAddDiary();
    }
  },
  // 图片上传
  doUploadFile: function (localImgArr, callback) {
    var _this = this;
    var img = localImgArr.shift();
    this.setData({
      uploadLock: true
    });

    uploadFile({
      filePath: img,
      callback: function (res) {
        // TODO CODE
        // 失败状态处理

        // 线上图片数据
        _this.setData({
          uploadImgArr: _this.data.uploadImgArr.concat([res.data]),
          uploadLock: localImgArr.length > 0 ? true : false
        });

        if (localImgArr.length > 0) {
          _this.doUploadFile(localImgArr, callback);
        } else {
          // 图片上传完毕
          if (callback) {
            callback();
          }
        }
      }
    });
  },
  // 新增轨迹
  doAddDiary: function() {
    this.reqAddDiaryApi(function(res) {
      var code = res.code;
      if(code == 200) {
        wx.showToast({
          title: '创建成功',
        });
        setTimeout(function () {
          wx.switchTab({
            url: app.globalData.pageUrl.mine,
          });
        }, 2000);
      } else {
        // TODO CODE
        // 错误处理
      }
    });
  },
  // 获取梦想录信息
  getCollecionInfo: function() {
    var _this = this;
    wx.showLoading({
      title: '加载中'
    });
    this.reqCollectionListApi(function(res) {
      var code = res.code;
      if(code == 200) {
        _this.setData({
          collectionList: res.data.list
        });
      }
    });
  },
  // 请求梦想录列表接口
  reqCollectionListApi: function(callback) {
    var _this = this;
    var userInfo = this.data.userInfo;
    // 参数
    var reqData = {
      page: 1,
      pageSize: 1000,
      order: 'update_time',
      uid: parseInt(userInfo.id)
    };
    wx.request({
      url: globalVars.apiDomain + '/api/collection/list',
      data: reqData,
      success: function(res) {
        if(callback) {
          callback(res.data);
        }
      },
      complete: function() {
        _this.setData({
          loadingLock: false
        });
        wx.hideLoading();
      },
      fail: function() {
        // TODO CODE
        // 错误情况处理
      }
    });
  },
  // 请求新增轨迹接口
  reqAddDiaryApi: function(callback) {
    var _this = this;
    var userInfo = this.data.userInfo;
    if(this.data.submitFormLock) {
      return;
    }

    // 参数
    var reqData = {
      sessionId: wx.getStorageSync('sessionId'),
      uid: parseInt(userInfo.id),
      cid: this.data.collectionList[this.data.curCollectionIndex]['id'],
      imgUrl: this.data.uploadImgArr.join(','),
      content: this.data.content
    };
    this.setData({
      submitFormLock: true
    });
    wx.request({
      url: globalVars.apiDomain + '/api/diary/add',
      method: 'POST',
      data: reqData,
      success: function(res) {
        if(callback) {
          callback(res.data);
        }
      },
      complete: function() {
        _this.setData({
          submitFormLock: false
        });
      },
      fail: function() {
        // TODO CODE
        // 错误情况处理
      }
    });
  }
});