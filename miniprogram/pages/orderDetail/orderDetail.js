const app = getApp()
let that = null
Page({
	data: {
    navbarData: {
      showCapsule: 1,
      title: "",
			bg_color: "transparent",
    },
    height: app.globalData.height,
		checked: false,
		goodsNum: 4,
    magazineType: null, //杂志类型
    is_yangzhou: false, // 所在地区是否为扬州
    register: false, //是否从注册页跳转
  },
	onPageScroll(e){
		if(e.scrollTop>=200){
			that.setData({
				["navbarData.bg_color"]: "#E2EEFA"
			})
		}
		if(e.scrollTop<200){
			that.setData({
				["navbarData.bg_color"]: "transparent"
			})
		}
	},
	onLoad(options) {
    that = this
    console.log(options)
    that.setData({
      magazineType: options.group=="初中"?"blue":(options.group=="小高"?"green":"red"),
      is_yangzhou: options.city?options.city.indexOf("扬州")>-1 || options.city.indexOf("南京")>-1?true:false:false,
      register: options.register?options.register:false
    })
	},
  selectNumber(e) {
    this.setData({
      goodsNum: e.currentTarget.dataset.value
    });
  },
  onChange(e){
    that.setData({
      checked: e.detail
    })
  },
	toBuy(){
		wx.navigateTo({
			url: `../confirmOrder/confirmOrder?magazineType=${that.data.magazineType}&goodsNum=${that.data.goodsNum}&register=${that.data.register}`,
		})
  },
  backToIndex(){
    app.globalData.is_buyMagazine = true
    wx.cloud.callFunction({
      name: "UpdateUserInfo",
      data: {
        is_buyMagazine: true
      }
    })
    wx.switchTab({
      url: '../index/index',
    })
  },
})