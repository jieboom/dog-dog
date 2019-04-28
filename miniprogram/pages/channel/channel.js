Page({
  data: {
    typeList: [
      {
        url: '../../common/images/music.jpg',
        desc: "音乐"
      },
      {
        url: '../../common/images/story.jpg',
        desc: "剧情"
      },{
        url:'../../common/images/cartoon.jpg',
        desc:"动画"
      },{
        url:'../../common/images/fiction.jpg',
        desc:"科幻"
      },{
        url:'../../common/images/comedy.jpg',
        desc:"喜剧"
      },{
        url:'../../common/images/love.jpg',
        desc:"爱情"
      },{
        url:'../../common/images/documentary.jpg',
        desc:"传记"
      },{
        url:'../../common/images/panic.jpg',
        desc:"惊悚"
      }
      
    ]
  },
  goChannelDetail(e){
     const type = e.currentTarget.dataset.type
     
     wx.navigateTo({
       url: '../../pages/channelDetail/channelDetail?type='+type
     })
  }
})