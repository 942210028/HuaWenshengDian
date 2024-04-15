const app = getApp()
let that = null
const pageSize = 20
Page({
	data: {
    navbarData: {
      showCapsule: 1,
      title: "参赛人信息",
			bg_color: "url(https://636c-cloud1-4gojwhjp38f8a41c-1315829236.tcb.qcloud.la/icon/pageBg.png) no-repeat, #F5EFFF no-repeat",
			bottomLine_color: "#DFDDE5"
    },
		height: app.globalData.height,
    searchValue: "", //搜索框值
    searchList: [], //搜索结果
		userList: [],
    currentPage: 1,
    hasMoreData: true,
    isLoadingMoreData: false,
  },
  onLoad(options) {
		that = this
		wx.showLoading({
			title: '加载中',
		})
    wx.cloud.callFunction({
      name: 'FirstWorks',
      data: {
        type: 'getall',
        pageSize: pageSize,
        currentPage: 1
      },
      success: res => {
        console.log(res)
        that.setData({
          userList: res.result.list
        })
        wx.hideLoading()
			},
			fail:err=>{
				console.log(err)
			}
    })
  },
  // 搜索框
  search(e) {
    var value = e.detail.value?e.detail.value:that.data.searchValue
    if(value){
      that.data.searchList = []
      wx.showLoading({
        title: "加载中",
        mask: true
			})
			
			wx.cloud.callFunction({
				name: 'FirstWorks',
				data: {
					type: 'search',
					text: value
				},
				success: res => {
					console.log(res)
					wx.hideLoading()
					if(res.result.list.length==0){
						wx.showToast({
							title: '未搜索到相关用户',
							icon: "none"
						})
					}else{
						that.setData({
							searchList: res.result.list
						})
					}
				}
			})
    }
  },
  // 跳转参赛人员信息详情
  toJoinRaceUserDetail(e){
    wx.navigateTo({
      url: `../joinRaceUserDetail/joinRaceUserDetail?id=${e.currentTarget.dataset.id}`,
    })
  },
  // 输入框绑定值
  inputValue(e){
    that.setData({
      searchValue: e.detail.value
		})
		if(!e.detail.value){
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
      name: 'FirstWorks',
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
            userList: that.data.userList.concat(res.result.list),
            isLoadingMoreData: false
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },
})