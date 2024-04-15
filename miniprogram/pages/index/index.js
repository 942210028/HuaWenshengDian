const app = getApp()
let that = null
const pageSize = 50
Page({
  data: {
    navbarData: {
      showCapsule: 0,
      title: "",
			bg_color: "#b81d1d",
			bottomLine_color: "#a56f6f"
    },
    height: app.globalData.height,
    userType: app.globalData.userType,
		userInfo: {},
		bannerImgList: [{
        bannerImg: "cloud://cloud1-4gojwhjp38f8a41c.636c-cloud1-4gojwhjp38f8a41c-1315829236/raceBanner3.png",
        route: ""
      },
    ],
    joinRaceUserList: [], //管理端参赛人员
    totalUserList: [], //管理端参与用户人数
		currentPage: 1,
    hasMoreData: true,
    isLoadingMoreData: false,
  },
  onLoad (options) {
    that = this
    if(app.globalData.userType){
      that.setData({
        userType: app.globalData.userType,
      })
    }else{
      console.log(app.globalData.userType)
      app.userInfoReadyCallback=res=>{
        that.setData({
          userType: res
        })
      }
		}
		wx.cloud.callFunction({
			name: "indexVIdeoShow",
			success: res=>{
				console.log(res)
				if(res.result.data.indexVIdeoShow){
					that.setData({
						indexVIdeoShow: true
					})
				}else{
					that.setData({
						indexVIdeoShow: false
					})
				}
			}
		})
		wx.cloud.callFunction({
			name: "getUserInfo",
			success: res => {
				if (res.result&&res.result.data) {
          console.log("已注册")
          that.setData({
            userInfo: res.result.data
          })
          if(res.result.data.type>3){
            that.getJoinRaceUserList()
          }
				}
			}
    })
    wx.cloud.callFunction({
      name: "getUserList",
      data: {
        type: "getall",
        pageSize: 4,
        currentPage: 1
      },
      success: res=>{
        console.log(res)
        that.setData({
          totalUserList: res.result.list
        })
      }
    })
    // wx.cloud.callFunction({
    //   name: "creatCode",
    //   data: {
    //     page: "pages/index/index",
    //     scene: "a=1",
    //     cloudPath: `index.jpg`
    //   },
    // })
  },
  // 管理端获取参赛人信息
  getJoinRaceUserList(){
		wx.cloud.callFunction({
			name: 'FirstWorks',
			data: {
        type: 'getall',
        pageSize: pageSize,
        currentPage: that.data.currentPage,
        group: that.data.typeMenuSelect
      },
      success: res => {
        console.log(res)
        that.setData({
          joinRaceUserList: res.result.list
        })
      }
    })
  },
  // 轮播图查看比赛结果
  // toBannerDetail(){
  //   wx.previewImage({
  //     current: "cloud://cloud1-4gojwhjp38f8a41c.636c-cloud1-4gojwhjp38f8a41c-1315829236/raceResult.jpg",
  //     urls: ["cloud://cloud1-4gojwhjp38f8a41c.636c-cloud1-4gojwhjp38f8a41c-1315829236/raceResult.jpg"]
  //   })
  // },
	// 跳转在线审阅
	toExamine(){
		wx.switchTab({
			url: '../examine/examine',
		})
	},
  // 管理端用户修改信息
  toEditUserInfo(){
    wx.navigateTo({
      url: `../../management/editUserInfo/editUserInfo?id=${that.data.userInfo._id}`,
    })
  },
  // 跳转参赛人员列表
  toJoinRaceUserList(){
    wx.navigateTo({
      url: '../../management/joinRaceUserList/joinRaceUserList',
    })
  },
  // 跳转参赛人员信息详情
  toJoinRaceUserDetail(e) {
		console.log(e)
    wx.navigateTo({
      url: `../../management/joinRaceUserDetail/joinRaceUserDetail?user_id=${e.currentTarget.dataset.id}`,
    })
  },
	// 我要报名
	toEntrance() {
    wx.showToast({
      icon: "none",
      title: '报名已截止',
    })
    // console.log(app.globalData)
    // if (!app.globalData.userType) {
    // 	wx.navigateTo({
    // 		url: '../entrance/entrance',
    // 	})
    // } else {
		// 	wx.showToast({
		// 		icon: "none",
		// 		title: '已注册，请勿重复报名',
		// 	})
		// }
	},
	// 赛事专区
	toRacePage(){
		wx.switchTab({
			url: '../race/race',
		})
	},
	// 获奖查询
	toGetPrize(){
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'FirstWorks',
      data: {
        type: 'get',
      },
      success:res=>{
        console.log(res)
        wx.hideLoading()
        if(res.result.list.length>0){
          wx.navigateTo({
            url: `../workDetail/workDetail?id=${res.result.list[0]._id}`,
          })
        }else{
          wx.showToast({
            title: '未查询到作品，请重试',
            icon: 'none'
          })
        }
      }
    })
	},
	// 赛事介绍
	toRaceDetail(){
		wx.navigateTo({
			url: '../raceDetail/raceDetail',
		})
	},
	// 上传作品
	toUploadWorks(){
		console.log(app.globalData)
		if(app.globalData.userType){
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name: 'FirstWorks',
        data: {
          type: 'get',
        },
        success:res=>{
          console.log(res)
          wx.hideLoading()
          if(res.result.list.length>0){
            wx.navigateTo({
              url: `../uploadWorksEdit/uploadWorksEdit?_id=${res.result.list[0]._id}`,
            })
          }else{
            wx.showToast({
              icon: "none",
              title: '上传已截止',
            })
						// wx.navigateTo({
						// 	url: '../uploadWorks/uploadWorks',
						// })
          }
        }
      })
		}else{
			wx.showToast({
				icon: "none",
				title: '请先报名',
			})
		}
  },
  indexMenu(e){
    if(e.currentTarget.dataset.index==0){
      wx.navigateTo({
        url: '../indexSubPage/arrondiA/arrondiA',
      })
    }else if(e.currentTarget.dataset.index==1){
      wx.navigateTo({
        url: `../webView/webView?src=https://mp.weixin.qq.com/s/J-CUCbbUsl_lhlkPFmwtXw`,
      })
    }else if(e.currentTarget.dataset.index==2){
      wx.navigateTo({
        url: `../indexSubPage/video/video?video=video2`,
      })
    }else if(e.currentTarget.dataset.index==3){
      wx.navigateTo({
        url: `../webView/webView?src=https://mp.weixin.qq.com/s/W_vjy4_vGQKJv9ErashXXg`,
      })
    }
  },
  onShareAppMessage(){
    return {
      title: "全国青少年英语视频创作大赛",
      path: `/pages/index/index`,
      imageUrl: "cloud://cloud1-4gojwhjp38f8a41c.636c-cloud1-4gojwhjp38f8a41c-1315829236/pageShareImg.png"
    }
  },
  onReachBottom: function () {
    console.log("onReachBottom")
    if (that.data.isLoadingMoreData || !that.data.hasMoreData) {
      console.log("return")
      return
    }
    that.setData({
      isLoadingMoreData: true,
      currentPage: that.data.currentPage + 1
    })
    that.dataRefurbish()
  },
  dataRefurbish() {
		wx.cloud.callFunction({
			name: 'FirstWorks',
			data: {
        type: 'getall',
        pageSize: pageSize,
        currentPage: that.data.currentPage,
      },
      success: res => {
        console.log(res)
        if (res.result.list.length >= 0) {
          if (res.result.list.length < pageSize) {
            that.setData({
              hasMoreData: false
            })
          }
          that.setData({
            joinRaceUserList: that.data.joinRaceUserList.concat(res.result.list),
            isLoadingMoreData: false
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
})