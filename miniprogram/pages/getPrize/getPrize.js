const app = getApp()
let that = null
Page({
	data: {
		navbarData: {
			showCapsule: 1,
			title: "在线领奖",
			bg_color: "#E2EEFA",
		},
		height: app.globalData.height,
		prizeList: []
	},
	onLoad(options) {
		that = this
		wx.cloud.callFunction({
			name: "getUserInfo",
			// data:{user_id:"oatQ75XKcATu3FIEmYPoiRS4wJ2E"},
			success: res => {
				console.log(res)
				that.setData({
					prizeList: res.result.data.getPrize
				})
			}
		})
	},
	toGetPrize(e) {
		console.log(e.currentTarget.dataset.detail)
		wx.navigateTo({
			url: `./prizeDetail?detail=${JSON.stringify(e.currentTarget.dataset.detail)}`,
		})
	}
})