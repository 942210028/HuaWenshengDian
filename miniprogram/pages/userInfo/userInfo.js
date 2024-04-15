const app = getApp()
let that = null
const pageSize = 5000
Page({
	data: {
    navbarData: {
      showCapsule: 0,
      title: "用户信息",
			bg_color: "url(https://636c-cloud1-4gojwhjp38f8a41c-1315829236.tcb.qcloud.la/icon/pageBg.png) no-repeat, #F5EFFF no-repeat",
			bottomLine_color: "#DFDDE5"
		},
		specialityListShow: false,
		height: app.globalData.height,
    searchValue: "", //搜索框值
    searchList: [], //搜索结果
		userList: [],
		userListSort: [],
    currentPage: 1,
    hasMoreData: true,
    isLoadingMoreData: false,
	},
	specialityListShow(e){
		var index = e.currentTarget.dataset.index
		that.data.userListSort[index].showMore = !that.data.userListSort[index].showMore
		that.setData({
			userListSort:that.data.userListSort
		})
	},
  onLoad(options) {
		that = this
		wx.showLoading({
			title: '加载中',
		})
    wx.cloud.callFunction({
      name: 'getUserList',
      data: {
        type: 'getall',
        pageSize: pageSize,
        currentPage: 1
      },
      success: res => {
				console.log(res)
				var obj={},newArr=[];
				res.result.list.forEach(function(item,suffix){
					if(!obj[item.schoolName]){
						var arr=[];
						arr.push(item);
						newArr.push(arr);
						obj[item.schoolName]=item;
					}else{
						newArr.forEach(function(value,index){
							if(value[0].schoolName==item.schoolName){
								value.push(item)
							}
						})
					}
				})
				let list = []
				for(var i=0;i<newArr.length;i++){
					var arr = {
						schoolName : newArr[i][0].schoolName,
						total: newArr[i].length,
						speciality : newArr[i]
					}
					list.push(arr)
					list.sort(function(a,b){
						return b.total-a.total
					})
				}
				list.forEach(function(item){
					var objs={},newArrs=[];
					item.speciality.forEach(function(item,suffix){
						if(!objs[item.speciality]){
							var arr=[];
							arr.push(item);
							newArrs.push(arr);
							objs[item.speciality]=item;
						}else{
							newArrs.forEach(function(value,index){
								if(value[0].speciality==item.speciality){
									value.push(item)
								}
							})
						}
					})
					let lists = []
					for(var i=0;i<newArrs.length;i++){
						var arr = {
							speciality : newArrs[i][0].speciality,
							specialityList : newArrs[i]
						}
						lists.push(arr)
						lists.sort(function(a,b){
							return b.specialityList.length-a.specialityList.length
						})
					}
					item.speciality = lists
				})
				console.log(list)
        that.setData({
					userListSort: list,
          userList: res.result.list
        })
        wx.hideLoading()
			},
			fail:err=>{
				console.log(err)
			}
    })
  },
  // 去修改用户信息
  toEditUserInfo(e){
    wx.navigateTo({
      url: `../../management/editUserInfo/editUserInfo?id=${e.currentTarget.dataset.detail._id}`,
    })
  },
  // 搜索框
  search(e) {
		var value = e.detail.value?e.detail.value:that.data.searchValue
		if(value == "查询"){
			that.setData({
				specialityListShow: true
			})
		}else if(value){
      that.data.searchList = []
      wx.showLoading({
        title: "加载中",
        mask: true
			})
			
			wx.cloud.callFunction({
				name: 'getUserList',
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
  // 输入框绑定值
  inputValue(e){
    that.setData({
      searchValue: e.detail.value
		})
		if(!e.detail.value){
			that.setData({
				searchList: [],
				specialityListShow: false
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
      name: 'getUserList',
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