const puppeteer = require('puppeteer')

const url = 'https://movie.douban.com/explore#!type=movie&tag=%E8%B1%86%E7%93%A3%E9%AB%98%E5%88%86&sort=recommend&page_limit=20&page_start=0'
let sleep = (time) => {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

;
(async () => {
    console.log(" start visit target page");

    const brower = await puppeteer.launch({
        headless: false,
        args: ["--no-sandbox"]

    })

    const page = await brower.newPage()

    await page.goto(url, {
        waitUntil: 'networkidle0'
    })

    // await page.waitForSelector('.more')

    // for(let i=0;i < 10;i++){
    //     sleep(2000)
    //     page.click('.more')
    // }

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
        res.forEach((targetEl, index) => {

            
            ;(async () => {
                const doubanId = targetEl.doubanId
            

                // await sleep(2000 * index + 2000)

                // const contentPage = await brower.newPage()
                // await contentPage.goto(targetEl.contentLink, {
                //     waitUntil: "networkidle0"
                // })
                // await sleep(2000)
              
                
                // const other = await contentPage.evaluate(() => {

                    
                //     var $ = window.$
                //     var content = $('#content')

                //     let trailerLink = $('.related-pic-video').attr('href')
                //     if (!trailerLink) return false

                //     let name = content.find('h1 span:first-child').text()
                //     let wantCount = content.find('.subject-others-interests-ft a:last-child').text()
                //     let type = content.find('span[property="v:genre"]').text()
                //     let actor = []

                //     // 获取演员
                //     var celebritys = content.find('.celebrities-list .celebrity')
                //     celebritys.each((index, celebritysEl) => {
                //         celebritysEl = $(celebritysEl)
                //         var name = celebritysEl.find('.name a').text()
                //         var avatarBg = celebritysEl.find('.avatar').css('backgroundImage')
                        
                //         var avatar = avatarBg.substring(avatarBg.indexOf('"') + 1, avatarBg.lastIndexOf('"'))

                //         actor.push({
                //             name,
                //             avatar
                //         })


                //     })

                //     return {
                //         name,
                //         wantCount,
                //         type,
                //         actor,
                //         trailerLink
                //     }

                // }).catch( err => {
                //     console.log(err);
                    
                // } )
                // targetEl.name = other.name
                // targetEl.wantCount = other.wantCount
                // targetEl.type = other.type
                // targetEl.actor = other.actor
                // targetEl.trailerLink = other.trailerLink
                // contentPage.close()
                
               

                // // 获取电影预告片
                // const trailerpage = await brower.newPage()
                // await trailerpage.goto(targetEl.trailerLink, {
                //     waitUntil: "networkidle0"
                // })
                // await sleep( 1000 )
                // const trailer = await trailerpage.evaluate(() => {
                //     var $ = window.$
                //     var trailerUrl = $('#movie_player source').attr('src')

                   
                //     return trailerUrl
                // })
                // trailerpage.close()

                // targetEl.trailer = trailer
                
                // console.log(targetEl);

                // 获取电影海报 
                sleep( 2000*index + 2000  )
                 const posterLink = "https://movie.douban.com/subject/"+doubanId+"/photos?type=R"
                 const posterPage = await brower.newPage()

                 await posterPage.goto( posterLink ,{
                     'timeout' : 0,
                     'waitUntil':  'domcontentloaded'
                 })

                 sleep( 1000 )

                 const poster = await posterPage.evaluate( () =>{
                      var $ = window.$

                      var content = $('#content')
                      var posterArr = content.find('.poster-col3 li')
                      const nearRatio = 2
                      let minNear = 2
                      let minNearIndex =  0
                      posterArr.each( (index,posterEl) =>  {
                            posterEl = $(posterEl)
                           

                            const propMixin = posterEl.find('.prop').text()
                             
                            const propArr = propMixin.split('x')

                            const propRatio = propArr[0]/propArr[1]
                             
                           if( Math.abs( propRatio - nearRatio ) < minNear) {
                             minNear = propRatio
                             minNearIndex = index
                           }

                           
                           
 
                             
                             
                            
                            


                      })

                      return {
                        propArr
                      }
        


                 } )
                 console.log(poster);
                 
                
               


            })()



        })
    }

})()