// pages/player/player.js
const app = getApp()
const Api = require('../../utils/config.js').api
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    singerDetail: {},
    song: {},
    pause: false,
    random: true,
    one: false,
    loop: false,
    listFlag: 'bottom: -600rpx;display:none',
    bgFlag: false,
    playList:[]
  },
  onReady(){
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.audio = this.selectComponent("#audio");
    console.log(options)
    this.getSinger(options.id)
    this.getSingerDetail(options.id)
    this._changePlay()
  
  },
  _changePlay(){
    // 获取当前播放storage
    wx.getStorage({
      key: 'nowPlayer',
      success: (res) => {
        if (res.data) {
          let result = res.data
          if (result.album == undefined) {
            result.album = {}
            result.artists = [{}]
            result.album.blurPicUrl = result.al.picUrl
            result.artists[0].name = result.ar[0].name
            result.album.picUrl = result.al.picUrl
          }
          console.log(result)
          this.setData({
            singerDetail: result
          })
        }
      },
    })
  },
  previous(){
    this.audio.switchover(false)
  },
  next(){
    this.audio.switchover()
  },
  random(){
    this.audio.random()
    this.setData({
      random:false,
      loop: true
    })
  },
  one() {
    this.audio.one()
    this.setData({
      one: false,
      random: true
    })
  },
  loop() {
    this.audio.loop()
    this.setData({
      loop: false,
      one: true
    })
  },
  audioPause: function () {
    this.audio.audioPause()
    this.setData({
      pause: true
    })
  },
  audioPlay: function () {
    this.audio.audioPlay()
    this.setData({
      pause: false
    })
  },
  getSinger(id) {
    app.$ajax.Get(Api + '/music/url', {
      id
    })
      .then(res => {
        if (res) {
          if (res.data) {
            console.log(res.data)
            this.setData({
              song: res.data.data[0]
            })
            this.audio.audioPlay()
          }
        }
      })
      .catch(err => {

      })
  },
  // lyric
  getSingerDetail(id) {
    app.$ajax.Get(Api + '/lyric', {
      id
    })
      .then(res => {
        if (res) {
          if (res.data) {
            console.log(res.data)
          }
        }
      })
      .catch(err => {

      })
  },
  closeList() {
    this.audio.closeList()
  },
  openlist() {
    this.audio.openlist()
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
 

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