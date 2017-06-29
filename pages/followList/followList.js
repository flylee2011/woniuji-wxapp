// pages/followList/followList.js
/**
 * 关注/粉丝列表页
 */
// 获取应用实例
var app = getApp();
// 数据
var pageData = {
  userInfo: {},
  followPeopleList: [{
    cover: 'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png'
  }, {
    cover: 'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png'
  }, {
    cover: 'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png'
  }],
  followDiaryList: [{
    cover: 'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png'
  }, {
    cover: 'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png'
  }, {
    cover: 'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png'
  }]
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

    // 设置导航条
    wx.setNavigationBarTitle({
      title: '关注'
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
  
  }
});