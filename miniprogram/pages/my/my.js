wx.cloud.init()
const app = getApp()
Page({

  data: {
    userInfoFlag: true,
    avatarSrc: '../../common/images/avatar.png',
    avatarName: '',
    userMovieInfo: {}
  },
  onLoad() {
    const self = this
    if (app.globalData.userInfo) {
      const userInfo = app.globalData.userInfo
      self.setData({
        avatarSrc: userInfo.avatarUrl,
        avatarName: userInfo.nickName
      })
    } else {
      self.setData({
        userInfoFlag: false
      })

    }
    const userMovieInfo = app.globalData.userMovieInfo

    const historyList = userMovieInfo.historyList
    if (historyList.length > 0) {
      historyList.forEach(el => {
        const movieNameZnIndex = el.name.indexOf(" ")
        if (movieNameZnIndex != -1) {
          el.name = el.name.substring(0, movieNameZnIndex)
        }

      })
    }


    const collectionList = userMovieInfo.collectionList
    if (collectionList.length > 0) {
      collectionList.forEach(el => {
        const movieNameZnIndex = el.name.indexOf(" ")
        if (movieNameZnIndex != -1) {
          el.name = el.name.substring(0, movieNameZnIndex)
        }

      })

    }


    self.setData({
      userMovieInfo
    })
  },
  onShow() {
    const self = this
    const userMovieInfo = app.globalData.userMovieInfo
    const historyList = userMovieInfo.historyList
    if (historyList.length > 0) {
      historyList.forEach(el => {
        const movieNameZnIndex = el.name.indexOf(" ")
        if (movieNameZnIndex != -1) {
          el.name = el.name.substring(0, movieNameZnIndex)
        }

      })
    }


    const collectionList = userMovieInfo.collectionList
    if (collectionList.length > 0) {
      collectionList.forEach(el => {
        const movieNameZnIndex = el.name.indexOf(" ")
        if (movieNameZnIndex != -1) {
          el.name = el.name.substring(0, movieNameZnIndex)
        }

      })

    }

    self.setData({
      userMovieInfo
    })
  }
  ,
  getUserinfo(res) {
    const self = this
    const userInfo = res.detail.userInfo
    self.setData({
      avatarSrc: userInfo.avatarUrl,
      avatarName: userInfo.nickName,
      userInfoFlag: true
    })
    app.globalData.userInfo = userInfo
  },
  goDetail(e) {
    const id = e.currentTarget.dataset.id
    const type = e.currentTarget.dataset.type

    wx.navigateTo({
      url: '../detail/detail?id=' + id + '&type=' + type

    });
  },
  choseBg() {
    wx.navigateTo({
      url: "../avatarBg/avatarBg"
    })
  },
  goSetting() {
    wx.navigateTo({
      url: '../setting/setting'

    });
  }

})