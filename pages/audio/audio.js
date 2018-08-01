const app = getApp()
const Api = require('../../utils/config.js').api

Component({
  externalClasses: ['player-menu'],
  behaviors: [],

  properties: {},
  ready() {},
  data: {
    singerDetail: {},
    song: {},
    pause: true,
    random: true,
    one: false,
    loop: false,
    listFlag: 'bottom: -600rpx;display:none',
    bgFlag: false,
    playList: [],
    nowPlay: {},
    randomList: [],
    current: 0,
    audioFlag: '',
    arrow: true,
    time: '00:00'
  }, // 私有数据，可用于模版渲染

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function() {
    this.backgroundPlayer = app.globalData.backgroundPlayer;
    this.audioManager() // 背景播放
  },
  moved: function() {},
  detached: function() {},

  methods: {
    // 设置随机数组
    randomList() {
      let randomList = this.data.randomList,
        playListLength = this.data.playList.length
      for (var i = 1; i < playListLength + 1; i++) {
        randomList.push(i)
      }
      let res = [];
      for (var i = 0, len = randomList.length; i < len; i++) { // 设置随机数组
        var randomIndex = Math.floor(Math.random() * randomList.length);
        res[i] = randomList[randomIndex];
        randomList.splice(randomIndex, 1);
      }
      wx.setStorage({
        key: 'randomList',
        data: res,
      })
      this.setData({
        randomList: res
      })
    },
    // 播放器控制时间
    audioManager() {
      // 使用 wx.createAudioContext 获取 audio 上下文 context
      // 获取当前播放storage
      let one = this.data.one,
        random = this.data.random
      this.getnowPlayer() // 获取当前歌曲
      this.getPlayList() // 获取当前列表
      // 背景播放结束
      this.backgroundPlayer.onEnded(() => {
        if (!one) {
          this.switchover(true) // 顺序切换
        }
        this.getnowPlayer()
      });
      // 背景播放错误
      this.backgroundPlayer.onError((err) => {
        if (!this.data.pause) {
          this.switchover(true) // 顺序切换
          this.getnowPlayer()
        }
      })
      this.backgroundPlayer.onTimeUpdate(res => {
        var seconds = this.backgroundPlayer.currentTime,
          time = [
            parseInt(seconds / 60 % 60),
            parseInt(seconds % 60)
          ]
          .join(":")
          .replace(/\b(\d)\b/g, "0$1");
          this.setData({
            time
          })
      })
    },
    deleteSong(e){ // 删除音乐
      console.log(e)
      let id = e.currentTarget.dataset.id,
      playList = this.data.playList,
      randomList = this.data.randomList,
      nowPlay = this.data.nowPlay
      console.log(playList)
      if (playList[id].id == nowPlay.id){
        this.switchover(true) // 顺序切换
      }
      playList.splice(id,1)
      randomList.splice(id, 1)
      wx.setStorage({
        key: 'playList',
        data: playList,
      })
      wx.setStorage({
        key: 'randomList',
        data: randomList,
      })
      this.setData({
        playList,
        randomList
      })
    },
    audioPlay() { // 播放
      this.backgroundPlayer.play()
      this.getnowPlayer()
      this.setData({
        pause: false
      })
    },
    audioPause() { // 暂停
      this.backgroundPlayer.pause()
      this.getnowPlayer()
      this.setData({
        pause: true
      })
    },
    // 切换歌曲
    switchover(next = true) {
      let random = this.data.random,
        one = this.data.one,
        loop = this.data.loop,
        playList = this.data.playList,
        nowPlay = this.data.nowPlay,
        randomList = this.data.randomList,
        playListLength = this.data.playList.length,
        current = this.data.current
      console.log(playList)

      if (next) { // 下一首
        if (loop || one) {
          if (current + 1 < playListLength) {
            current = current + 1
          } else {
            current = 0
          }
          wx.setStorage({
            key: 'nowPlayer',
            data: playList[current],
          })
          this.setData({
            current: current
          })
          this.getnowPlayer()
          this._changePlay()
        } else {
          if (current + 1 < playListLength) {
            current = current + 1
          } else {
            current = 0
          }
          wx.setStorage({
            key: 'nowPlayer',
            data: playList[randomList[current]],
          })
          this.setData({
            current: current
          })
          this.getnowPlayer()
          this._changePlay()
        }
      } else {
        if (loop || one) {
          if (current - 1 < 0) {
            current = current - 1
          } else {
            current = 0
          }
          wx.setStorage({
            key: 'nowPlayer',
            data: playList[current],
          })
          this.setData({
            current: current
          })
          this.getnowPlayer()
          this._changePlay()
        } else {
          if (current - 1 < 0) {
            current = current - 1
          } else {
            current = 0
          }
          wx.setStorage({
            key: 'nowPlayer',
            data: playList[randomList[current]],
          })
          this.setData({
            current: current
          })
          this.getnowPlayer()
          this._changePlay()
        }
      }
    },
    // player切换事件
    _changePlay() {
      this.triggerEvent("changePlay")
    },
    // 播放列表播放
    changePlay(e) {
      let playList = this.data.playList;
      wx.setStorageSync('nowPlayer', playList[e.currentTarget.dataset.id])
      this._changePlay()
      this.getnowPlayer()
    },
    // 获取播放列表
    getPlayList() {
      wx.getStorage({
        key: 'playList',
        success: (res) => {
          if (res.data) {
            let result = res.data
            this.setData({
              playList: result
            })
            this.randomList()
          }
        },
      })
    },
    // 获取当前播放歌曲
    getnowPlayer() {
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
            this.getSinger(result.id)
            this.getSingerDetail(result.id)
            let songHistory = wx.getStorageSync('historySong') || []
            for (var i = 0; i < songHistory.length; i++) {
              if (songHistory[i].id != result.id) {
                songHistory.push(result)
              }
            }
            this.setData({
              singerDetail: result,
              nowList: result,
              nowPlay: res.data
            })

            wx.setStorage({
              key: 'historySong',
              data: songHistory,
            })
            this.backgroundPlayer.title = result.name
            this.backgroundPlayer.epname = result.name
            this.backgroundPlayer.singer = result.artists[0].name
            this.backgroundPlayer.coverImgUrl = result.album.picUrl
            this.backgroundPlayer.webUrl = result.album.picUrl
          }
        },
      })
    },
    closeList() {
      this.setData({
        listFlag: 'animation: scroll-out 0.4s linear 1 forwards',
        bgFlag: false
      })
    },
    openlist() {
      this.setData({
        listFlag: 'animation: scroll 0.4s linear 1 forwards',
        bgFlag: true
      })
    },
    closeAudio() {
      this.setData({
        audioFlag: 'animation: fadein 1s linear 1 forwards;',
        arrow: false
      })
    },
    openAudio() {
      this.setData({
        audioFlag: 'animation: fadeout 1s linear 1 forwards;',
        arrow: true
      })
    },
    random() {
      let current = this.data.current,
        randomList = wx.getStorageSync('randomList') || []
      if (randomList.length > 0) {
        this.setData({
          random: false,
          loop: true,
          one:false,
          current: randomList[current]
        })
      }
      this.setData({
        random: false,
        loop: true,
        one: false,
        current: 0
      })
    },
    one() {
      this.setData({
        one: false,
        random: true,
        loop:false
      })
    },
    loop() {
      this.setData({
        loop: false,
        one: true,
        random:false
      })
    },
    getSinger(id) {
      app.$ajax.Get(Api + '/music/url', {
          id
        })
        .then(res => {
          if (res) {
            if (res.data) {
              this.setData({
                song: res.data.data[0]
              })
              if (res.data.data[0].url) { // 判断是否为空
                if (!this.data.pause) {
                  this.backgroundPlayer.src = res.data.data[0].url
                }
              } else {
                this.switchover()
              }
            }
          }
        })
        .catch(err => {
          console.log(err)
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
  }

})