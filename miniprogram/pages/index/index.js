
const fetch = require('../../common/script/fetch.js')
Page({
  isOnLoad: false,
  /**
   * 页面的初始数据
   */
  data: {
    movieList: [],
    topMovieList:[],
    bottomMovieList:[],
    hasMore: true,
    showLoading: true,
    movieSkinIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    const self = this
    self.isOnLoad = true
    var args = [ 'movieHot',self.data.movieSkinIndex,self.handleReqData]
    fetch.fetchMovieList.apply(self,args)
    
   
  },



  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
        const self = this
        self.setData({
          isBottom: true
        })
        var args = [ 'movieHot',self.data.movieSkinIndex,self.handleReqData ]
        fetch.fetchMovieList.apply(self,args)

  },


  goSearch() {
    wx.navigateTo({
      url: '../searchView/searchView'
    })
  },
  goDetail(e){
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
     url: '../detail/detail?id='+id
   })
  },

  handleReqData(data) {
    const self = this

    const movieData = data

    movieData.forEach(element => {

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
      movieList: self.data.movieList.concat(movieData)
    })
    self.setData({
      bottomMovieList: self.data.movieList.slice(3)
    })
     if( self.isOnLoad){
      self.setData({
        topMovieList: self.data.movieList.slice(0,3)
      })
      self.isOnLoad = false
     }
  }
  
  

})