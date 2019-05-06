//app.js
App({
  onLaunch: function () {
    const self = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    self.globalData = {}
    // 向微信请求加载个人信息

    wx.getSetting({
      success: (result) => {

        if (result.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            lang: 'zh_CN',
            success: (result) => {
              self.globalData.userInfo = result.userInfo
            }
          })
        }
      }

    });


    // 请求云函数和数据库,获取openid 
    // 若为新用户就创建新的记录 , 否则就获取用户相关信息

    wx.cloud.callFunction({
      name: 'login',
      data: {

      },

    }).then(res => {

      self.globalData.openId = res.result.OPENID

    })
    const userCo = wx.cloud.database().collection('user')
    userCo.where({
      openId: self.globalData.openId
    }).get()
      .then(res => {
        if (res.data.length === 1) {
          // 将用户数据保存在小程序全局变量中
          self.globalData.userId = res.data[0]._id
          delete res.data[0]._id
          delete res.data[0]._openid

          self.globalData.userMovieInfo = res.data[0]
        } else {
          userCo.add({
            data: {
              collectionList: [],
              historyList: [],
              historyKey: [],
              set: {
                name: '',
                nickName: '',
                gender: '',
                age: '',
                birthday: ''
              },
              avatarBgUrl: '../../common/images/avatar-bg2.jpg'

            }
          }).then(res => {

            console.log('用户信息添加成功')
            //  将新增加到数据库的数据返回到app中
            userCo.doc(res._id).get()
              .then(res => {
                console.log(res);

                self.globalData.userId = res.data._id
                delete res.data._id
                delete res.data._openid
                self.globalData.userMovieInfo = delete res.data
              })
          })


        }

      })



  },
  onHide() {
    const self = this

    //当app切入后台时,向数据库更新用户电影信息
    const userCo = wx.cloud.database().collection('user')
    userCo.doc(self.globalData.userId).set({
      data: self.globalData.userMovieInfo
    }).then(res => {
      if (res.stats.updated == 1) {
        console.log("用户数据更新成功!")
      }
    })
    self.updataSortArr(self)

  },
  updataSortArr(app) {
    //向云函数传递历史记录标签参数
    const historyList = app.globalData.userMovieInfo.historyList
    //预告片历史记录类型统计  对象数组 type , count 
    let sortObj = {}
    let sortArr = []
    historyList.forEach((el, index) => {
      let typeArr = []
      const typeStr = el.type
      for (let i = 0; i < typeStr.length - 2; i += 2) {
        typeArr.push(typeStr.substring(i, i + 2))
      }
      typeArr.forEach(el => {
        if (el in sortObj) {
          sortObj[el]++
        } else {
          sortObj[el] = 1
        }
      })


    })

    for (let type in sortObj) {
      sortArr.push({
        type: type,
        count: sortObj[type]
      })
    }
    const sortArrByCount = function (type1, type2) {
      return type2.count - type1.count
    }
    sortArr.sort(sortArrByCount)
    console.log(sortArr);
    
    wx.cloud.callFunction({
      name: 'recommend',
      data: {
        typeArr: sortArr
      }
    })
  }
})
