const app = getApp()
let that = null
Page({
  data: {
    navbarData: {
      showCapsule: 1,
      title: "",
      bg_color: "white",
    },
    height: app.globalData.height,
    video: null
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
    this.setData({
      video: options.video
    })
	},
})