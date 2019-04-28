const fetch = require('../../common/script/fetch')
wx.cloud.init()
const app = getApp()
Page({
  videoContext: '',
  danmuValue: '',
  id: '',
  type: '',
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
    fetch.fetchDetail('movieHot', self.id, self.handleDataDetail)
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onHide() {
    this.data.videoContext.pause()
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
    const typeStr = data.type  //电影类型字符串
    let typeArr = []  //保存电影类型数据的数组
    let rowLikeListArr = [] //保存各个类型获取到的相似电影列表(每个电影类型获取到电影数据作为数组的一个元素) , [[]]
    const typeStrLen = typeStr.length / 2
    let flag = 0 //判断数据库查询是否完成
    for (let i = 0; i < typeStrLen; i++) { //遍历数组 访问数据库查询相似类型电影
      const item = typeStr.substring(2 * i, 2 * (i + 1))
      
      wx.cloud.callFunction({
        name: 'fetchLike',
        data: {
          type: item,
          collection: 'movieHot'
        }
      }).then(res => {

        let likeList = res.result.likeList.data

        if (likeList.length > 0 && rowLikeListArr.length < 5) {
          rowLikeListArr.push(likeList)
          typeArr.push(item)
        }
        flag++
        


      })

    }
    // 间隔100ms执行函数,判断数据库查询是否完成
    const time = setInterval(() => {
     
      
      if (flag == typeStrLen) {
        let likeListSelect = [] //保存处理过的相似电影数据
        const maxLikeListSelectLength = 5 // 展示最大的相似电影数量
        let rowLikeListAllLength = 0 //获取到所有相似电影数据的数量
        rowLikeListArr.forEach(el => {
          rowLikeListAllLength = rowLikeListAllLength + el.length
        })
        if (rowLikeListAllLength <= maxLikeListSelectLength) {
          rowLikeListArr.forEach(el => {
            el.forEach(typeItem => {
              likeListSelect.push(typeItem)
            })
          })
        } else {
          const rowLikeListLength = rowLikeListArr.length // 查询到的电影类型数
          const loopCount = Math.ceil(maxLikeListSelectLength / rowLikeListLength) // 对相似电影原始数据遍历次数
          
          let restNum = maxLikeListSelectLength //需要补充到likeListSelect的个数 
          for (let i = 0; i < loopCount; i++) {
            rowLikeListArr.forEach((el, index) => {
              if (restNum > 0 && el.length > 0) {
                const randomIndex = Math.floor(Math.random() * el.length)
                const randomItem = el[randomIndex]
                el.splice(randomIndex, 1)

                // 判断随机挑选的数据是否重复
                const duplicatePattern = likeListSelect.concat(data) 
                let  isDuplicate = false
                isDuplicate = duplicatePattern.some( duplicatePatternItem =>{
                    return randomItem._id === duplicatePatternItem._id
                })
                if(!isDuplicate){
                  likeListSelect.push(randomItem)
                  restNum--
                }
              
              }
            })
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

        }
        // 清除定时器
        clearInterval(time) 
      }
    }, 100)




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
      collectionList.forEach((el, index) => {
        if (el._id == currentMovie._id) collectionIndex = index
      })

      collectionList.splice(collectionIndex, 1)


    } else {
      self.setData({
        isCollection: {
          color: 'red',
          text: '已收藏',
          flag: true
        }

      })

      if (collectionList.length >= 10) {
        collectionList = collectionList.slice(0, 9)
      }

      collectionList.unshift(currentMovie)
    }
    app.globalData.collectionList = collectionList

  }










})