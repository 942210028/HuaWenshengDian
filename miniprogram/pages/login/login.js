const app = getApp()
let that = null
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
    agreement: false, //同意用户协议
    noAgreement: false, //不同意用户协议
		userType: null,
  },
	onLoad(options) {
    console.log(options)
    that = this
    that.setData({
      userType: options.type
    })
	},
  agreement(e) {
    this.setData({
      agreement: e.detail,
    });
  },
  getUserInfo(e){
    if (!that.data.agreement) {
      that.setData({
        noAgreement: true
      })
      setTimeout(function () {
        that.setData({
          noAgreement: false
        })
      }, 500)
      return
    }else{
      console.log(e.detail)
      wx.showLoading({title: '加载中'})
      wx.cloud.callFunction({
        name: 'login',
        data: {
          userData: wx.cloud.CloudID(e.detail.cloudID) 
        },
        success: res => {
          console.log(res)
          app.globalData.user_id = res.result
          wx.setStorage({
            key: 'loginInfo',
            data: e.detail,
          })
					wx.hideLoading()
					if(that.data.userType){
						wx.redirectTo({
							url: `../register/register?type=${that.data.userType}`,
						})
					}else{
						wx.navigateBack()
					}
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败：', err)
        }
      })
    }
	},
	// 隐私协议
	privacyPolicy(){
		wx.navigateTo({
      url: '../licence/licence',
    })
	},
})