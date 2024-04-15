const app = getApp()
const XLSX = require('../../utils/xlsx.mini.min.js')
let that = null
Page({
  data: {
    navbarData: {
      showCapsule: 0,
      title: "我的",
      bg_color: "url(https://636c-cloud1-4gojwhjp38f8a41c-1315829236.tcb.qcloud.la/icon/pageBg.png) no-repeat, #F5EFFF no-repeat",
      bottomLine_color: "#DFDDE5"
    },
    navbarData_user: {
      showCapsule: 0,
      title: "我的",
      titleColor: "white",
      bg_color: "#b81d1d",
    },
    height: app.globalData.height,
    login: false,
    userInfo: {},
    userType: app.globalData.userType,
    orderList: [],
    contactPop: false,
    downLoading: false, //管理端下载视频等待
    downLoading2: false, //管理端下载视频等待
  },
  // 删除信息
  deleteUser() {
    wx.showModal({
      title: '确认删除',
      success: res => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在删除',
          })
          wx.cloud.callFunction({
            name: "remove",
            success: res => {
              wx.hideLoading()
              wx.showToast({
                title: '删除成功',
              })
            }
          })
        }
      }
    })
  },
  // 切换身份
  changeStatus() {
    wx.showModal({
      title: '切换管理员',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: "UpdateUserInfo",
            data: {
              type: 5
            },
          })
        }
      }
    })
  },
  onLoad(options) {
    that = this
    if (app.globalData.user_id) {
      that.setData({
        login: true
      })
    }
    if (app.globalData.userType) {
      if (app.globalData.userType > 3) {
        that.getOrderList()
      }
      that.setData({
        userType: app.globalData.userType,
      })
      if (app.globalData.userType > 3) {
        that.getOrderList()
      }
    } else {
      console.log(app.globalData.userType)
      app.userInfoReadyCallback = res => {
        that.setData({
          userType: res
        })
        if (res > 3) {
          that.getOrderList()
        }
      }
    }
  },
  onShow() {
    wx.cloud.callFunction({
      name: "getUserInfo",
      success: res => {
        console.log(res)
        if (res.result && res.result.data) {
          console.log(res.result.data)
          that.setData({
            userInfo: res.result.data,
            userType: app.globalData.userType,
            login: true
          })
        }
      }
    })
  },
  // 管理端修改用户信息
  toEditUserInfo() {
    wx.navigateTo({
      url: `../../management/editUserInfo/editUserInfo?id=${that.data.userInfo._id}`,
    })
  },
  // 跳转订单列表页面
  toOrderList() {
    wx.navigateTo({
      url: '../../management/orderList/orderList',
    })
  },
  // 获取订单列表
  getOrderList() {
    wx.cloud.callFunction({
      name: 'Order',
      data: {
        type: 'getall',
        pageSize: 20,
        currentPage: 1
      },
      success: res => {
        console.log(res)
        that.setData({
          orderList: res.result.list
        })
        wx.hideLoading()
      }
    })
  },
  // 跳转参赛记录
  toRaceRecord() {
    wx.navigateTo({
      url: '../raceRecord/raceRecord',
    })
  },
  // 跳转在线领奖
  toGetPrize() {
    // wx.showToast({
    // 	title: '获奖名单尚未公示',
    // 	icon: "none",
    // 	duration: 1500,
    // 	mask: true
    // })
    wx.navigateTo({
      url: '../getPrize/getPrize',
    })
  },
  // 跳转问题反馈
  toWxPublic() {
    // that.setData({
    // 	contactPop: true
    // })
    wx.showModal({
      content: '活动相关问题请咨询项目老师',
      showCancel: false,
    })

    // if(["oatQ75W92ecYxbYGey7XqzTf20G4","oatQ75Z1_nz6W0XML1OAO2wXeUmg","oatQ75frf_maoU58Ls-GTGUKU9hU"].indexOf(app.globalData.user_id)>-1){
    //   wx.navigateTo({
    //     url: '../../management/orderList/orderList',
    //   })
    // }else{
    //   that.setData({
    //     contactPop: true
    //   })
    // }
    //   wx.navigateTo({
    //     url: `/pages/webView/webView`
    //  })
  },
  // 订购杂志
  toMagezineMall() {
    wx.navigateTo({
      url: '../shoppingAddress/shoppingAddress',
    })
  },
  // 登录授权
  toLogin() {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  // 换头像
  onChooseAvatar(e) {
    console.log(e)
    const {
      avatarUrl
    } = e.detail
    this.setData({
      ["userInfo.avatar_url"]: avatarUrl,
    })
    const cloudPath = "userAvatar/" + app.globalData.user_id + "/" + new Date().getTime().toString() + ".png"
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
  contactPopShow() {
    that.setData({
      contactPop: false
    })
  },
  onShareAppMessage(e) {
    return {
      title: "全国青少年英语视频创作大赛",
      path: `/pages/index/index`,
      imageUrl: "cloud://cloud1-4gojwhjp38f8a41c.636c-cloud1-4gojwhjp38f8a41c-1315829236/pageShareImg.png"
    }
  },
  // 查看所有作品1
  tofirstwork() {
    wx.navigateTo({
      url: '../../management/firstWorkList/firstWorkList',
    })
  },
  // 导出学生记录
  createInfo() {
    wx.showLoading({
      title: '正在导出',
    })
    wx.cloud.callFunction({
      name: "getAllUser",
      success: res => {
        console.log(res)
        wx.hideLoading()

        // 数据源
        const data = res.result.data

        // 构建一个表的数据
        let sheet = []
        let title = ['姓名', '学校', '专业', '年级', '手机号', '作品1是否提交', '作品1选题', '作品2是否提交', ]
        sheet.push(title)
        data.forEach(item => {
          let rowcontent = []
          rowcontent.push(item.name)
          rowcontent.push(item.schoolName)
          rowcontent.push(item.speciality)
          rowcontent.push(item.grade)
          rowcontent.push(item.phone_number)
          rowcontent.push(item.firstWork)
          rowcontent.push(item.recitationTitle)
          rowcontent.push(item.secondWork)
          sheet.push(rowcontent)
        })

        // XLSX插件使用
        var ws = XLSX.utils.aoa_to_sheet(sheet);
        ws['!cols'] = [{
            wch: 10
          },
          {
            wch: 20
          },
          {
            wch: 20
          },
          {
            wch: 10
          },
          {
            wch: 15
          },
          {
            wch: 10
          },
          {
            wch: 40
          },
          {
            wch: 10
          }
        ]
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "学生信息表");
        var fileData = XLSX.write(wb, {
          bookType: "xlsx",
          type: 'base64'
        });

        let filePath = `${wx.env.USER_DATA_PATH}/学生信息表.xlsx`

        // 写文件
        const fs = wx.getFileSystemManager()
        fs.writeFile({
          filePath: filePath,
          data: fileData,
          encoding: 'base64',
          bookSST: true,
          success(res) {
            console.log(res)
            const sysInfo = wx.getSystemInfoSync()
            // 导出
            if (sysInfo.platform.toLowerCase().indexOf('windows') >= 0) {
              // 电脑PC端导出
              wx.saveFileToDisk({
                filePath: filePath,
                success(res) {
                  console.log(res)
                },
                fail(res) {
                  console.error(res)
                  util.tips("导出失败")
                }
              })
            } else {
              // 手机端导出
              // 打开文档
              wx.openDocument({
                filePath: filePath,
                showMenu: true,
                success: function (res) {
                  console.log('打开文档成功')
                },
                fail: console.error
              })
            }

          },
          fail(res) {
            console.error(res)
            if (res.errMsg.indexOf('locked')) {
              wx.showModal({
                title: '提示',
                content: '文档已打开，请先关闭',
              })
            }

          }
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  // 下载所有视频1
  downLoadWork1() {
    that.setData({
      downLoading: true
    })
    try {
      const fs = wx.getFileSystemManager()
      fs.accessSync(`${
        wx.env.USER_DATA_PATH}/video1`)
    } catch (err) {
      console.error('判断目录是否存在', err)
    }
    // 如果不存在则创建目录
    try {
      const fs = wx.getFileSystemManager();
      fs.mkdirSync(`${
       wx.env.USER_DATA_PATH}/video1`, false)
    } catch (e) {
      console.error('创建目录失败原因', e)
    }
    wx.cloud.callFunction({
      name: "getAllWorkVideo",
      success: res => {
        console.log(res)
        let taskList = []
        var index = 0
        // for (let i in res.result.data) {
        for (let i=470;i<475;i++) {
          taskList.push(
            new Promise((resolve, reject) => {
              wx.cloud.downloadFile({
                fileID: res.result.data[i].video_url2,
                success: ress => {
                  index++
                  resolve(ress)
                  console.log("下载成功",res.result.data[i]._id,res.result.data[i].name,res.result.data[i].schoolName,res.result.data[i].phone_number)
                  wx.hideLoading()
                  wx.showToast({
                    title: `${res.result.data[i].name} 剩${res.result.data.length-index}`,
                  })
                  wx.getFileSystemManager().saveFile({
                    tempFilePath: ress.tempFilePath,
                    filePath: wx.env.USER_DATA_PATH + "/video1/" + res.result.data[i].name + " " + res.result.data[i].schoolName + " " + res.result.data[i].phone_number + '.mp4', 
                    success(tres) {
                      console.log('保存成功', tres)
                    },
                    fail(tres) {
                      console.log('保存失败', ress.tempFilePath)
                      wx.saveVideoToPhotosAlbum({
                        filePath: ress.tempFilePath,
                        success (res) {
                          console.log(res.errMsg)
                        },
                        fail(tres) {
                          console.log('保存失败', tres)
                        }
                      })
                    }
                  })
                },
                fail: err => {
                  resolve()
                  console.log("下载失败",res.result.data[i].name,err)
                  wx.showToast({
                    title: `${res.result.data[i].name} 失败`,
                    icon: 'error'
                  })
                }
              })
            })
          )
        }
        Promise.all(taskList).then(res => {
          console.log(res)
          that.setData({
            downLoading: false
          })
        })
      }
    })
  },
  // 下载所有视频2
  downLoadWork2() {
		wx.cloud.callFunction({
			name: 'FirstWorks',
			data: {
				type: 'getById',
				_id: "e67013a46607d4600063885b1d0253b0"
			},
			success: res => {
				console.log(res)
        wx.cloud.downloadFile({
          fileID: res.result.list[0].video_url2,
          success: ress => {
            console.log("下载成功")
            wx.saveVideoToPhotosAlbum({
              filePath: ress.tempFilePath,
              success (res) {
                console.log(res.errMsg)
              },
              fail(tres) {
                console.log('保存失败', tres)
              }
            })
          },
          fail: err => {
            resolve()
            console.log("下载失败",res.result.data[i].name,err)
          }
        })
			}
		})
  },

})