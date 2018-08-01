const app = getApp()
const Api = require('../../utils/config.js').api
const util = require('../../utils/util.js')
var sliderWidth = 0; // 需要设置slider的宽度，用于计算中间位置
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
    searchActive: 'search-input',
    searchCancel: false, //取消按钮
    placeholder: '猜你喜欢 ',
    hotList: [],
    searchvalue: '',
    historyList: [],
    resultFlag: false, //搜索结果
    searchFlag: false,

    tabs: ["单曲", "专辑", "歌手", "歌单", "用户", "视频", "歌词", "电台"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    songList: {},
    recomment: true,
    suggestList: []
  }, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () {
    this.getHotsearch()
    wx.getStorage({
      key: 'history',
      success: (res) => {
        let history = res.data || []
        this.setData({
          historyList: history
        })
      },
      fail(err) {
        wx.setStorage({
          key: "history",
          data: []
        })
      },
    })

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2 + 4,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  moved: function () { },
  detached: function () { },

  methods: {
    tabClick: function (e) {
      this.setData({
        sliderOffset: e.currentTarget.offsetLeft - 10,
        activeIndex: e.currentTarget.id
      });
      // 1: 单曲 10: 专辑 100: 歌手 1000: 歌单 1002: 用户 1004: MV 1006:
      switch (e.currentTarget.id) {
        case '0':
          this.getSearch(1)
          break;
        case '1':
          this.getSearch(10)
          break;
        case '2':
          this.getSearch(100)
          break;
        case '3':
          this.getSearch(1000)
          break;
        case '4':
          this.getSearch(1002)
          break;
        case '5':
          this.getSearch(1004)
          break;
        case '6':
          this.getSearch(1006)
          break;
        case '7':
          this.getSearch(1009)
          break;
      }
    },
    // 删除搜索历史
    deteleHistory(e) {
      let id = e.currentTarget.dataset.id
      wx.getStorage({
        key: 'history',
        success: (res) => {
          let history = res.data || []
          history.splice(id, 1)
          this.setData({
            historyList: history
          })
          wx.setStorage({
            key: "history",
            data: history
          })
        },
        fail(err) {
          wx.setStorage({
            key: "history",
            data: []
          })
        },
      })
    },
    getSearch(type = 1) {
      // 搜索
      // 必选参数: keywords: 关键词
      // 可选参数: limit: 返回数量, 默认为 30 offset : 偏移数量，用于分页, 如 : 如: (页数 - 1) * 30, 其中 30 为 limit 的值 , 默认为 0
      // type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲 10: 专辑 100: 歌手 1000: 歌单 1002: 用户 1004: MV 1006: 歌词 
      app.$ajax.Get(Api + '/search', {
        keywords: this.data.searchvalue,
        type
      })
        .then(res => {
          if (res) {
            if (res.data) {
              console.log(res.data.result)
              this.setData({
                songList: res.data.result
              })
            }
          }
        })
        .catch(err => {

        })
    },
    // 搜索建议点击
    suggestSearch(e) {
      console.log(e)
      this.setData({
        searchvalue: e.currentTarget.dataset.name,
        searchFlag: true,
        recomment: true
      })
    },
    // 搜索建议
    suggest() {
      app.$ajax.Get(Api + '/search/suggest', {
        keywords: this.data.searchvalue
      })
        .then(res => {
          if (res) {
            if (res.data) {
              console.log(res.data.result)
              this.setData({
                suggestList: res.data.result
              })
            }
          }
        })
        .catch(err => {

        })
    },
    // 添加搜索历史
    searchSong() {
      wx.getStorage({
        key: 'history',
        success: (res) => {
          console.log(res.data)
          let history = res.data || []
          if (history.indexOf(this.data.searchvalue) == -1) { history.push(this.data.searchvalue) }
          this.setData({
            historyList: history
          })
          wx.setStorage({
            key: "history",
            data: history
          })
        }
      })
      this.setData({
        searchFlag: false,
        resultFlag: true,
        recomment: false
      })
      this.getSearch(1)
    },
    search(e) {
      this.setData({
        searchActive: 'search-active',
        searchCancel: true,
        searchFlag: true
      })
    },
    // 改变搜索值
    changeSearchValue: util.debounce(function (e) {
      this.setData({
        searchvalue: e.detail.value,
        searchFlag: true,
        recomment: true,
        searchCancel: true,
      })
      this.suggest()
    }, 300),
    // 失去焦点事件
    blurSearch(e) {
      this.setData({
        searchActive: 'search-input'
      })
    },
    goRanklist(e) {
      wx.navigateTo({
        url: '/pages/ranklist/ranklist?item=' + JSON.stringify(e.currentTarget.dataset.id)
      })
    },
    // 获取热门搜索
    getHotsearch(index) {
      app.$ajax.Get(Api + '/search/hot')
        .then(res => {
          if (res) {
            if (res.data) {
              console.log(res.data)
              this.setData({
                hotList: res.data.result.hots,
                placeholder: '猜你喜欢 ' + res.data.result.hots[0].first
              })
            }
          }
        })
        .catch(err => {

        })
    },
    searchCancle() {
      this.setData({
        searchCancel: false, //取消按钮
        resultFlag: false, //搜索结果
        searchFlag: false,
        recomment: false,
        searchvalue: ''
      })
    },
   
  }

})