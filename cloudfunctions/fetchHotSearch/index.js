// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const db = cloud.database()
  let usersRes = await db.collection('user').get()
  const users = usersRes.data
  let hotKeyListObj = {}
  users.forEach( el =>{
      const historyKey = el.historyKey

      historyKey.forEach( keyEl => {
           if(hotKeyListObj[keyEl]){
             hotKeyListObj[keyEl]++
           }else{
             hotKeyListObj[keyEl] = 1
           }
      } )
  })
 
  const hotKeyList = Object.keys(hotKeyListObj).slice(0,5)
  return {
    hotKeyList
  }
}