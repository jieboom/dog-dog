//app.js
App({
  onLaunch: function () {
     const self  = this
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
      success: (result)=>{
        
         if( result.authSetting["scope.userInfo"] ){
                wx.getUserInfo({
                  lang: 'zh_CN',
                  success: (result)=>{
                        self.globalData.userInfo = result.userInfo
                  }
                })
         }
      }
      
    });


    // 请求云函数和数据库,获取openid 
    // 若为新用户就创建新的记录 , 否则就获取用户相关信息

    wx.cloud.callFunction({
      name:'login',
      data:{

      },

    }).then( res => {
      
        self.globalData.openId = res.result.OPENID
        
    })
    const userCo = wx.cloud.database().collection('user')
    userCo.where({
      openId :  self.globalData.openId
    }).get()
    .then( res => {
      if( res.data.length === 1 ){
        // 将用户数据保存在小程序全局变量中
         self.globalData.userId = res.data[0]._id
         delete res.data[0]._id
          delete res.data[0]._openid
          
          self.globalData.userMovieInfo = res.data[0]
      }else{
        userCo.add({
          data:{
              collectionList:[],
              historyList:[],
              historyKey:[],
              set:{
                name:'',
                nickName:'',
                gender:'',
                age:'',
                birthday:''
              },
              avatarBgUrl:'../../common/images/avatar-bg2.jpg'

          }
        }).then( res => {
        
         console.log('用户信息添加成功')
        //  将新增加到数据库的数据返回到app中
         userCo.doc(res._id).get()
         .then( res => {
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
  onHide(){
    const self = this
    //当app切入后台时,向数据库更新用户电影信息
    const userCo = wx.cloud.database().collection('user')
    userCo.doc(self.globalData.userId).set({
      data: self.globalData.userMovieInfo
    }).then( res => {
      if( res.stats.updated == 1){
         console.log( "用户数据更新成功!")
      }
    })
  }
})
