const app = getApp()
Page({
    key:'',
   data:{
    initValue:'',
    hotKeyList:["jdasj","kfow","rwoirfjwe",'qwe','eqw','eqjiqjd1245'],
    historyKeyList:[]
   },
   onLoad(){
     const historyKeyList = app.globalData.userMovieInfo.historyKey 
     this.setData({
        historyKeyList
     })
   },
   onShow(){
      this.setData({
          initValue: ''
      })
   },
   setKey(e){
       this.key = e.detail.value
   },
   searchByKey(e){
       const self = this
      //判断是否是热门和历史搜索触发的
      if(e.currentTarget.dataset.key){
          self.key = e.currentTarget.dataset.key
      }
      //判断搜索关键字是否与历史搜索重复,
      //如若重复,就将该关键字提升到历史搜索的第一位

      let historyKeyList = self.data.historyKeyList
      historyKeyList = historyKeyList.filter(el => {
          if( el !== self.key) return el
      })

      //判断搜索历史长度是否超过长度,如若是,就删除最后一个关键字
      if( self.data.historyKeyList.length === 10 ){
        historyKeyList.pop()
      }

      historyKeyList.unshift(self.key)
      setTimeout( () => {
        self.setData({
            historyKeyList: historyKeyList
        })
      },1000)
      app.globalData.userMovieInfo.historyKey  = historyKeyList
      wx.navigateTo({
          url: '../searchResult/searchResult?key='+self.key 
      })
   }
   
   
})