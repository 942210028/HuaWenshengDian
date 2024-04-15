const app = getApp()
const pageSize = 20
Page({
  data: {
    navbarData: {
      showCapsule: 1,
      title: "全部订单",
      bg_color: "url(https://636c-cloud1-4gojwhjp38f8a41c-1315829236.tcb.qcloud.la/icon/pageBg.png) no-repeat, #F5EFFF",
      bottomLine_color: "#D9DCE5"
    },
    height: app.globalData.height,
    currentPage: 1,
    hasMoreData: true,
    isLoadingMoreData: false,
    orderList: [],
    searchText: "",
    searchList: [],
  },
  onLoad(options) {
    var that = this
    wx.cloud.callFunction({
      name: 'Order',
      data: {
        type: 'getall',
        pageSize: pageSize,
        currentPage: 1
      },
      success: res => {
        console.log(res)
        that.setData({
          ['orderList[0]']: res.result.list
        })
        wx.hideLoading()
      }
    })
  },
  onShow(){
    var that = this
    console.log(app.globalData.order_id)
    if(app.globalData.order_id&&app.globalData.orderStatus){
      for(let i in that.data.searchList){
        for(let j in that.data.searchList[i]){
          if(that.data.searchList[i][j]._id==app.globalData.order_id){
            that.data.searchList[i][j].shipped = true
          }
        }
      }
      for(let i in that.data.orderList){
        for(let j in that.data.orderList[i]){
          if(that.data.orderList[i][j]._id==app.globalData.order_id){
            that.data.orderList[i][j].shipped = true
          }
        }
      }
      that.setData({
        orderList: that.data.orderList,
        searchList: that.data.searchList
      })
      app.globalData.order_id=null
      app.globalData.orderStatus=false
    }
  },
  toOrderDetail(e){
    app.globalData.order_id = e.currentTarget.dataset.detail._id
    wx.navigateTo({
      url: `../orderDetail/orderDetail?_id=${e.currentTarget.dataset.detail._id}`,
    })
  },
  inputValue(e){
    this.setData({
      searchText: e.detail.value
    })
  },
  searchOrder() {
    var that = this
    if(that.data.searchText){
      wx.cloud.callFunction({
        name: 'Order',
        data: {
          type: 'search',
          text: that.data.searchText
        },
        success: res=>{
          console.log(res)
          that.setData({
            ['searchList[0]']: res.result.list
          })
        }
      })
    }else{
      that.setData({
        searchList: []
      })
    }
  },
  onReachBottom: function () {
    var that = this
    console.log("onReachBottom")
    if (that.data.isLoadingMoreData || !that.data.hasMoreData) {
      console.log("return")
      return
    }
    that.setData({
      isLoadingMoreData: true,
      currentPage: that.data.currentPage + 1
    })
    that.dataRefurbish()
  },
  dataRefurbish() {
    var that = this
    wx.cloud.callFunction({
      name: 'Order',
      data: {
        type: 'getall',
        pageSize: pageSize,
        currentPage: that.data.currentPage
      },
      success: res => {
        console.log(res)
        if (res.result.list.length >= 0) {
          if (res.result.list.length < pageSize) {
            that.setData({
              hasMoreData: false
            })
          }
          that.setData({
            ['orderList[' + (that.data.currentPage - 1) + ']']: res.result.list,
            isLoadingMoreData: false
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  imageError(e){
    console.log(e)
    var that = this
    if(that.data.searchList.length>0){
      that.data.searchList[e.currentTarget.dataset.index][e.currentTarget.dataset.indexx].avatar_url = "cloud://cloud1-4gojwhjp38f8a41c.636c-cloud1-4gojwhjp38f8a41c-1315829236/noLoginAvatar.png"
    }else{
      that.data.orderList[e.currentTarget.dataset.index][e.currentTarget.dataset.indexx].avatar_url = "cloud://cloud1-4gojwhjp38f8a41c.636c-cloud1-4gojwhjp38f8a41c-1315829236/noLoginAvatar.png"
    }
    this.setData({
      searchList: that.data.searchList,
      orderList: that.data.orderList
    })
  },
})