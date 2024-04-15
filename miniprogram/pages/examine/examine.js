const app = getApp()
let that = null
Page({
	data: {
    navbarData: {
      showCapsule: 0,
      title: "在线审阅",
			bg_color: "url(https://636c-cloud1-4gojwhjp38f8a41c-1315829236.tcb.qcloud.la/icon/pageBg.png) no-repeat, #F5EFFF no-repeat",
			bottomLine_color: "#DFDDE5"
    },
		height: app.globalData.height,
    totalUserList: [], //管理端参与用户人数
    sortWorkList: [], //用户排名
	},
	onLoad(options) {
    that = this
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
		wx.cloud.callFunction({
			name: 'FirstWorks',
			data: {
        type: 'getall',
        pageSize: 3,
        currentPage: 1,
        scoreTotal: -1
      },
			success: res => {
				console.log(res.result.list)
				that.setData({
					sortWorkList: res.result.list
				})
			}
		})
  },
  toUploadWorkList(){
		wx.showLoading({
			title: '跳转中',
		})
		wx.cloud.callFunction({
      name: "getUserInfo",
      success:res=>{
				console.log(res)
        if(res.result&&res.result.data){
					console.log(res.result.data)
					if(res.result.data.type==4){
						wx.navigateTo({
							url: '../../management/uploadWorkListByJudge/uploadWorkListByJudge',
							success(){
								wx.hideLoading()
							}
						})
					}else{
						wx.navigateTo({
							url: '../../management/uploadWorkList/uploadWorkList',
							success(){
								wx.hideLoading()
							}
						})
					}
        }
      }
    })
	},
	toScoreSort(){
		wx.navigateTo({
			url: `../../management/scoreSort/scoreSort`,
		})
	},
})