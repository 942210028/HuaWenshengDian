const app = getApp()
let that = null
import {
  areaList
} from "../../miniprogram_npm/@vant/area-date"
Page({
  data: {
    navbarData: {
      showCapsule: 1,
      title: "修改地址",
      bg_color: "#FFFFFF",
    },
    height: app.globalData.height,
    areaList,
    modifyCityShow: false,
    name: "",
    phone: "",
    city: "",
    address: "",
  },
  onLoad(options) {
    that = this
    wx.cloud.callFunction({
      name: "getUserInfo",
      success:res=>{
				console.log(res)
        if(res.result&&res.result.data){
          console.log(res.result.data)
          that.setData({
            name: res.result.data.addressName?res.result.data.addressName:res.result.data.name,
            phone: res.result.data.addressPhone?res.result.data.addressPhone:res.result.data.phone_number,
            city: res.result.data.city,
            address: res.result.data.address,
          })
        }
      }
    })
  },
  // 输入姓名
  nameInput(e){
    this.setData({
      name: e.detail.value
    })
  },
  // 输入手机号
  phoneInput(e){
    this.setData({
      phone: e.detail.value
    })
  },
  // 输入详细地址
  addressInput(e){
    this.setData({
      address: e.detail.value
    })
  },
  // 改城市列表显示
  modifyCityShow() {
    this.setData({
      modifyCityShow: !this.data.modifyCityShow
    })
  },
  // 保存地址
  save(){
    if(!that.data.name||!that.data.phone||!that.data.city||!that.data.address){
      wx.showToast({
        title: '请填写完整哦～',
        icon: "none",
        mask: true
      })
    }else{
      wx.showLoading()
			console.log(that.data.name,that.data.phone,that.data.city,that.data.address)
      wx.cloud.callFunction({
        name: "UpdateUserInfo",
				data: {
				  addressName: that.data.name,
					addressPhone: that.data.phone,
					city: that.data.city,
					address: that.data.address
        },
        success: res=>{
          wx.hideLoading()
        }
      })
    }
  },
  // 选择城市
  modifyCity(e) {
    console.log(e)
    var that = this
    that.setData({
      city: e.detail.values[0].name + "," + e.detail.values[1].name + "," + e.detail.values[2].name,
      modifyCityShow: false
    })
  },
})