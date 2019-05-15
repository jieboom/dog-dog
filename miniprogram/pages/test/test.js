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