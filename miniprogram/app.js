App({
  onShow() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      console.log("检查更新",res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，请重启应用",
        showCancel: false,
        complete: res => {
          updateManager.applyUpdate()
        }
      })
    })
  },
	flag: false,
	async onLaunch(e) {
		var that = this
		wx.cloud.init()
		let {
			top,
			left,
			right,
			width,
			height,
			bottom
		} = wx.getMenuButtonBoundingClientRect()
		that.globalData = {
			height: bottom + 4,
			menuButtonTop: top,
			menuButtonHeight: height,
			menuButtonLeft: left,
			menuButtonWidth: width + 10,
			titleheight: bottom + top,
			imageheight: bottom / 2 + top / 2 - 8,
			userType: null,
			user_id: null,
			is_buyMagazine: false,
		}
		wx.cloud.callFunction({
			name: "getUserInfo",
			success: res => {
				if (res.result&&res.result.data) {
					console.log("已注册")
          that.globalData.userType = res.result.data.type
          that.globalData.is_buyMagazine = res.result.data.is_buyMagazine
          that.globalData.user_id = res.result.data._id
          that.globalData.userInfo = res.result.data
					if (that.userInfoReadyCallback) {
						that.userInfoReadyCallback(res.result.data.type)
					}
					if (that.userInfoReadyCallbackAgain) {
						that.userInfoReadyCallbackAgain(res.result.data.type)
					}
				} else {
					console.log("未注册")
				}
			}
		})
	},
})