// pages/addBottle/addBottle.js
/**
 * 新增梦境页
 */

// 页面数据
var pageData = {
  diaryCollectionCover: ['http://woniuji.oss-cn-beijing.aliyuncs.com/temp/icon-default-cover.png', 'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png', 'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png', 'http://woniuji.oss-cn-beijing.aliyuncs.com/temp/avatar.png'],
  diaryCollectionTitle: ['选择要绑定的梦想录', '梦想录1', '梦想录2', '梦想录3'],
  diaryIndex: 0
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
  // 梦想录选择事件
  onChangeDiaryPicker: function (e) {
    var curIndex = e.detail.value;
    this.setData({
      diaryIndex: curIndex
    });
  }
})