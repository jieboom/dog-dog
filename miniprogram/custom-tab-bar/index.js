Component({
  data: {
    selected: 0,
    color: "#ccc",
    selectedColor: "#ffffff",
    backgroundColor: "#000000",
    list: [
      {
        pagePath: "../pages/index/index",
        text: "推荐",
        iconPath: "../images/icon-tabbar.png",
        selectedIconPath: "../images/icon-tabbar-selected.png"
      },
      {
        pagePath: "../pages/channel/channel",
        text: "频道",
        iconPath: "../images/icon-tabbar.png",
        selectedIconPath: "../images/icon-tabbar-selected.png"
      }
    ]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})