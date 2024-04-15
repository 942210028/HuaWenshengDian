const app = getApp()
let that = null
Page({
	data: {
		navbarData: {
			showCapsule: 1,
			title: "用户详情",
			bg_color: "url(https://636c-cloud1-4gojwhjp38f8a41c-1315829236.tcb.qcloud.la/icon/pageBg.jpg) no-repeat,#F5EFFF",
			bottomLine_color: "#D9DCE5"
		},
		height: app.globalData.height,
		userDetail: {},
	},
	onLoad(options){
		that = this
		console.log(options)
		wx.cloud.callFunction({
			name: "User",
			data: {
				user_id: options.user_id
			},
			success: res => {
				console.log(res)
				that.setData({
					userDetail: res.result.list[0]
				})
				for(var i in res.result.list[0].firstWorks){
					if(res.result.list[0].firstWorks[i].judges_id){
						wx.cloud.callFunction({
							name: "getUserInfo",
							data: {
								user_id: res.result.list[0].firstWorks[i].judges_id
							},
							success: ress => {
								console.log(ress)
								res.result.list[0].firstWorks[i].judges_name = ress.result.data.name
								that.setData({
									['userDetail.firstWorks']:res.result.list[0].firstWorks
								})
							}
						})
					}
				}
			}
		})
  },
  toEditUserInfo(){
    wx.navigateTo({
      url: `../../management/editUserInfo/editUserInfo?id=${that.data.userDetail._id}`,
    })
  },
})