const app = getApp()
let that = null
Page({
  data: {
    navbarData: {
      showCapsule: 1,
      title: "上传作品",
      bg_color: "#E2EEFA",
    },
    userType: 1,
    height: app.globalData.height,
    raceRecord: []
  },
  onShow(){
    wx.cloud.callFunction({
      name: 'FirstWorks',
      data: {
        type: 'get',
      },
      success:res=>{
        console.log(res)
        that.setData({
          raceRecord: res.result.list
        })
      }
    })
  },
  onLoad(options) {
    that = this
    console.log(app.globalData)
    wx.cloud.callFunction({
      name: "getUserInfo",
      success:res=>{
        if(res.result.data){
          console.log(res.result.data)
          that.setData({
            userType: res.result.data.type
          })
        }
      }
    })
  },
  toUploadWork(){
    wx.navigateTo({
      url: '../uploadWorks/uploadWorks',
    })
  },
})