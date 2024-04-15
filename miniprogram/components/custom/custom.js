const app = getApp()
Component({
  properties: {
    navbarData: {
      type: Object,
      value: {
        "bg_color": "white",
        "titleColor": "#000",
        "flag": 1,
        "name": "我是标题",
        "backIcon": "black",
        "bottomLine_color": "transparent"
      },
      observer: function (newVal, oldVal) {}
    },
    route: {
      type: Boolean
    }
  },
  data: {
    height: '',
    titleheight: '',
    imageheight: '',
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 1
    },
    route: false
  },
  attached: function () {
    // 获取是否是通过分享进入的小程序
    // this.setData({
    //   share: app.globalData.share
    // })
    // 定义导航栏的高度   方便对齐
    this.setData({
      height: app.globalData.height,
      titleheight: app.globalData.titleheight,
      imageheight: app.globalData.imageheight
    })
  },
  methods: {
  // 返回上一页面
    _navback() {
      console.log(this.data.route)
      if(this.data.route){
        console.log("自定义")
        this.triggerEvent('custom_navback')
      }else{
        if(getCurrentPages()[1]){
          console.log("上一页")
          wx.navigateBack()
        }else{
          console.log("回主页")
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
      }
    },
  //返回到首页
    // _backhome() {
    //   wx.switchTab({
    //     url: '/pages/index/index',
    //   })
    // }
  }

}) 