const app = getApp()
let that = null
const pageSize = 10
Page({
	data: {
		navbarData: {
			showCapsule: 1,
			title: "全部排名",
			bg_color: "url(https://636c-cloud1-4gojwhjp38f8a41c-1315829236.tcb.qcloud.la/icon/pageBg.jpg) no-repeat,#F5EFFF",
			bottomLine_color: "#D9DCE5"
		},
		height: app.globalData.height,
		currentPage: 1,
		workList: [], 
    hasMoreData: true,
    isLoadingMoreData: false,
		showAction: false, //文件下载遮罩
	},
	onLoad(options) {
		that = this
		var data = {
			type: 'getall',
			pageSize: pageSize,
			currentPage: that.data.currentPage,
			scoreTotal: -1,
			groupSort: 1
		}
		that.getWorksList(data)
	},
	getWorksList(data) {
		wx.showLoading({
			title: '加载中',
		})
		wx.cloud.callFunction({
			name: 'FirstWorks',
			data: data,
			success: res => {
				wx.hideLoading()
				console.log(res.result.list)
				that.setData({
					workList: res.result.list
				})
			},
			fail: err => {
				console.log(err)
			}
		})
  },
  // 跳转作品详情
  toUploadWorkDetail(e){
    wx.navigateTo({
      url: `../uploadWorkDetail/uploadWorkDetail?id=${e.currentTarget.dataset.id}`,
    })
  },
	//点击下载按钮
	onDownloadClick(e) {
		if(that.data.showAction){
			wx.showToast({
				title: '下载任务正在执行...',
				icon: "none"
			})
			return
		}
		var url = e.currentTarget.dataset.url
		var index = e.currentTarget.dataset.index
		wx.getSetting({
			success(res) {
				if (!res.authSetting['scope.writePhotosAlbum']) {
					wx.authorize({
						scope: 'scope.writePhotosAlbum',
						success: () => {
							that.handleDownload(url,index);
						},
						fail: () => {
							that.rejectSetting()
						}
					})
				} else {
					that.handleDownload(url,index);
				}
			}
		})
	},
	//用户拒绝授权后的回调
	rejectSetting() {
		wx.showModal({
			title: '警告',
			content: '授权失败，请打开相册的授权',
			success: (res) => {
				if (res.confirm) {
					wx.openSetting({
						success: (e) => {
							console.log(e);
						}
					})
				} else if (res.cancel) {
					console.log(res);
					wx.showModal({
						title: '提示',
						content: '获取权限失败，将无法保存到相册哦~',
						showCancel: false,
						success: (res) => {
							wx.openSetting({
								success: (e) => {
									console.log(e);
								}
							})
						}
					})
				}
			}
		})
	},
	//下载
	handleDownload(url,index) {
		that.setData({
			showAction:true
		})
		wx.showToast({
			title: '开始下载',
			icon: "none"
		})
		console.log(url)
		const downloadTask = wx.cloud.downloadFile({
			fileID: url,
			success: res => {
				console.log(res)
				wx.saveVideoToPhotosAlbum({
					filePath: res.tempFilePath
				})
			},
			fail: err => {
				console.log(err)
			}
		})
		downloadTask.onProgressUpdate(res => {
			console.log(res)
			console.log(that.data.workList[index])
			that.data.workList[index].progress=res.progress
			that.setData({
				workList:that.data.workList
			})
			if(res.progress==100){
				that.setData({
					showAction: false
				})
			}
	})
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
		var data = {
			type: 'getall',
			pageSize: pageSize,
			currentPage: that.data.currentPage
		}
    console.log(data)
		wx.cloud.callFunction({
			name: 'FirstWorks',
			data: data,
      success: res => {
        console.log(res)
        if (res.result.list.length >= 0) {
          if (res.result.list.length < pageSize) {
            that.setData({
              hasMoreData: false
            })
          }
          that.setData({
            workList: that.data.workList.concat(res.result.list),
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