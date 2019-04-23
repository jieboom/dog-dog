const cloud = require('wx-server-sdk')
cloud.init()
exports.main= async( event,context ) => {
 
 const {OPENID,APPID} = cloud.getWXContext()

 return{
   OPENID,
   APPID
 }

}