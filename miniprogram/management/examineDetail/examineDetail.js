const app = getApp()
let that = null
Page({
	data: {
    navbarData: {
      showCapsule: 1,
      title: "作品打分",
			bg_color: "url(https://636c-cloud1-4gojwhjp38f8a41c-1315829236.tcb.qcloud.la/icon/pageBg.jpg) no-repeat,#F5EFFF",
			bottomLine_color: "#D9DCE5"
    },
    height: app.globalData.height,
		upLoadWorkDetail: {},
		upLoadWorkList: [],
    score: {
      score4: 0,
      score5: 0,
      score6: 0,
    },
		totalScore: 0,
		hasGetScore: false,
    currentPage: 0,
  },
  onLoad(options){
    console.log(options)
    that = this
    wx.cloud.callFunction({
      name: "getUserInfo",
      success: res=>{
        console.log(res.result.data.type)
        if(res.result.data.type==4||res.result.data.type==5){
          console.log(res.result.data.type)
        }else{
          wx.showModal({
            title:'提示',
            content:"该页面不对用户开放",
            showCancel:false,
            success(res){
              if(res.confirm){
                wx.switchTab({
                  url:'/pages/index/index'
                })
              }
            }
          })
        }
      }
    })
		that.data.upLoadWorkList.push(options.id)
		that.setData({
			upLoadWorkList: that.data.upLoadWorkList
		})
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: "FirstWorks",
      data: {
        type: "getById",
        _id: options.id
      },
      success: res=>{
        console.log(res)
        wx.hideLoading()
        that.setData({
          upLoadWorkDetail: res.result.list[0],
          score: res.result.list[0].score?res.result.list[0].score:that.data.score,
          totalScore: res.result.list[0].score?Object.values(res.result.list[0].score).reduce( (total, obj) => {
            return Number(obj) + Number(total);
					}):0,
					hasGetScore: res.result.list[0].scoreTotal>0?true:false
        })
      }
    })
  },
  watcher(e){
    wx.cloud.database().collection('FirstWorks').doc(e)
      .watch({
        onChange: function (snapshot) {
          console.log(snapshot)
          if(snapshot.docs[0].scoreTotal!=0){
            wx.showToast({
              title: '已打分，将自动切换下一名',
              icon: "none",
              mask: true,
              duration: 2000
            })
            setTimeout(function(){
              that.nextWork()
            },2000)
          }
        },
        onError: function (err) {
          console.error('the watch closed because of error', err)
        }
      })
  },
  confirmScore(){
		var that = this
		wx.showModal({
			title: '确认分数',
			content: "分数确认后不可修改，请谨慎打分",
			success (res) {
				if (res.confirm) {
					wx.showLoading({
						title: '加载中',
					})
					console.log(that.data.score)
					wx.cloud.callFunction({
						name: "FirstWorks",
						data: {
							type: "update",
							id: that.data.upLoadWorkDetail._id,
							score: that.data.score,
							scoreTotal: that.data.totalScore,
						},
						success: res => {
							wx.hideLoading()
							that.setData({
								hasGetScore: true
							})
						}
					})
				}
			}
		})
  },
  scoreOnChange(e) {
		var value = Number(e.detail)>Number(e.currentTarget.dataset.maxvalue)?Number(e.currentTarget.dataset.maxvalue):(Number(e.detail)<0?0:Number(e.detail))
    this.data.score[e.currentTarget.dataset.value]=value
    this.data.totalScore = Object.values(that.data.score).reduce( (total, obj) => {
			return Number(obj) + Number(total);
		})
    this.setData({
      score: this.data.score,
      totalScore: this.data.totalScore
    })
  },
  // 上一个
  previousWork(){
    if (that.data.currentPage==0) {
      wx.showToast({
        icon: "none",
        title: '没有更多了',
      })
      return
		}
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      currentPage: that.data.currentPage - 1
		})
    wx.cloud.callFunction({
      name: "FirstWorks",
      data: {
        type: "getById",
        _id: that.data.upLoadWorkList[that.data.currentPage]
      },
      success: res=>{
        console.log(res)
        wx.hideLoading()
				wx.pageScrollTo({
					scrollTop: 0,
					duration: 100,
				})
				for(var key in that.data.score){
					that.data.score[key]=0
				}
        that.setData({
          upLoadWorkDetail: res.result.list[0],
          score: res.result.list[0].score?res.result.list[0].score:that.data.score,
          totalScore: res.result.list[0].score?Object.values(res.result.list[0].score).reduce( (total, obj) => {
            return Number(obj) + Number(total);
          }):0,
					hasGetScore: res.result.list[0].scoreTotal>0?true:false
        })
      }
    })
  },
  // 下一个
  nextWork(){
    that.setData({
      currentPage: that.data.currentPage + 1
    })
    wx.showLoading({
      title: '加载中',
		})
		console.log(that.data.currentPage)
		var data = {
			_id: that.data.upLoadWorkList[0],
			pageSize: 1,
			currentPage: that.data.currentPage,
		}
		if(app.globalData.userType==4){
			data.judges_id = app.globalData.user_id
		}
		console.log(data)
    wx.cloud.callFunction({
      name: "getNoExamineWork",
      data: data,
      success: res => {
        console.log(res)
        wx.hideLoading()
        if(res.result.list.length>0){
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 100,
          })
					for(var key in that.data.score){
						that.data.score[key]=0
					}
					if(that.data.upLoadWorkList.length<=that.data.currentPage){
						that.data.upLoadWorkList.push(res.result.list[0]._id)
					}
          that.setData({
						totalScore: 0,
						score: that.data.score,
            upLoadWorkDetail: res.result.list[0],
						upLoadWorkList: that.data.upLoadWorkList,
						hasGetScore: res.result.list[0].scoreTotal>0?true:false
					})
        }else{
					that.setData({
						currentPage: that.data.currentPage - 1
					})
          wx.showToast({
            icon: "none",
            title: '没有更多了',
          })
        }
      },
      fail:err=>{
        wx.hideLoading()
        console.log(err)
      }
    })
  },
  copy(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.value
    })
	},
})