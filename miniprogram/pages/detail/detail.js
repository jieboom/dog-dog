const fetch = require('../../common/script/fetch')
wx.cloud.init()
const app = getApp()
Page({
  videoContext: '',
  danmuValue: '',
  id: '',
  type:'',
  collection: 'movieHot',
  /**
   * 页面的初始数据
   */
  data: {
    showLoading: true, //正在加载显示
    movieDetail: null, // 电影预告片数据
    isCollection: {  //收藏预告片
      flag: false,
      color: 'grey',
      text: '收藏'
    },
    danmudisabled: false, //弹幕是否可以发送
    likeList: [
      {

      }
    ],
    initDanmu: '', //初始化弹幕
    videoCurrentTime: 0,
    test: ''
  },



  onLoad: function (query) {

    const self = this

    self.id = query.id
    self.type = query.type
    fetch.fetchDetail('movieHot', self.id, self.handleDataDetail)

  },
  handleDataDetail(data) {
    const self = this
    self.setData({
      movieDetail: data,
      showLoading: false
    })
    // 添加历史记录到app全局变量中
    const currentMovie = self.data.movieDetail

    let historyList = app.globalData.userMovieInfo.historyList


    if (historyList.length > 0) {
      historyList = historyList.filter(el => {
        if (el._id !== currentMovie._id) return el
      })
      if (historyList.length >= 20) {
        historyList = historyList.splice(0, 19)
      }

    }
    historyList.unshift(currentMovie)

    app.globalData.userMovieInfo.historyList = historyList


        // 获取相似电影预告片
        wx.cloud.callFunction({
          name: 'fetchLike',
          data: {
            type: self.type,
            collection: 'movieHot'
          }
        }).then(res => {
          let likeList = res.result.likeList.data
    
          let likeListSelect = []
          if (likeList.length > 5) {
            const listLen = likeList.length
            // 随机挑选相似预告片
            for (let i = 0; i < 5; i++) {
              const index = Math.floor(Math.random() * listLen)
              const item = likeList[index]
              likeListSelect.push(item)
            }
    
          } else {
            likeListSelect = likeList
          }
    
          for (let i = 0; i < likeListSelect.length; i++) {
            const el = likeListSelect[i]
            if (el._id === self.id) {
              likeListSelect.splice(i, 1)
              i++
            }
          }
    
    
          likeListSelect.forEach(element => {
    
            // 播放时长修饰
    
            let duration = element.duration
    
            let minute = Math.floor(duration / 60)
            minute = minute < 10 ? "0" + minute : minute
            let second = parseInt(duration % 60)
            second = second < 10 ? "0" + second : second
            let durationDec = minute + "'" + second + "''"
            element.duration = durationDec
          })
          self.setData({
            likeList: likeListSelect
          })
        })
    
        // 初始化收藏状态
    
        
        const collectionList = app.globalData.userMovieInfo.collectionList
        if (collectionList.some(el => el._id === currentMovie._id)) {
          self.setData({
            isCollection: {  //收藏预告片
              color: 'red',
              text: '已收藏',
              flag: true
            },
          })
        }
    
    
        self.videoContext = wx.createVideoContext('movieVideo')
        self.videoContext.play()


  },
  goDetail(e) {
    const id = e.currentTarget.dataset.id
    const type = e.currentTarget.dataset.type

    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&type=' + type

    });
  },
  videoTimeUpdate(e) {
    const self = this
    if (self.data.danmudisabled) {
      self.videoCurrentTime = Math.ceil(e.detail.currentTime)
      console.log(self.videoCurrentTime);
    }



  },
  danmuBlur(e) {
    this.danmuValue = e.detail.value
  },
  sendDanmu(e) {
    const self = this
    self.setData({
      danmudisabled: true
    })
    setTimeout(() => {
      self.setData({
        danmudisabled: false
      })
    }, 1000)
    self.setData({
      initDanmu: ""
    })

    setTimeout(() => {
      self.videoContext.sendDanmu({
        text: self.danmuValue
      })
      wx.cloud.callFunction({
        name: "addDanmu",
        data: {
          text: self.danmuValue,
          time: self.videoCurrentTime,
          id: self.id,
          collection: self.collection
        }
      }).then((res) => {
        console.log(res)

        console.log("弹幕添加成功")
      })
    }, 250) //等待视频播放时间函数触发










  },
  collectionToggle() {
    const self = this
    const currentMovie = self.data.movieDetail
    let collectionList = app.globalData.userMovieInfo.collectionList

    if (self.data.isCollection.flag) {
      self.setData({
        isCollection: {
          color: 'grey',
          text: '收藏',
          flag: false
        }
      })

      let collectionIndex
      collectionList.forEach( (el,index) => {
            if( el._id == currentMovie._id) collectionIndex = index
      })

      collectionList.splice(collectionIndex,1)


    }else{
      self.setData({
        isCollection: {
          color: 'red',
          text: '已收藏',
          flag: true
        }

      })

      if(collectionList.length >= 10){
        collectionList = collectionList.slice(0,9)
      }

      collectionList.unshift(currentMovie)
    }
    app.globalData.collectionList = collectionList

  }










})