var sliderWidth = 30; // 需要设置slider的宽度，用于计算中间位置
const pinyinUtil = require('../../utils/pingyinUtil.js').makePy
const app = getApp()
const Api = require('../../utils/config.js').api
Page({
  data: {
    tabs: ["推荐", "热歌", "歌手"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    letter: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
    hotList: [],
    letterList: [],
    scrollId: 'hot',
    scrollHeight: ''
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2 + 5,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
          scrollHeight: res.windowHeight - 50
        });
      }
    });
    this.getArtists()
  },
  changeScrollId(e) {
    let id = e.currentTarget.dataset.id
    // 根据传入id跳转楼层
    this.setData({
      scrollId: id
    })
  },
  hot() {
    this.setData({
      scrollId: 'hot'
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  goSingerDetail(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/singerdetail/singerdetail?id=' + id
    })
  },
  getArtists() {
    app.$ajax.Get(Api + '/top/artists?limit=200')
      .then(res => {
        console.log(res)
        let letterList = this.data.letter
        if (res.data.artists) {
          let result = res.data.artists,
            hotList = []
          for (var j = 0; j < letterList.length; j++) {
            let letter = letterList[j]
            letterList[j] = [letter]
            for (var i = 0; i < result.length; i++) {
              // 判断名字首字母
              if (letterList[j][0] == pinyinUtil(result[i].name.split('')[0])) {
                letterList[j].push(result[i])
              }
            }
          }
          hotList = result
          hotList.length = 10
          this.setData({
            hotList,
            letterList
          })
        }
      })
      .catch(err => {

      })
  }
});