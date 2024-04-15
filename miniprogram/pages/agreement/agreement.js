const app = getApp()
let that = null
Page({
	data: {
    navbarData: {
      showCapsule: 1,
      title: "活动记录",
			titleColor: "white",
			bg_color: "#b81d1d",
			backIcon: "white"
    },
    height: app.globalData.height,
    checked: false,
  },
	onLoad(options) {
    that = this
	},
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
    app.globalData.agreement = event.detail
  },
  nextStep(){
    if(!that.data.checked){
      wx.showToast({
        title: '请先接受以上协议',
        icon: "none"
      })
    }else{
      wx.navigateBack()
    }
  }
})