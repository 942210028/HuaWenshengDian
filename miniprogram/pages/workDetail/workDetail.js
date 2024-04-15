const app = getApp()
let that = null
Page({
	data: {
		navbarData: {
			showCapsule: 1,
			title: "评分结果",
			bg_color: "url(https://636c-cloud1-4gojwhjp38f8a41c-1315829236.tcb.qcloud.la/icon/pageBg.jpg) no-repeat,#F5EFFF",
			bottomLine_color: "#D9DCE5"
		},
		height: app.globalData.height,
		upLoadWorkDetail: {},
		score: {
			score4: 0,
			score5: 0,
			score6: 0,
		},
		totalScore: 0,
		currentPage: 1,
	},
	onLoad(options) {
		console.log(options)
		that = this
		wx.showLoading({
			title: '加载中',
		})
		wx.cloud.callFunction({
			name: "FirstWorks",
			data: {
				type: "getById",
				_id: options.id
			},
			success: res => {
				console.log(res)
				wx.hideLoading()
				that.setData({
					upLoadWorkDetail: res.result.list[0],
					score: res.result.list[0].score ? res.result.list[0].score : that.data.score,
					totalScore: res.result.list[0].score ? Object.values(res.result.list[0].score).reduce((total, obj) => {
						return Number(obj) + Number(total);
					}) : 0
				})
			}
		})
	}
})