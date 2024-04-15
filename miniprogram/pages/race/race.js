const app = getApp()
let that = null
Page({
	data: {
    navbarData: {
      showCapsule: 1,
      title: "活动专区",
			titleColor: "white",
			bg_color: "#b81d1d",
			backIcon: "white"
    },
		height: app.globalData.height,
	},
	onLoad(options) {
    that = this
	},
	// 赛事介绍
	toRaceDetail(){
		wx.navigateTo({
			url: '../raceDetail/raceDetail',
		})
	},
})