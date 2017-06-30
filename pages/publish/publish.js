/**
 * 发布轨迹页
 */
// 获取应用实例
var app = getApp();

// 页面数据
var pageData = {
  // 梦想录列表信息
  collectionList: [],
  curCollectionIndex: 0,
  collectionCoverList: [],
  // 上传图片
  uploadImg: [],
  maxImgCount: 3
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
    var that = this;
    // 获取微信用户数据
    app.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      });
    });

    // test code
    this.setData({
      collectionList: ['梦想录1', '梦想录2', '梦想录3'],
      collectionCoverList: [app.globalData.ossDomain + '/temp/avatar.png', app.globalData.ossDomain + '/temp/avatar.png', app.globalData.ossDomain + '/temp/avatar.png']
    });
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
  }
})