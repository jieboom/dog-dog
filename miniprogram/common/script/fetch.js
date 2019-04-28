function fetchMovieList(collection, start, cb, cb_fail) {
    const reqMaxCount = 5  //一次加载预告片最大数量
    const self = this
    const movieCo = wx.cloud.database().collection(collection)
    
    setTimeout(() => {
        if (start < reqMaxCount) {
            movieCo.limit(reqMaxCount).get()
                .then(res => {
                   
                    if (res.data.length < 5) {
                        self.setData({
                            hasMore: false,
                            movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
                        })
                    } else {
    
                        self.setData({
                            
                            movieSkinIndex: self.data.movieSkinIndex + reqMaxCount,
                        })
                    }
    
    
                    typeof cb == 'function' && cb(res.data)

                    self.setData({
                        showLoading: false
                    })
                })
                .catch(error => {
                   
                    typeof cb_fail && cb_fail()

                    self.setData({
                        showLoading: false
                    })
    
                })
    
        } else {
            movieCo.skip(start).limit(reqMaxCount).get()
                .then(res => {
                   
                    if (res.data.length < 5) {
                        self.setData({
                            hasMore: false,
                            movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
                        })
                    } else {
    
                        self.setData({
                            
                            movieSkinIndex: self.data.movieSkinIndex + reqMaxCount,
                        })
                    }
                    typeof cb == 'function' && cb(res.data)

                    self.setData({
                        showLoading: false
                    })
                })
                .catch(error => {
                   
    
                    typeof cb_fail && cb_fail()
                    self.setData({
                        showLoading: false
                    })
                })
        }
    }, 500);  //模拟网络延迟



}
function fetchDetail( collection ,id ,cb ,cb_fail ){
    const movieCo = wx.cloud.database().collection(collection)
    movieCo.doc(id).get()
    .then(res => {
        typeof cb == 'function' && cb(res.data)
    } )
}

function fetchSearchResult( collection , start,key,cb,cb__fail ){
    const reqMaxCount = 5  //一次加载预告片最大数量
    const self = this
    const movieCo = wx.cloud.database().collection(collection)
    const keyRE = new RegExp(key)
    setTimeout(() => {
        if (start < reqMaxCount) {
            movieCo.where({
                name: keyRE
            }).limit(reqMaxCount).get()
                .then(res => {
                   
                    if (res.data.length < 5) {
                        self.setData({
                            hasMore: false,
                            movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
                        })
                    } else {
    
                        self.setData({
                            
                            movieSkinIndex: self.data.movieSkinIndex + reqMaxCount,
                        })
                    }
    
    
                    typeof cb == 'function' && cb(res.data)

                    self.setData({
                        showLoading: false
                    })
                })
                .catch(error => {
                   
                    typeof cb_fail && cb_fail()

                    self.setData({
                        showLoading: false
                    })
    
                })
    
        } else {
            movieCo.where({
                name: keyRE
            }).skip(start).limit(reqMaxCount).get()
                .then(res => {
                   
                    if (res.data.length < 5) {
                        self.setData({
                            hasMore: false,
                            movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
                        })
                    } else {
    
                        self.setData({
                            
                            movieSkinIndex: self.data.movieSkinIndex + reqMaxCount,
                        })
                    }
                    typeof cb == 'function' && cb(res.data)

                    self.setData({
                        showLoading: false
                    })
                })
                .catch(error => {
                   
    
                    typeof cb_fail && cb_fail()
                    self.setData({
                        showLoading: false
                    })
                })
        }
    }, 500);  //模拟网络延迟
}
function fetchTypeList(collection, start,type, cb, cb_fail) {
    const reqMaxCount = 5  //一次加载预告片最大数量
    const self = this
    const movieCo = wx.cloud.database().collection(collection)
    const typeRE = new RegExp(type)
    setTimeout(() => {
        if (start < reqMaxCount) {
            movieCo.where({
                  type: typeRE
            }).limit(reqMaxCount).get()
                .then(res => {
                   
                    if (res.data.length < 5) {
                        self.setData({
                            hasMore: false,
                            movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
                        })
                    } else {
    
                        self.setData({
                            
                            movieSkinIndex: self.data.movieSkinIndex + reqMaxCount,
                        })
                    }
    
    
                    typeof cb == 'function' && cb(res.data)

                    self.setData({
                        showLoading: false
                    })
                })
                .catch(error => {
                   
                    typeof cb_fail && cb_fail()

                    self.setData({
                        showLoading: false
                    })
    
                })
    
        } else {
            movieCo.where({
                type: typeRE
            }).skip(start).limit(reqMaxCount).get()
                .then(res => {
                   
                    if (res.data.length < 5) {
                        self.setData({
                            hasMore: false,
                            movieSkinIndex: self.data.movieSkinIndex + reqMaxCount
                        })
                    } else {
    
                        self.setData({
                            
                            movieSkinIndex: self.data.movieSkinIndex + reqMaxCount,
                        })
                    }
                    typeof cb == 'function' && cb(res.data)

                    self.setData({
                        showLoading: false
                    })
                })
                .catch(error => {
                   
    
                    typeof cb_fail && cb_fail()
                    self.setData({
                        showLoading: false
                    })
                })
        }
    }, 500);  //模拟网络延迟



}

module.exports = {
    fetchMovieList,
    fetchDetail,
    fetchSearchResult,
    fetchTypeList
}

