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
  // 梦想录列表信息
  collectionList: [],
  collectionCoverList: [],
  curCollectionIndex: 0,
  // 上传图片
  uploadImg: [],
  maxImgCount: 3,
  loadingLock: true
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
      }
    });

    // // test code
    // this.setData({
    //   collectionList: ['梦想录1', '梦想录2', '梦想录3'],
    //   collectionCoverList: [globalVars.aliyun.ossDomain + '/temp/avatar.png', globalVars.aliyun.ossDomain + '/temp/avatar.png', globalVars.aliyun.ossDomain + '/temp/avatar.png']
    // });
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
  // 梦想录选择事件
  onChangeDiaryPicker: function(e) {
    var curIndex = e.detail.value;
    this.setData({
      diaryIndex: curIndex
    });
  },
  // 点击上传图片
  onClickAddImg: function(e) {
    var _this = this;

    // 图片选择
    wx.chooseImage({
      count: 3,
      success: function(res) {
        console.log(res);
        var tempFileArr = res.tempFilePaths;
        _this.setData({
          uploadImg: _this.data.uploadImg.concat(tempFileArr)
        });
      }
    });
  },
  // 点击图片执行操作
  onClickImg: function(e) {
    var _this = this;
    // 图片下标
    var itemIndex = e.currentTarget.dataset.itemindex;
    // 图片数据
    var imgArr = this.data.uploadImg;

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
            uploadImg: imgArr
          });
        }
      }
    });
  },
  // 提交表单
  onSubmitPublishForm: function() {
    var uploadImgData = this.data.uploadImg;
    console.log(uploadImgData);

    for(var i=0; i<uploadImgData.length; i++) {
      uploadFile({
        filePath: uploadImgData[i],
        callback: function(res) {
          console.log(res);
        }
      });
    }
  },
  // 获取梦想录信息
  getCollecionInfo: function() {
    var _this = this;
    this.reqCollectionListApi(function(res) {
      console.log(res);

      _this.setData({
        loadingLock: false
      });
    });
  },
  // 请求梦想录列表接口
  reqCollectionListApi: function(callback) {
    var userInfo = this.data.userInfo;
    // 参数
    var reqData = {
      page: 1,
      pageSize: 1000,
      order: 'update_time',
      uid: userInfo.id
    };
    wx.request({
      url: globalVars.apiDomain + '/api/collection/list',
      data: reqData,
      success: function(res) {
        if(callback) {
          callback(res.data);
        }
      }
    });
  }
})