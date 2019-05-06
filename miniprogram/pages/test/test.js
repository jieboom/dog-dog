let index = 1
let id = '5cce6a911166b06d0cba91e1'
wx.cloud.init()
const db = wx.cloud.database()
const movies = db.collection('movieHot')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: "http://pr0d5m3ud.bkt.clouddn.com/L3vds4mZdW8b96gDvVAvg.mp4",
    flag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {







  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  test(e) {
    const _that = this

    if (_that.data.flag) {
      _that.setData({
        flag: false
      })
      let timeOut
      const duration = e.detail.duration


      // 获取video对象
      const videoContext = wx.createVideoContext('myVideo')
      videoContext.pause()

      console.log(index)
      movies.doc(id).update({
        data: {
          duration: duration
        }
      }).then(res => {
        console.log(res)
        timeOut = ''

        movies.skip(index).limit(1).get().then(res => {
          index++
          console.log(index, "123")
          id = res.data[0]._id
          const trailer = res.data[0].trailer
          _that.setData({
            src: trailer
          })
          timeOut = setTimeout(() => {
            videoContext.play()
          }, 1000)
          _that.setData({
            flag: true
          })


        })

      })
    }




  }
})