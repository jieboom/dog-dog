const qiniu = require('qiniu')

const nanoid = require('nanoid')
 
const config = require('./config')

const bucket = config.qiniu.bucket


const mac =  new qiniu.auth.digest.Mac(config.qiniu.AK,config.qiniu.SK)

const cfg =  new qiniu.conf.Config()
const client  =  new qiniu.rs.BucketManager( mac , cfg )

const uploadToQiniu = async ( url,key ) =>{
    return new Promise( (reslove,reject) => {
        client.fetch( url,bucket,key,( err ,ret ,info ) => {
             if( err ){
                 reject( err ) 
             }else{
                 if( info.statusCode == 200 ){
                     reslove( key )
                 }else{
                     reject( info )
                 }
             }
             } )
    } )
}

;(async () => {
   let movies=[{
       video:'http://vt1.doubanio.com/201904021357/a147ab2a9b8c21a947f5eef6e21ed1d1/view/movie/M/402440451.mp4'
   }]
movies.map( async movie => {
    if( movie.video && !movie.key ){
        try {
            let video = await uploadToQiniu( movie.video, nanoid()+'.mp4' )

            console.log(video);
            
        } catch (error) {
            console.log(error);
            
        }
    }
} )

})()


