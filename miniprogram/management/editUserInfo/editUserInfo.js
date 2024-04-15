const app = getApp()
Page({
  data: {
    navbarData: {
      showCapsule: 1,
      title: "修改资料",
      bg_color: "url(https://636c-cloud1-4gojwhjp38f8a41c-1315829236.tcb.qcloud.la/icon/pageBg.jpg) no-repeat,#F5EFFF",
      bottomLine_color: "#D9DCE5"
    },
    height: app.globalData.height,
    userInfo: {}, //用户信息
		user_id: "",
		myUser_id: "",
    typeShow: false,
    groupShow: false,
    typeActions: [
      {name: "学生",type: 3},
      {name: "评委",type: 4},
      {name: "管理员",type: 5},
    ],
    groupActions: [
      // {name: "小低"},
      // {name: "小高"},
      {name: "大学"},
    ],
	},
	// 发放奖状
	sendPrize(){
    var that = this
		wx.showModal({
			title: "发放奖状",
			content: that.data.userInfo.name,
			editable: true,
			success: res=>{
				if(res.confirm){
					console.log(res)
					if(!/^([a-zA-Z0-9\u4e00-\u9fa5\·]{1,10})$/.test(res.content)){
						wx.showToast({
              title: '姓名格式错误',
              icon: 'none'
            })
					}else if(!res.content){
            wx.showToast({
              title: '姓名不能为空',
              icon: 'none'
            })
          }else{
            wx.showLoading({
              title: '加载中',
            })
            wx.cloud.callFunction({
              name: "UpdateUserInfo",
              data: {
                getPrize: {name: res.content}
              },
              success:res=>{
                console.log(res)
                wx.hideLoading()
                wx.showToast({
                  title: '发放成功',
                  icon: 'success'
                })
              }
            })
          }
				}
			}
		})
	},
	// 删除用户
	deleteUser(){
		var that = this
		wx.showModal({
			title: '确认删除',
			success: res=>{
				if(res.confirm){
					wx.showLoading({
						title: '正在删除',
					})
					wx.cloud.callFunction({
						name: "remove",
						data:{
							user_id: that.data.userInfo._id
						},
						success:res=>{
							wx.hideLoading()
							wx.showToast({
								title: '删除成功',
								duration: 1500
							})
							setTimeout(function(){
								wx.navigateBack()
							},1500)
						}
					})
				}
			}
		})
	},
  onLoad(options) {
    var that = this
    console.log(options)
    that.setData({
			user_id: options.id,
			myUser_id: app.globalData.user_id
		})
    wx.cloud.callFunction({
      name: 'getUserInfo',
      data: {
        user_id: options.id
      },
      success: res => {
        console.log(res)
        that.setData({
          userInfo: res.result.data
        })
      }
    })
  },
  nameInput(e){
    this.setData({
      ['userInfo.name']: e.detail.value
    })
  },
  phoneNumberInput(e){
    this.setData({
      ['userInfo.phone_number']: e.detail.value
    })
  },
  onClose() {
    this.setData({ typeShow: false,groupShow: false });
  },
  selectType(){
    this.setData({ typeShow: true });
  },
  selectGroup(){
    this.setData({ groupShow: true });
  },
  onSelectType(e) {
    console.log(e.detail);
    this.setData({
      ['userInfo.type']: e.detail.type
    })
  },
  onSelectGroup(e){
    this.setData({
      ['userInfo.group']: e.detail.name
    })
  },
  // 换头像
  onChooseAvatar(e) {
    var that = this
    console.log(e)
    const { avatarUrl } = e.detail 
    that.setData({
      ["userInfo.avatar_url"]: avatarUrl,
    })
    const cloudPath = "userAvatar/" + that.data.user_id + "/" + new Date().getTime().toString() + ".png"
    wx.cloud.uploadFile({
      cloudPath,
      filePath: avatarUrl,
      success: res => {
        console.log("uploadFile", res.fileID)
        wx.cloud.callFunction({
          name: "UpdateUserInfo",
          data: {
            avatar_url: res.fileID
          }
        })
      },
    })
  },
  updateUserInfo(){
    var that = this
    console.log(that.data.userInfo)
    if(!that.data.userInfo.name||!that.data.userInfo.phone_number||!that.data.userInfo.type||!that.data.userInfo.group){
      wx.showToast({
        title: '请完整填写信息',
        icon: "none"
      })
      return
    }else{
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name: "UpdateUserInfo",
        data: {
          user_id: that.data.userInfo._id,
          name: that.data.userInfo.name,
          phone_number: that.data.userInfo.phone_number,
          type: that.data.userInfo.type,
          group: that.data.userInfo.group,
        },
        success: res=>{
          wx.hideLoading()
          wx.showToast({
            title: '修改成功',
            icon: "success"
          })
        }
      })
    }
  },
})