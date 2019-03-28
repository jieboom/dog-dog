// miniprogram/pages/scanCode/scanCode.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
 
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

  scanCode(){
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: function(res) {
        
          
            wx.cloud.callFunction({
             name:"checkExcel",
             data:{
               
             }
            
           }).then( res => {
              console.log( res )
           } )


        // const DB = wx.cloud.database()
        
        // const db =  DB.collection('movie')

        // 除了 对数据库进行增添数据的操作 不需要使用get方法,就可以返回一个promise  
        // 其他队数据库的操作 需要使用get() 才能返回一个promise对象  从而使用then方法 处理返回数据 
        //  增加数据库的列
        //  db.add({
        //   data:{
        //     count: 120,
        //     name: "mike",
        //     title: "yes"
        //   }
        //  }).then( res => {
        //    console.log(res)
        //  } )

        // //  查询数据库

        // db.doc('XJrOy5T75u220OJs').get().then( res => {
        //     console.log(res)
        // })
        
        // db.where({
        //   _openid:'oGB075MTjbt8v1x5LQAAGeeFV4X0'
        // }).get().then( res => {
        //   console.log(res )
        // } )

        // // 获取数据库集合所有数据
        //  db.get().then( res => {
        //    console.log( res )
        //  } )
      

      },
      fail(error){
        console.log(error)
      }
      
    })
  }


})