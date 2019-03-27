
// 云函数入口文件
const cloud = require('wx-server-sdk')
const reqP = require('request-promise')

cloud.init()
const DB = cloud.database()
const MAX_LIMIT = 1

// 云函数入口函数
exports.main = async (event, context) =>  {
      
      const db = DB.collection('movie')
   
     
      for( let i =1; i<10;i++){
        const movieItem = await reqP(`http://api.douban.com/v2/movie/top250?start=${i}&count=1`)
        await db.add({
          data : JSON.parse(movieItem).subjects[0]
        })
      }
     
}