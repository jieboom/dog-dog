const app = getApp()
Page({
  data: {
    cells: []
  },
  onLoad: function () {
    const self = this
    const data = app.globalData.userMovieInfo.set
    
    let cells = [[]]
    cells[0].push({ title: '姓名', text: data.name == '' ? '未填写' : data.name, access: false, fn: '' })
    cells[0].push({ title: '昵称', text: data.nickName == '' ? '未填写' : data.nickName, access: false, fn: '' })
    cells[0].push({ title: '性别', text: data.gender == '' ? '未填写' : data.gender, access: false, fn: '' })
    cells[0].push({ title: '年龄', text: data.age == '' ? '未填写' : data.age, access: false, fn: '' })
    cells[0].push({ title: '生日', text: data.birthday == '' ? '未填写' : data.birthday, access: false, fn: '' })

    self.setData({
      cells
    })
  },
  onShow(){
    const self = this
    const data = app.globalData.userMovieInfo.set
    
    let cells = [[]]
    cells[0].push({ title: '姓名', text: data.name == '' ? '未填写' : data.name, access: false, fn: '' })
    cells[0].push({ title: '昵称', text: data.nickName == '' ? '未填写' : data.nickName, access: false, fn: '' })
    cells[0].push({ title: '性别', text: data.gender == '' ? '未填写' : data.gender, access: false, fn: '' })
    cells[0].push({ title: '年龄', text: data.age == '' ? '未填写' : data.age, access: false, fn: '' })
    cells[0].push({ title: '生日', text: data.birthday == '' ? '未填写' : data.birthday, access: false, fn: '' })

    self.setData({
      cells
    })
  }
})