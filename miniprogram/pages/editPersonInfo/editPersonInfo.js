const app = getApp()
var util = require('../../util/util')
Page({
  data: {
    name: '',
    nickName: '',
    gender: 0,
    genderArray: ['男', '女'],
    genderIndex: 0,
    age: 0,
    birthday: '',

  },
  onLoad: function (options) {
    var birthdayEndDate = util.getDate()
    var that = this



    const data = app.globalData.userMovieInfo.set
    that.setData({
      name: data.name,
      nickName: data.nickName,
      gender: data.gender,
      age: data.age,
      birthday: data.birthday
      
    })


  },
  savePersonInfo: function (e) {
    var data = e.detail.value
    app.globalData.userMovieInfo.set = {
      name: data.name,
      nickName: data.nickName,
      gender: data.gender,
      age: data.age,
      birthday: data.birthday

    }



    wx.showToast({
      title: '资料修改成功',
      icon: 'success',
      duration: 2000
    })
    setTimeout(function () {
      wx.redirectTo({
        url: '../personInfo/personInfo'
      })
    }, 2000)


  },
  changeGender: function (e) {
    console.log(e)
    var genderIndex = e.detail.value
    if (genderIndex != "null") {
      this.setData({
        genderIndex: genderIndex,
        gender: this.data.genderArray[this.data.genderIndex]
      })
    }
  },
  changeBirthday: function (e) {
    var birthday = e.detail.value
    if (birthday != "null") {
      this.setData(
        { birthday: birthday }
      )
    }
  },
  changeConstellation: function (e) {
    var constellationIndex = e.detail.value
    if (constellationIndex != "null") {
      this.setData({
        constellationIndex: constellationIndex,
        constellation: this.data.constellationArray[this.data.constellationIndex]
      })
    }
  }
})