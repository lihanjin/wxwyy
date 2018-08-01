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
    // 3 0 18 1 4 2 22
    rank1: [],
    rank2: [],
    rank3: [],
    rank4: [],
    rank5: [],
    rank6: [],
    rank7: [],
    rankList: []
  }, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {
    if (this.data.rankList.length <= 0) {
      this.getRank(3)
      this.getRank(0)
      this.getRank(18)
      this.getRank(1)
      this.getRank(4)
      this.getRank(2)
      this.getRank(22)
    }
  },
  moved: function () { },
  detached: function () { },

  methods: {
    goRanklist(e) {
      wx.navigateTo({
        url: '/pages/ranklist/ranklist?item=' + JSON.stringify(e.currentTarget.dataset.id)
      })
    },
    getRank(index) {
      app.$ajax.Get(Api + '/top/list?idx=' + index)
        .then(res => {
          if (res) {
            let rankList = this.data.rankList
            if (res.data) {
              res.data.playlist.tracks.length = 3
              res.data.playlist.rankId = index
              rankList.push(res.data.playlist)
              this.setData({
                rankList
              })
            }
          }
        })
        .catch(err => {

        })
    }
  }

})