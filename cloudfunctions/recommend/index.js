// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const movieHotCo = cloud.database().collection('movieHot')
const userCo = cloud.database().collection('user')
// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  const typeArr = event.typeArr


  //将用户类型权重数组改成对象表示   提高性能

  
  const typeObj = {}
  const ipttTypeArr = ['音乐','动画','科幻','喜剧','爱情','传记','惊悚']
  typeArr.forEach(el => {
    const count = ipttTypeArr.includes(el.type)? el.count*2: el.count
    typeObj[el.type] = count
  })

  
  // 获取数据库所有电影资源   因为限制一次只能获取100条 所以需要多次获取
  const limitMax = 100
  const docCountData = await movieHotCo.count()
  const docCount = docCountData.total


  const batchTimes = Math.ceil(docCount / limitMax)
  let tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = movieHotCo.skip(i * limitMax).limit(limitMax).get()
    tasks.push(promise)
  }


  const movieData = await Promise.all(tasks)

  let movieList = []
  movieData.forEach(el => {
    movieList = movieList.concat(el.data)
  })
  
  
  
  //为电影资源增加相对于用户的权重属性

  movieList.forEach(el => {
    const typeStr = el.type
    let typeArr = []
    for (let i = 0; i <= typeStr.length - 2; i += 2) {
      typeArr.push(typeStr.substring(i, i + 2))
    }
    let typeValue = 0   //电影相对于用户的权重
    
    typeArr.forEach(typeItem => {
      if( typeItem in typeObj){
        typeValue += typeObj[typeItem]
      }
      
    })
    console.log(typeArr,typeValue);
    
    el.typeValue = typeValue
  })
  movieList.sort((item1, item2) => {
    return item2.typeValue - item1.typeValue
  })
  
  const test = await userCo.where({
    _openid: wxContext.OPENID
  }).update({
    data:{
      recommendList: movieList.slice(0,50)
    }
  })

  









}