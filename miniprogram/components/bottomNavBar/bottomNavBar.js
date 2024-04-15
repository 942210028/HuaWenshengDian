import tabbarList from "../../utils/tabBar.js"
const app = getApp()
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    activeIdx: {
      type: Number,
      value: 0
    },
    auth: {
      type: Number,
      value: 0,
      observer: 'onAuthChanged'
    },
  },
  data: {
    tabbarList: app.globalData.userType==4||app.globalData.userType==5?tabbarList.admin:tabbarList.user,
    userType: app.globalData.userType==4||app.globalData.userType==5?'admin':'user',
    _auth: 0,
    unreadnews: 0,
  },
  methods: {
    handleItemTap(e) {
      const {
        idx,
        path
      } = e.currentTarget.dataset
      console.log(e.currentTarget.dataset)
      if (idx === this.data.activeIdx) {
        this.trigger('refresh')
        return
      }
      wx.switchTab({
        url: `/${path}`,
      })
    },
    onAuthChanged(newVal) {
      wx.setStorageSync('__com-tabbar-auth', newVal)
      this.setData({
        _auth: newVal
      })
    },
    trigger(eventName, value = {}, info) {
      if (!eventName) {
        throw new TypeError('没有自定义事件名')
      }
      this.triggerEvent(eventName, value)
      console.log(`发送 ${eventName} 事件,携带的值为 ${typeof value === 'object' ? JSON.stringify(value) : value} ${info ? '   ---   ' + info : ''}`)
    }
  },
  /** 权限显示 */
  pageLifetimes: {
    show: function () {
      var that = this
      that.setData({
        _auth: wx.getStorageSync('__com-tabbar-auth')
      })
      if(app.globalData.userType){
        that.setData({
          tabbarList: app.globalData.userType==4||app.globalData.userType==5?tabbarList.admin:tabbarList.user,
          userType: app.globalData.userType==4||app.globalData.userType==5?'admin':'user',
        })
      }else{
        app.userInfoReadyCallbackAgain=res=>{
          that.setData({
            tabbarList: res==4||res==5?tabbarList.admin:tabbarList.user,
            userType: res==4||res==5?'admin':'user',
          })
        }
      }
    }
  }
})