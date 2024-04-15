const app = getApp()
let that = null
Page({
  data: {
    navbarData: {
      showCapsule: 1,
      title: "参赛记录",
			titleColor: "white",
			bg_color: "#b81d1d",
			backIcon: "white"
    },
    height: app.globalData.height,
    raceRecord: []
  },
  onLoad(options) {
    that = this
    console.log(app.globalData)
    if(app.globalData.userType==2||app.globalData.userType==3){
      that.setData({
        ["navbarData.title"]: "上传记录"
      })
    }
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
  toUploadWorkEdit(e){
    wx.navigateTo({
      url: `../uploadWorksEdit/uploadWorksEdit?_id=${e.currentTarget.dataset.detail}`,
    })
  },
})