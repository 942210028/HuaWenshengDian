const app = getApp()
let that = null
Page({
	data: {
    navbarData: {
      showCapsule: 1,
      title: "",
			bg_color: "#ffffff",
    },
		height: app.globalData.height,
		menu: [
			{
				title: "活动介绍",
        content: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为充分展示“中外高水平大学学生交流计划（下称中高计划）”学生国际素养及素质教育的丰硕成果，全面提高学生英语运用综合能力，激发学生学习英语的积极性，中高计划全国运营中心与新航道国际教育集团（南京校区）共同举办第二届“中高杯”英语演讲暨“用英语讲中国故事-视频创作”活动。	\n&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;“用英语讲中国故事”活动是中国国家创新与发展战略研究会、中国教育电视台、新航道国际教育集团联合主办的首个以中华文化传播为主题，面向海内外青少年的人文综合素养类活动。用中英双语讲述中国故事的方式，通过语言交锋和思想交流增进全球青少年，特别是“一带一路”青少年心灵相通，共同谱写人文相亲、文明互鉴的新乐章，为推动构建人类命运共同体贡献年轻一代的力量。",
			},
			{
				title: "选题要求",
        content: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选手须采用“英文朗诵”“英文自我介绍”2种形式来准备作品。要求选手有家国情怀和国际视野，在真实任务情境下综合考查选手的思辨能力、跨文化创新能力、对中国文化的感悟力以及对多项语言技能的运用能力。有沟通自信和文化自信，整体考查选手语言表达能力，例如对发音、语调、用词及行文逻辑的掌握。",
			},
			{
				title: "活动日程"
			},
			{
				title: "活动规则"
			}
		],
		menuSelect: 0,
		menuTop: 0,
		menuFixes: false,
  },
  // 参赛
  toJoinRace(){
		// 报名关闭
		// wx.showToast({
		// 	title: '活动已截止',
		// 	icon: "none"
		// })
		// return
    wx.showLoading({
      title: '加载中',
    })
		wx.cloud.callFunction({
			name: "getUserInfo",
			success: res => {
				if (res.result&&res.result.data) {
          console.log("已注册")
          if(!res.result.data.is_buyMagazine){
            wx.hideLoading()
            wx.navigateTo({
              url: '../entrance/entrance',
            })
          }else{
            wx.cloud.callFunction({
              name: "getUploadTime",
              success: res=>{
                console.log(res)
                wx.hideLoading()
								if(res.result<1){
									wx.showToast({
										title: "已上传过作品",
										icon: "none"
									})
								}else{
									wx.navigateTo({
										url: '../uploadWorks/uploadWorks',
									})
								}
              }
            })
          }
				}else{
          wx.hideLoading()
          wx.navigateTo({
            url: '../entrance/entrance',
          })
        }
			}
		})
  },
	onLoad(options) {
		that = this
		wx.createSelectorQuery().selectAll('.menu').boundingClientRect(function (rect) {
			that.setData({
				menuTop: rect[0].top-that.data.height
			})
		}).exec()
		for(let i in that.data.menu){
			wx.createSelectorQuery().selectAll('#text'+i).boundingClientRect(function (rect) {
				that.data.menu[i].top = rect[0].top-that.data.height-106
			}).exec()
		}
		that.setData({
			menu: that.data.menu
		})
	},
	onPageScroll(e){
		if(e.scrollTop>=that.data.menuTop){
			that.setData({
				menuFixes: true
			})
		}
		if(e.scrollTop<that.data.menuTop-53){
			that.setData({
				menuFixes: false
			})
		}
	},
	menuSelect(e){
		that.setData({
			menuSelect: e.currentTarget.dataset.value
		})
		wx.pageScrollTo({
			scrollTop: that.data.menu[e.currentTarget.dataset.value].top,
			duration: 300,
		})
	},
	// 奖状预览
	imagePreview() {
		wx.previewImage({
			current: 0,
			urls: ["cloud://cloud1-4gojwhjp38f8a41c.636c-cloud1-4gojwhjp38f8a41c-1315829236/prizeImg/awardPre.png"],
			complete: err=>{
				console.log(err)
			}
		})
	},
})