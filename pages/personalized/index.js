const app = getApp()
const Api = require('../../utils/config.js').api
Component({

  behaviors: [],

  properties: {
    myProperty: { // 属性名
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '', // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function (newVal, oldVal) { } // 属性被改变时执行的函数（可选），也可以写成在methods段中定义的方法名字符串, 如：'_propertyChange'
    },
    myProperty2: String // 简化的定义方式
  },
  data: {
    alizedList: [],
    newSong: [],
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    previous: '35px',
    current: 0,
  }, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {
    this.getPersonalized()
    this.getNewsong()
    this.banner()
  },
  moved: function () { },
  detached: function () { },

  methods: {
    banner() {
      app.$ajax.Get(Api + '/banner')
        .then(res => {
          if (res) {
            this.setData({
              imgUrls: res.data.banners
            })
          }
        })
        .catch(err => {

        })
    },
    change: function (e) {
      let index = e.detail.current
      // if (e.detail.source == 'touch') {
        this.setData({
          current: index
        })
      // }

    },
    getPersonalized() {
      app.$ajax.Get(Api + '/personalized')
        .then(res => {
          // let resList = res.data.result.slice(0, 6)
          let resList = res.data.result
          for (var i = 0; i < resList.length; i++) {
            if (resList[i].playCount < 10000) {
              continue
            } else if (resList[i].playCount > 10000 && resList[i].playCount < 100000000) {
              resList[i].playCount = (resList[i].playCount / 10000).toFixed(1) + '万'
            } else {
              resList[i].playCount = (resList[i].playCount / 100000000).toFixed(1) + '亿'
            }
          }
          if (res.data && res.data.code === 200) {
            this.setData({
              alizedList: resList
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getNewsong() {
      app.$ajax.Get(Api + '/top/list?idx=1')
        .then(res => {
          for (var i = 0; i < res.data.playlist.tracks.length; i++) {
            if (res.data.privileges[i].fl == 320000) {
              res.data.playlist.tracks[i].sqhot = 'hot'
            }
          }
          let resList = res.data.playlist.tracks.slice(0, 10)
          // let resList = res.data.playlist.tracks
          if (res.data && res.data.code === 200) {
            this.setData({
              newSong: resList
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

})