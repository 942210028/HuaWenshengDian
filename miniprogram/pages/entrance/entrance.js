const app = getApp()
Page({
	data: {
    navbarData: {
      showCapsule: 1,
      title: "",
			bg_color: "transparent",
			bottomLine_color: "#D9DCE5",
			backIcon: "white"
    },
    height: app.globalData.height,
    userList: [
      {
        "user": "小学组",
        "type": 1,
        "icon": "cloud://cloud1-4gojwhjp38f8a41c.636c-cloud1-4gojwhjp38f8a41c-1315829236/icon/user_person.png"
      },
      {
        "user": "初中组",
        "type": 2,
        "icon": "cloud://cloud1-4gojwhjp38f8a41c.636c-cloud1-4gojwhjp38f8a41c-1315829236/icon/user_teacher.png"
      },
      {
        "user": "大学组",
        "type": 3,
        "icon": "cloud://cloud1-4gojwhjp38f8a41c.636c-cloud1-4gojwhjp38f8a41c-1315829236/icon/user_school.png"
      },
		],
		userType: null
	},
	onLoad(){
		var that = this
		wx.showLoading({
			title: '加载中',
			mask: true
		})
		wx.cloud.callFunction({
			name: "getUserInfo",
			success: res => {
				if (res.result&&res.result.data.type) {
					console.log("已注册")
					wx.hideLoading()
					that.setData({
						userType: res.result.data.type
					})
					wx.showModal({
						content: "已注册",
						showCancel: false,
						confirmText: "返回首页",
						complete: (res) => {
							if (res.confirm) {
								wx.reLaunch({
									url: `/pages/index/index`,
									complete: res=>{
										console.log(res)
									}
								})
							}
						}
					})
				} else {
					console.log("未注册")
				}
			},
			complete(){wx.hideLoading()}
		})
	},
	onShow(){
		this.onLoad()
	},
	onHide(){
		wx.switchTab({
			url: '../index/index',
		})
	},
  toLogin(e){
		var that = this
		if(!that.data.userType){
			if(e.currentTarget.dataset.type==3){
				if(app.globalData.user_id){
					wx.redirectTo({
						url: `../register/register?type=${e.currentTarget.dataset.type}`,
					})
				}else{
					wx.redirectTo({
						url: `../login/login?type=${e.currentTarget.dataset.type}`,
					})
				}
			}else{
				wx.showToast({
					title: '已结束',
					icon: "none",
					duration: 1000
				})
			}
		}else{
			wx.showToast({
				icon: "none",
				title: '已注册，请勿重复报名',
				duration: 1500,
				mask: true
			})
			setTimeout(function(){
				wx.reLaunch({
					url: `/pages/index/index`,
					complete: res=>{
						console.log(res)
					}
				})
			},1500)
		}
		app.userInfoReadyCallback=res=>{
			console.log(res)
		}
  },
})