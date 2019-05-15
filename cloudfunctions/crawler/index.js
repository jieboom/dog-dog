const puppeteer = require('puppeteer')

const qiniu = require('qiniu')
const fs = require('fs')
const nanoid = require('nanoid')
const config = require('./config')



const bucket = config.qiniu.bucket
 ;(async () => {
  const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)

  const cfg = new qiniu.conf.Config()
  const client = new qiniu.rs.BucketManager(mac, cfg)

  const uploadToQiniu = (url, key) => {
    return new Promise((reslove, reject) => {
      client.fetch(url, bucket, key, (err, ret, info) => {
        if (err) {
          reject(err)
        } else {
          if (info.statusCode == 200) {
            reslove(key)
          } else {
            reject(info)
          }
        }
      })
    })
  }


  const url = 'https://movie.douban.com/explore#!type=movie&tag=%E8%B1%86%E7%93%A3%E9%AB%98%E5%88%86&sort=recommend&page_limit=20&page_start=0'
  let sleep = (time) => {
    return new Promise(resolve => {
      setTimeout(resolve, time)
    })
  }

  const getMovies = async () => {
    console.log(" start visit target page");

    const brower = await puppeteer.launch({
      args: ["--no-sandbox"],  //无沙箱模式
    })

    const page = await brower.newPage()

    await page.goto(url, {
      waitUntil: 'networkidle0'
    })

    await page.waitForSelector('.more')

    for(let i=0;i < 25;i++){
        console.log(i);
        
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
    console.log('已获取爬取电影目录列表, 电影列表数目为' + res.length)
    console.log(res);
    
    if (res && res.length > 0) {

      let k = 0
      const len = res.length
      const getMovieDetail = async (index, targetEl) => {

        const doubanId = targetEl.doubanId
        const contentPage = await brower.newPage()

        await contentPage.goto(targetEl.contentLink, {
          waitUntil: 'domcontentloaded',
          timeout: 0
        })


        const other = await contentPage.evaluate(() => {

          var $ = window.$
          var content = $('#content')

          let trailerLink = $('.related-pic-video').attr('href')
          if (!trailerLink) return false

          let name = content.find('h1 span:first-child').text()
          let wantCount = parseInt(content.find('.subject-others-interests-ft a:last-child').text())
          let type = content.find('span[property="v:genre"]').text()
          let indent = content.find('#link-report span').text()
          indent = indent.replace(/\s|©豆瓣/g,'')
          let actor = []

          // 获取演员
          var celebritys = content.find('.celebrities-list .celebrity')
          celebritys.each((index, celebritysEl) => {
            celebritysEl = $(celebritysEl)
            var name = celebritysEl.find('.name a').text()
            var avatarBg = celebritysEl.find('.avatar').css('backgroundImage')
            var bgLen = avatarBg.length
            var avatar = avatarBg.substring(avatarBg.lastIndexOf('"', bgLen - 5) + 1, avatarBg.lastIndexOf('"'))
            const celebritysItem = {
              name,
              avatar
            }
            actor.push(celebritysItem)


          })

          return {
            name,
            wantCount,
            type,
            indent,
            actor,
            trailerLink
          }

        })


        targetEl.name = other.name
        targetEl.wantCount = other.wantCount
        targetEl.type = other.type
        targetEl.actor = other.actor
        targetEl.trailerLink = other.trailerLink
        targetEl.indent = other.indent

        contentPage.close()


        // 获取电影预告片
        const trailerpage = await brower.newPage()
        await trailerpage.goto(targetEl.trailerLink, {
          timeout: 0,
          waitUntil: 'domcontentloaded'
        })
        const trailer = await trailerpage.evaluate(() => {
          var $ = window.$
          var trailerUrl = $('#movie_player source').attr('src')


          return trailerUrl
        })
        trailerpage.close()


        targetEl.trailer = trailer

        //获取海报
        const posterPage = await brower.newPage()
        const posterLink = "https://movie.douban.com/subject/" + doubanId + "/photos?type=R"
        await posterPage.goto(posterLink, {
          timeout: 0,
          waitUntil: 'domcontentloaded'
        })

        const poster = await posterPage.evaluate(() => {
          var $ = window.$

          var posterContent = $('#content')

          var posterItems = posterContent.find('.poster-col3 li')

          const nearRatio = 2
          let minNearRatio = 2
          let minNearIndex = 0



          posterItems.each((posterIndex, posterEl) => {


            posterEl = $(posterEl)

            const propStr = posterEl.find('.prop').text().replace(/[\n\s]/g, '')

            const propArr = propStr.split('x')

            if (Math.abs(propArr[0] / propArr[1] - nearRatio) < minNearRatio) {
              minNearRatio = Math.abs(propArr[0] / propArr[1] - nearRatio)
              minNearIndex = posterIndex
            }



          })
          const poster = $('.poster-col3 li:eq(' + minNearIndex + ') img').attr('src')

          return poster
        })
        targetEl.poster = poster
        posterPage.close()
        delete targetEl.contentLink
        delete targetEl.trailerLink

        return targetEl
      }

      while (k < len) {
        console.log('正在爬取第' + (k + 1) + '项数据')
        try{
          await getMovieDetail(k, res[k])
        }catch( err ){
          console.log(err);
          
        }
        k++
      }
    }
    return res
  }




  const movieData = await getMovies()
  console.log(movieData);
  
  
  let k = 0
  const len = movieData.length
  const upLoadItem = async k => {
    console.log(k);
    
    let nanoId = nanoid()
    await uploadToQiniu(movieData[k].trailer, nanoId + '.mp4')
    movieData[k].trailer = 'http://pr0d5m3ud.bkt.clouddn.com/' + nanoId + '.mp4'

    nanoId = nanoid()
    await uploadToQiniu(movieData[k].poster, nanoId + '.jpg')
    movieData[k].poster = 'http://pr0d5m3ud.bkt.clouddn.com/' + nanoId + '.jpg'

    for (let i = 0; i < movieData[k].actor.length; i++) {
      nanoId = nanoid()
      await uploadToQiniu(movieData[k].actor[i].avatar, nanoId + '.jpg')
      movieData[k].actor[i].avatar = 'http://pr0d5m3ud.bkt.clouddn.com/' + nanoId + '.jpg'
    }
    console.log("成功上传第"+(k+1)+"条数据");
    
  }
  while (k < len) {
   try{
    await upLoadItem(k)
   
   }catch(err){
    movieData.splice(k,1)
     console.log(err);
     
   }
   k++
  
  }
   fs.writeFile('movieHot.json',JSON.stringify(movieData),(err) => {
     if( err ) throw err
     console.log('电影数据写入成功');
     
   })

 

})()