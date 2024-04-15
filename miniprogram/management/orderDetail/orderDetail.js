const app = getApp()
Page({
  data: {
    navbarData: {
      showCapsule: 1,
      title: "订单详情",
      bg_color: "url(https://636c-cloud1-4gojwhjp38f8a41c-1315829236.tcb.qcloud.la/icon/pageBg.jpg) no-repeat,#F5EFFF",
      bottomLine_color: "#D9DCE5"
    },
    height: app.globalData.height,
    order_id: "",
    orderDetail: {}
  },
  onLoad(options) {
    var that = this
    console.log(options)
    that.setData({
      order_id: options._id
    })
    wx.cloud.callFunction({
      name: 'Order',
      data: {
        type: 'getbyid',
        id: options._id
      },
      success: res => {
        console.log(res)
        that.setData({
          orderDetail: res.result.list[0]
        })
      }
    })
  },
  upDateShipped() {
    var that = this
    wx.showModal({
      title: "确认发货",
      content: '确认杂志已发货，确认后无法变更订单状态',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showLoading({
            title: '加载中',
          })
          wx.cloud.callFunction({
            name: 'Order',
            data: {
              type: 'update',
              id: that.data.order_id,
              shipped: true,
            },
            success:res=>{
              wx.hideLoading()
              wx.showToast({
                title: '发货成功',
                icon: "success"
              })
              that.setData({
                ['orderDetail.shipped']: true
              })
              app.globalData.orderStatus = true
            }
          })
        }
      }
    })
  },
})