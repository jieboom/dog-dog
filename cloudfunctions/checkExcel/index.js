// 云函数入口文件
const cloud = require('wx-server-sdk')
const reqP = require('request-promise')
const CryptoJS = require('crypto-js')

cloud.init()

const db = cloud.database()
let newIndex = 0 //保存当前数据索引
let keyword //搜索关键字
let count //数据库搜索结果数量




// 云函数入口函数
exports.main = async (event, context) => {
     var ts = new Date().getTime() + "";
     var X_AK_TS = ts
     var X_AK_PIN = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(ts, "d7918d9f669f46e5a38494fa285998bb"))
     // 获取数据库资源
     const enterprise = await db.collection('factoryInfo')
     const matchDB = await db.collection('matchDB')
     
     // function checkItem(index){
     //      let initData = await enterprise.limit(1).get()
     //      keyword = initData.data[0]["原公司名称"]
     
     //      count = await enterprise.where({
     //           "原公司名称": keyword
     //      }).count()
     
     
     //      let dataWrapper = await enterprise.skip(index).limit(count.total).get()
     //      let data = dataWrapper.data
     
     //      var options = {
     //           uri: 'https://api.koios.cn/services/v2/rest/enterprise/search?keyword=' + encodeURI(keyword),
     //           headers: {
     //                'User-Agent': 'Request-Promise',
     //                "X-AK-KEY": "1f666607f3ca4587918c6a5feae8ecbd",
     //                "X-AK-PIN": X_AK_PIN,
     //                "X-AK-TS": X_AK_TS
     //           },
     //           json: true // Automatically parses the JSON string in the response
     //      };
     
     //      let res = await reqP(options)
     //      let matchNum = 0 //同关键字的匹配成功次数
     //      let matchData // 关键字第一次匹配成功
     
     //      data.forEach(element => {
     //           const items = res.data.items
     //           let flag = items.some(item => element["企业名称"] == item.ENTNAME)
     //           if (flag) {
     //                matchNum++
     //           }
     //           if (matchNum == 1) {
     //                matchData = element
     //           }
     
     //      });
     
     //      if (matchNum == 1) {
     
     //           delete matchData['_id']
     
     //           await matchDB.add({
     //                data: matchData
     //           })
     
     
     
     
     //      }
     
     //      newIndex = index + count.total
     // }
     // checkItem(newIndex)


     // newIndex = newIndex + count.total


     initData = await enterprise.skip(newIndex).limit(1).get()
     keyword = initData.data[0]["原公司名称"]

     count = await enterprise.where({
          "原公司名称": keyword
     }).count()
     dataWrapper = await enterprise.skip(newIndex).limit(count.total).get()
     data = dataWrapper.data
     options = {
          uri: 'https://api.koios.cn/services/v2/rest/enterprise/search?keyword=' + encodeURI(keyword),
          headers: {
               'User-Agent': 'Request-Promise',
               "X-AK-KEY": "1f666607f3ca4587918c6a5feae8ecbd",
               "X-AK-PIN": X_AK_PIN,
               "X-AK-TS": X_AK_TS
          },
          json: true // Automatically parses the JSON string in the response
     };

     res = await reqP(options)
     matchNum = 0 //同关键字的匹配成功次数
     matchData = '' // 关键字第一次匹配成功

     data.forEach(element => {
          const items = res.data.items
          let flag = items.some(item => element["企业名称"] == item.ENTNAME)
          if (flag) {
               matchNum++
          }
          if (matchNum == 1) {
               matchData = element
          }

     });
     if (matchNum == 1) {

          delete matchData['_id']

          await matchDB.add({
               data: matchData
          })




     }

     newIndex = newIndex + count.total







     return newIndex











}