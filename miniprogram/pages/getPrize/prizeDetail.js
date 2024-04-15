const app = getApp()
let that = null
Page({
    data: {
        navbarData: {
            showCapsule: 1,
            title: "在线领奖",
            bg_color: "#E2EEFA",
        },
        height: app.globalData.height,
        prizeDetail: {},
        windowWidth: 0,
        windowHeight: 0,
        canvasFilePath: "",
        canvas: "",

    },
    onLoad(options) {
        that = this
        that.setData({
            prizeDetail: JSON.parse(options.detail)
        })
        wx.showLoading({
            title: '加载中',
        })
        wx.getSystemInfo({
            success: function (res) {
                console.log(res)
                that.setData({
                    windowWidth: res.windowWidth,
                    windowHeight: res.windowHeight
                })
                that.canvas()
            }
        })
    },
    saveAward() {
        wx.canvasToTempFilePath({
            canvasId: 'award',
            success: function (res) {
                //保存到相册
                wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res) {
                        wx.showToast({
                            title: '保存图片成功！',
                        })
                    },
                    fail(res) {
                        if (res.errMsg) {
                            wx.showModal({
                                title: '温馨提示',
                                content: '请先获取相册授权',
                                showCancel: false,
                                success(res) {
                                    if (res.confirm) {
                                        wx.openSetting({
                                            success(settingdata) {
                                                if (settingdata.authSetting['scope.writePhotosAlbum']) {} else {
                                                    wx.showModal({
                                                        title: '温馨提示',
                                                        content: '授权失败，请稍后重新获取',
                                                        showCancel: false,
                                                    })
                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
    },

    canvas() {
        let windowWidth = that.data.windowWidth * 0.91
        let windowHeight = that.data.windowWidth * 1.248
        wx.cloud.downloadFile({
            fileID: "cloud://cloud1-4gojwhjp38f8a41c.636c-cloud1-4gojwhjp38f8a41c-1315829236/prizeImg/award.png",
        }).then(res => {
            console.log(res)
            let ctx = wx.createCanvasContext('award')
            ctx.drawImage(res.tempFilePath, 0, 0, windowWidth, windowHeight)
            ctx.save()
            ctx.beginPath()
            ctx.font = 'normal bold 22px sans-serif'
            ctx.setFillStyle('#48351E')
            ctx.setFontSize(22)
            ctx.setTextAlign('center')
            ctx.fillText(that.data.prizeDetail.name, that.data.windowWidth * 0.45, that.data.windowWidth * 0.6)
            ctx.closePath()
            ctx.beginPath()
            ctx.font = 'normal bold 13px sans-serif'
            ctx.setFillStyle('#6f0007')
            ctx.setFontSize(13)
            ctx.setTextAlign('center')
            ctx.fillText(that.data.prizeDetail.awards, that.data.windowWidth * 0.45, that.data.windowWidth * 0.815)
            ctx.closePath()
            ctx.beginPath()
            ctx.font = 'normal bold 5px sans-serif'
            ctx.setFillStyle('#000000')
            ctx.setFontSize(5)
            ctx.setTextAlign('center')
            ctx.fillText(that.data.prizeDetail.subAwards, that.data.windowWidth * 0.45, that.data.windowWidth * 0.842)
            ctx.closePath()
            ctx.draw();
            wx.hideLoading()
        })
    },
})