// pages/mine/mine.js
// 我的页

// 获取应用实例
var app = getApp();

// 数据
var pageData = {
  userinfo: null
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
    var that = this;
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      });
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

  // 点击选项
  onClickOption: function(e) {
    var pageId = e.currentTarget.dataset.pageid;
    switch(pageId) {
      case '1':
        wx.navigateTo({
          url: '/pages/editinfo/editinfo',
        });
        break;
      case '4':
        wx.navigateTo({
          url: '/pages/feedback/feedback',
        });
        break;
      default:
        break;
    }
  }
});