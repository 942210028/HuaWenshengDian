const app = getApp()
let that = null
const pageSize = 10
Page({
	data: {
		navbarData: {
			showCapsule: 1,
			title: "参赛作品",
			bg_color: "url(https://636c-cloud1-4gojwhjp38f8a41c-1315829236.tcb.qcloud.la/icon/pageBg.jpg) no-repeat,#F5EFFF",
			bottomLine_color: "#D9DCE5"
		},
		height: app.globalData.height,
		typeMenuSelect: "全部", //标签
		screenSelect: -1, //筛选
		currentPage: 1,
		workList: [], 
    hasMoreData: true,
    isLoadingMoreData: false,
		showAction: false, //文件下载遮罩
		searchInput: "", //搜索框值
		searchList: [],
		sieveShow: false, //筛选菜单
		judgeList: [], //评委列表
    selectJudge: "全部", //选择评委
    selectJudge_id: "", //评委id
	},
	onLoad(options) {
		that = this
		var data = {
			type: 'getall',
			pageSize: pageSize,
			currentPage: that.data.currentPage
		}
		that.getWorksList(data)
		// 获取评委列表
		wx.cloud.callFunction({
			name: "getUserList",
			data: {
				type: "getJudge"
			},
			success: res=>{
				console.log(res)
				that.setData({
					judgeList: res.result.list
				})
			}
		})
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
      url: `../examineDetail/examineDetail?id=${e.currentTarget.dataset.id}`,
    })
  },
	// 标签页选择
	typeMenuSelect(e) {
		that.setData({
      typeMenuSelect: e.currentTarget.dataset.index,
      screenSelect: -1,
			isLoadingMoreData: false,
			hasMoreData: true,
      currentPage: 1
		})
		var data = {
			type: 'getall',
			pageSize: pageSize,
			currentPage: that.data.currentPage,
			group: that.data.typeMenuSelect
		}
		if(that.data.typeMenuSelect=="全部"){
			delete data.group
    }
    if(that.data.selectJudge&&that.data.selectJudge!="全部"){
      data.judge = that.data.selectJudge_id
    }
		that.getWorksList(data)
	},
	// 筛选条件选择
	screenSelect(e) {
    var index = e.currentTarget.dataset.index
    that.setData({
			isLoadingMoreData: false,
			hasMoreData: true,
      currentPage: 1
    })
		var data = {
			type: 'getall',
			pageSize: pageSize,
			currentPage: that.data.currentPage,
			group: that.data.typeMenuSelect
		}
		if(that.data.typeMenuSelect=="全部"){
			delete data.group
    }
    if(that.data.selectJudge&&that.data.selectJudge!="全部"){
      data.judge = that.data.selectJudge_id
    }
		if (that.data.screenSelect != index) {
			that.setData({
				screenSelect: index
			})
			if (index == 0) {
				data.scoreTotal = 1
			} else {
				data.scoreTotal = -1
			}
		} else {
			that.setData({
				screenSelect: -1
			})
			delete data.scoreTotal
		}
		console.log(data)
		that.getWorksList(data)
	},
	// 刷新
	refresh() {
		that.setData({
			isLoadingMoreData: false,
			hasMoreData: true,
      currentPage: 1
		})
		var data = {
			type: 'getall',
			pageSize: pageSize,
			currentPage: that.data.currentPage,
			group: that.data.typeMenuSelect
    }
    if(that.data.screenSelect!=-1){
      if (that.data.screenSelect == 0) {
        data.scoreTotal = 1
      } else {
        data.scoreTotal = -1
      }
    }
    if(that.data.selectJudge&&that.data.selectJudge!="全部"){
      data.judge = that.data.selectJudge_id
    }
		if(that.data.typeMenuSelect=="全部"){
			delete data.group
		}
		that.getWorksList(data)
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
		wx.showToast({
			title: '开始下载',
			icon: "none"
		})
		that.setData({
			showAction:true
		})
		console.log(url)
		const downloadTask = wx.cloud.downloadFile({
			fileID: url,
			success: res => {
				wx.saveVideoToPhotosAlbum({
					filePath: res.tempFilePath,
					success: res=>{
						console.log(res)
					},
					fail: err=>{
						console.log(err)
					}
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
			currentPage: that.data.currentPage,
			group: that.data.typeMenuSelect
		}
    if(that.data.screenSelect!=-1){
      if (that.data.screenSelect == 0) {
        data.scoreTotal = 1
      } else {
        data.scoreTotal = -1
      }
    }
		if(that.data.typeMenuSelect=="全部"){
			delete data.group
    }
    if(that.data.selectJudge&&that.data.selectJudge!="全部"){
      data.judge = that.data.selectJudge_id
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
					that.data.workList = that.data.workList.concat(res.result.list)
          that.setData({
            workList: that.data.workList,
            isLoadingMoreData: false
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
	},
	searchInput(e){
		if(!e.detail.value){
			that.setData({
				searchList: [],
				hasMoreData: true
			})
		}
	},
	searchValue(e){
    var value = e.detail.value
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
							searchList: res.result.list,
							hasMoreData: false
						})
					}
				}
			})
    }
	},
	sieveShow(){
		that.setData({
			sieveShow: !that.data.sieveShow
		})
	},
	selectJudge(e){
    var value = e.currentTarget.dataset.value
    console.log(value)
		that.setData({
			selectJudge: value=="全部"?"全部":value.name,
			selectJudge_id: value._id
    })
	},
	confirmJudge(){
		that.setData({
			sieveShow: false,
			isLoadingMoreData: false,
			hasMoreData: true,
      currentPage: 1
		})
		var data = {
			type: 'getall',
			pageSize: pageSize,
			currentPage: that.data.currentPage,
      group: that.data.typeMenuSelect,
      judge: that.data.selectJudge_id
		}
    if(that.data.screenSelect!=-1){
      if (that.data.screenSelect == 0) {
        data.scoreTotal = 1
      } else {
        data.scoreTotal = -1
      }
    }
		if(that.data.typeMenuSelect=="全部"){
			delete data.group
    }
    console.log(data)
		that.getWorksList(data)
	},
})