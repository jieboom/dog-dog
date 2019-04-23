// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const movieCo = cloud.database().collection('movieHot')
  const movieDetail = await movieCo.doc(event.id).get()
  let danmuList = movieDetail.data.danmuList
  
  danmuList.push({
    text: event.text,
    time: event.time
  })
  const res =await movieCo.doc(event.id).update({
   data:{
     danmuList: danmuList
   }
  })
  return res

 
}