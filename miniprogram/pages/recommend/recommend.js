
const fetch = require('../../common/script/fetch.js')
const app = getApp()

Page({
  recommendRawList:[],
  data: {
    showLoading: true,
    hasMore: true,
    recommendList: [],
    movieSkinIndex: 0
  },

  onLoad() {
    const self = this
    const openId = app.globalData.openId
    const reqMaxCount = 5  //一次加载预告片最大数量
    const userCo = wx.cloud.database().collection('user')
    userCo.where({
      _openid: openId
    }).get().then(res => {
       self.recommendRawList = res.data[0].recommendList
        self.recommendRawList.forEach(element => {

        // 播放时长表示修饰
  
        let duration = element.duration
  
        let minute = Math.floor(duration / 60)
        minute = minute < 10 ? "0" + minute : minute
        let second = parseInt(duration % 60)
        second = second < 10 ? "0" + second : second
        let durationDec = minute + ":" + second
        element.duration = durationDec
  
        //  预告片类型调整
  
        element.type = element.type.substring(0, 2)
      })
       
      self.setData({
        recommendList: self.data.recommendList.concat(self.recommendRawList.slice(self.data.movieSkinIndex,self.data.movieSkinIndex + reqMaxCount)),
        showLoading: false,
        movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
      })
      wx.stopPullDownRefresh()
      

    })


  },
  onReachBottom: function () {
    const self = this
    const reqMaxCount = 5  //一次加载预告片最大数量
    self.setData({
      recommendList: self.data.recommendList.concat(self.recommendRawList.slice(self.data.movieSkinIndex,self.data.movieSkinIndex + reqMaxCount)),
      movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
    })
    if(self.data.movieSkinIndex  == self.recommendRawList.length){
      self.setData({
          hasMore: false
      })
    }

},
goDetail(e){
  const id = e.currentTarget.dataset.id
  wx.navigateTo({
   url: '../detail/detail?id='+id
 })
},
onPullDownRefresh(){
  const self = this

  self.setData({
    showLoading: true,
    hasMore: true,
    recommendList: [],
    movieSkinIndex: 0

  })
   setTimeout( () => {
    app.updataSortArr(app)
    self.onLoad()
   } ,1000)
    
  

}
})