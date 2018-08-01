// pages/ranklist/ranklist.js
const app = getApp()
const Api = require('../../utils/config.js').api
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankList: {}
  },
  // 播放全部
  musicPlay() {
    if (this.data.rankList) {
      wx.setStorage({
        key: 'playList',
        data: this.data.rankList.tracks,
      })
      wx.setStorage({
        key: 'nowPlayer',
        data: this.data.rankList.tracks[0],
      })
      wx.navigateTo({
        url: '/pages/player/player?id=' + this.data.rankList.tracks[0].id
      })
    }

  },
  goPlayer(e) {
    wx.navigateTo({
      url: '/pages/player/player?id=' + JSON.stringify(e.currentTarget.dataset.id) + '&name=' + JSON.stringify(e.currentTarget.dataset.name) + '&img=' + e.currentTarget.dataset.img + '&artists=' + JSON.stringify(e.currentTarget.dataset.artists) + '&blur=' + JSON.stringify(e.currentTarget.dataset.blur)

    })
    wx.setStorage({
      key: 'nowPlayer',
      data: e.currentTarget.dataset.song,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getRank(options.item)
  },
  getRank(index) {
    app.$ajax.Get(Api + '/top/list?idx=' + index)
      .then(res => {
        let time = new Date().getMonth() + 1 + '月' + new Date().getDate() + '日'
        res.data.playlist.updateTime = time
        if (res) {
          if (res.data) {
            this.setData({
              rankList: res.data.playlist
            })
          }
        }
      })
      .catch(err => {

      })
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
})