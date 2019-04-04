// 云函数入口文件
const cloud = require('wx-server-sdk')
const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/explore#!type=movie&tag=%E8%B1%86%E7%93%A3%E9%AB%98%E5%88%86&sort=recommend&page_limit=20&page_start=0'
let sleep = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

// 云函数入口函数
 ;(async (event, context) => {


  console.log(" start visit target page");

  const brower = await puppeteer.launch({
    args: ["--no-sandbox"]

  })

  const page = await brower.newPage()

  await page.goto(url, {
    waitUntil: 'networkidle0'
  })

  await page.waitForSelector('.more')

  for (let i = 0; i < 1; i++) {
    await sleep(2000)
    page.click('.more')

  }

  const res = await page.evaluate(() => {

    var $ = window.$
    var items = $('.list-wp .item')

    var links = []
    if (items.length > 0) {
      items.each((index, el) => {
        var el = $(el)

        var doubanId = el.find('.cover-wp').data('id')
        var rate = el.find('strong').text()
        var contentLink = el.attr('href')





        links.push({
          doubanId,
          rate,
          contentLink
        })
      })
    }

    return links
  })




  if (res && res.length > 0) {
    res.forEach(targetEl => {
      
      ;(async () =>  {
        const doubanId = targetEl.doubanId
        console.log(doubanId);
        
        let trailerLink 
        const contentPage = await brower.newPage()
        const  targetLink = "https://movie.douban.com/subject/" + doubanId+"/"
 
        await contentPage.goto(targetLink, {
          waitUntil: "networkidle0"
        })
        console.log(123);
        
        return
        await sleep(1000)
       
        
        await contentPage.evaluate(() => {
          var $ = window.$
          var content = $('#content')
          
          trailerLink = $('.related-pic-video').attr('href')
          if (!trailerLink) return false

          targetEl.name = content.find('h1 span:first-child').text()
          targetEl.wantCount = content.find('.subject-others-interests-ft a:last-child').text()
          targetEl.type = content.find('span[property="v:genre"]').text()
          targetEl.actor = []

          // 获取演员
          var celebritys = targetEl.find('.celebrities-list .celebrity')
          celebritys.each((index, celebritysEl) => {
            celebritysEl = $(celebritysEl)
            var name = celebritysEl.find('.name a').text()
            var avaterBg = celebritysEl.find('.avater').css('background-image')
            var avater = avater.subString(avaterBg.indexOf('(') + 1, avaterBg.indexOf(')'))

            targetEl.actor.push({
              name,
              avater
            })


          })


          

        })()
        console.log(targetEl);
        
        
        
        contentPage.close()

        // 获取电影预告片
        const trailerpage = await brower.newPage()
        await trailerpage.goto(trailerLink, {
          waitUntil: "networkidle0"
        })

        await trailerpage.evaluate(() => {
          var $ = window.$
          var trailerUrl = $('#movie_player source').attr('src')

          targetEl.trailerUrl = trailerUrl


        })
        trailerpage.close()

        // 获取海报封面图
      
        const posterUrl = "https://movie.douban.com/subject/" + doubanId + "/photos?type=R"
        const posterPage = await brower.newPage()

        await posterPage.goto(posterUrl, {
          waitUntil: 'networkidle0'
        })

        await posterPage.evaluate(() => {
          var $ = window.$
          var posterWrappers = $('.poster-col3 li')
          if (posterWrappers.length > 0) {
            posterWrappers.each((index, posterEl) => {
              posterEl = $(posterEl)
              var mixSpec = posterEl.find('.prop')
              var specArray = mixSpec.split('x')
              if (specArray[0] / specArray[1] > 1.5 && specArray[0] / specArray[1] > 2.5) {
                targetEl.poster = posterEl.find('.cover img').attr('src')
              }
            })
          }


        })

        posterPage.close()

        






      })()


    })
  }











})()