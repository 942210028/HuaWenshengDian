const app = getApp()
let that = null
const school = {
	南京师范大学: ['会计学', '财务管理', '计算机科学与技术'],
	南通大学: ['翻译学', '软件工程'],
	江苏大学: ['金融学', '计算机科学与技术', '电气工程及其自动化', '新能源科学与工程'],
	江西农业大学: ['会计学', '环境科学与工程'],
	四川农业大学: ['经济学', '工商管理', '生物技术', '食品科学与技术'],
	四川音乐学院: ['广播电视编导', '艺术史论'],
	成都中医药大学: ['医学信息工程', '药学', '智能医学工程'],
	景德镇陶瓷大学: ['视觉传达', '环境设计', '市场营销', '机械设计制造及其自动化', '环境工程', '动画'],
	东华理工大学: ['资源勘查工程', '化学工程与工艺'],
	华北理工大学: ['英语','工程管理','金融学'],
	燕山大学: ['土木工程', '材料科学与工程'],
	辽宁大学: ['生物技术', '经济学', '新闻专业','英语'],
	沈阳师范大学: ['翻译专业'],
	广西民族大学: ['人工智能', '金融学'],
	广西医科大学: ['药学'],
	广西大学: ['计算机科学与技术'],
	广西师范大学: ['小学教育'],
	集美大学: ['会计学','英语(商务方向)'],
	闽南师范大学: ['经济学','计算机科学与技术'],
	西南石油大学: ['机械工程', '计算机科学与技术', '市场营销', '化工工程与工艺'],
	浙江科技大学: ['机器人工程', '国际商务'],
};
Page({
	data: {
		navbarData: {
			showCapsule: 1,
			titleColor: "white",
			bg_color: "#b81d1d",
			backIcon: "white"
		},
		height: app.globalData.height,
		userInfo: {},
		chooseGradeShow: false, //选择年级开关
		modifylangsongShow: false,
		modifyschoolShow: false,
		modifyspecialityShow: false,

		langsongColumns: ["屈原与九畹溪的兰花 Qu Yuan and the Orchids of Jiuwan Stream","未了的乡愁 Lingering Nostalgia","老子身上的中国智慧 Origin of Chinese Wisdom”","屡创“世界第一”的港珠澳大桥 The Hong Kong-Zhuhai-Macao Bridge","高山流水遇知音 Classical Music: Story of Mountains and Streams","平凡岗位上的不平凡奉献 Train Ticket Seller Sun Qi","世界第八大奇迹 Terracotta Warriors The Eighth Wonder of the World","面条像裤带 奇字奇面 Biangbiang Noodles A Fantastic Dish with a Fantastic Name","曾国藩洋务运动的先驱者 Zeng Guofan Pioneer of the Self-Strengthening Movement","湘绣 以针代笔的艺术 Xiang Embroidery Using Needles to Create Artworks","追求卓越 永无止境的创新动力 Shanghai Academy of Spaceflight Technology Pursuing Excellence in Aerospace Innovation","江南制造局 中国民族工业的摇篮 The Jiangnan Shipyard The Cradle of Chinese National Industry"],
		schoolColumns: [
      {
        values: Object.keys(school),
        className: 'column1',
      },
      {
        values: school["南京师范大学"],
        className: 'column2',
      },
    ],
		chooseGradeActions: [{
			name: '2019'
		}, {
			name: '2020'
		}, {
			name: '2021'
		}, {
			name: '2022'
		}, {
			name: '2023'
		}], //选择年级面板选项
		recitationTitle: "", //朗诵名称


		fileList: [], //上传作品列表
		video_url: "", //上传视频路径
		video_thumb: "", //视频封面
		duration: 0, //视频时长

		fileList2: [], //上传作品列表2
		video_url2: "", //上传视频路径2
		video_thumb2: "", //视频封面2
		duration2: 0, //视频时长2
	},
	commit() {
		if (!that.data.recitationTitle || !that.data.video_url2 || !that.data.duration2 || !that.data.userInfo.name || !that.data.userInfo.grade || !that.data.userInfo.phone_number || !that.data.userInfo.email || !that.data.userInfo.schoolName || !that.data.userInfo.speciality) {
			wx.showToast({
				title: '请完整填写信息哦',
				icon: "none",
			})
			return
		}
		wx.showLoading({
			title: '加载中',
			mask: true,
		})
		wx.cloud.callFunction({
			name: 'FirstWorks',
			data: {
				type: 'add',
				name: that.data.userInfo.name,
				grade: that.data.userInfo.grade,
				schoolName: that.data.userInfo.schoolName,
				author: that.data.userInfo.author,
				instructor: that.data.userInfo.instructor,
				speciality: that.data.userInfo.speciality,
				phone_number: that.data.userInfo.phone_number,
				email: that.data.userInfo.email,
				speechTitle: that.data.speechTitle,
				recitationTitle: that.data.recitationTitle,
				video_url: that.data.video_url,
				video_url2: that.data.video_url2,
				video_thumb: that.data.video_thumb,
				video_thumb2: that.data.video_thumb2,
				duration: that.data.duration,
				duration2: that.data.duration2,
			},
			success: res => {
				console.log(res)
				wx.hideLoading()
				wx.showToast({
					title: '上传成功',
					mask: true,
					duration: 1500
				})
				setTimeout(function () {
					wx.switchTab({
						url: '../index/index',
					})
				}, 1500)
			}
		})
	},
	onLoad(options) {
		that = this
		wx.cloud.callFunction({
			name: "getUserInfo",
			success: res => {
				if (res.result.data) {
					console.log(res.result.data)
					that.setData({
						userInfo: res.result.data
					})
				}
			}
		})
	},
	// 参赛人姓名
	joinRaceUserNameInput(e) {
		that.setData({
			['userInfo.name']: e.detail.value
		})
	},
	// 选择年级面板
	chooseGradeShow() {
		that.setData({
			chooseGradeShow: !that.data.chooseGradeShow
		})
	},
	// 参赛人年级
	chooseGradeOnSelect(e) {
		console.log(e)
		that.setData({
			['userInfo.grade']: e.detail.name
		})
	},
	// 手机号输入
	phoneInput(e) {
		that.setData({
			['userInfo.phone']: e.detail.value
		})
	},
	// 邮箱输入
	emailInput(e) {
		that.setData({
			['userInfo.email']: e.detail.value
		})
	},
	authorInput(e) {
		that.setData({
			['userInfo.author']: e.detail.value
		})
	},
	instructorInput(e) {
		that.setData({
			['userInfo.instructor']: e.detail.value
		})
	},
	maskTap(){
    this.setData({
      modifylangsongShow: false,
      modifyschoolShow: false,
      modifyspecialityShow: false,
    })
	},
	modifylangsongShow() {
    this.setData({
      modifylangsongShow: !this.data.modifylangsongShow
    })
	},
	modifyschoolShow(e) {
		console.log(e)
    this.setData({
      modifyschoolShow: !this.data.modifyschoolShow
    })
	},
	// 选学校列表变动
	modifyschoolOnChange(e){
		const { picker, value, index } = e.detail;
    picker.setColumnValues(1, school[value[0]]);
	},
	modifyschool(e){
		var that = this
    that.setData({
			["userInfo.schoolName"]: e.detail.value[0],
			["userInfo.speciality"]: e.detail.value[1],
      modifyschoolShow: false
    })
	},
	modifylangsong(e){
    var that = this
    that.setData({
      recitationTitle: e.detail.value,
      modifylangsongShow: false
    })
	},
	// 上传文件1
	beforeRead(event) {
		console.log(event);
		if(this.data.fileList2.length==0){
			wx.showToast({
				title: '请先上传作品1',
				icon: 'none'
			})
			return
		}
		const {
			file,
			callback
		} = event.detail;
		this.setData({
			duration: file[0].duration
		})
		if (file[0].duration > 91) {
			wx.hideLoading()
			wx.showToast({
				title: '视频过长',
				icon: 'error'
			})
			callback(false)
		}else if(file[0].duration < 60){
			wx.hideLoading()
			wx.showToast({
				title: '视频过短',
				icon: 'error'
			})
			callback(false)
		}else if(file[0].size>200000000){
			wx.hideLoading()
			wx.showToast({
				title: '视频过大',
				icon: 'error'
			})
			callback(false)
		} else {
			callback(true)
		}
	},
	afterRead(e){
		console.log(e)
		this.setData({
			fileList: e.detail.file
		})
		if (that.data.fileList.length<1) {
			wx.showToast({
				title: '请选择视频',
				icon: 'none'
			});
		} else {
			wx.showLoading({
				title: '上传中，请等待',
				mask: true
			})
			const { file } = e.detail;
			const fileName = new Date().getTime()+ "." + file[0].url.replace(/.+\./, "");
			const video_cloudPath = `upload/${that.data.userInfo._id}/firstWork/${fileName}`
			wx.cloud.uploadFile({
				cloudPath: video_cloudPath,
				filePath: file[0].url,
				success: res=>{
					console.log(res)
					this.setData({
						video_url: res.fileID
					});
					const thumb_cloudPath = `upload/${that.data.userInfo._id}/firstWork/${new Date().getTime()}video_thumb.jpg`
					wx.cloud.uploadFile({
						cloudPath: thumb_cloudPath,
						filePath: file[0].thumb,
						success: ress=>{
							wx.hideLoading()
							wx.showToast({
								title: '上传成功',
								icon: 'none'
							});
							this.setData({
								video_thumb: ress.fileID
							});
						},
						fail: err=>{
							wx.cloud.database().collection('failBack').add({
								data: {
									open_id: that.data.userInfo._id,
									name: that.data.userInfo.name,
									event: err,
									time: new Date(),
									value: "thumb upload"

								}
							})
							wx.hideLoading()
							wx.showToast({
								title: '上传错误，请重试',
								icon: 'none'
							});
							this.setData({
								fileList: [],
							});
						}
					});
				},
				fail: err=>{
					wx.cloud.database().collection('failBack').add({
						data: {
							open_id: that.data.userInfo._id,
							name: that.data.userInfo.name,
							event: err,
							time: new Date(),
							value: "video upload"
						}
					})
					wx.hideLoading()
					wx.showToast({
						title: '上传错误，请重试',
						icon: 'none'
					});
					this.setData({
						fileList: [],
					});
				}
			});
		}
	},
	// 上传文件2
	beforeRead2(event) {
		console.log(event);
		const {
			file,
			callback
		} = event.detail;
		this.setData({
			duration2: file[0].duration
		})
		if (file[0].duration > 91) {
			wx.hideLoading()
			wx.showToast({
				title: '视频过长',
				icon: 'error'
			})
			callback(false)
		}else if(file[0].duration < 60){
			wx.hideLoading()
			wx.showToast({
				title: '视频过短',
				icon: 'error'
			})
			callback(false)
		}else if(file[0].size>200000000){
			wx.hideLoading()
			wx.showToast({
				title: '视频过大',
				icon: 'error'
			})
			callback(false)
		} else {
			callback(true)
		}
	},
	afterRead2(e){
		console.log(e)
		this.setData({
			fileList2: e.detail.file
		})
		if (that.data.fileList2.length<1) {
			wx.showToast({
				title: '请选择视频',
				icon: 'none'
			});
		} else {
			wx.showLoading({
				title: '上传中，请等待',
				mask: true
			})
			const { file } = e.detail;
			const fileName = new Date().getTime()+ "." + file[0].url.replace(/.+\./, "");
			const video_cloudPath = `upload/${that.data.userInfo._id}/secondWork/${fileName}`
			wx.cloud.uploadFile({
				cloudPath: video_cloudPath,
				filePath: file[0].url,
				success: res=>{
					this.setData({
						video_url2: res.fileID
					});
					console.log(res)
					const thumb_cloudPath = `upload/${that.data.userInfo._id}/secondWork/${new Date().getTime()}video_thumb2.jpg`
					wx.cloud.uploadFile({
						cloudPath: thumb_cloudPath,
						filePath: file[0].thumb,
						success: ress=>{
							wx.hideLoading()
							wx.showToast({
								title: '上传成功',
								icon: 'none'
							});
							this.setData({
								video_thumb2: ress.fileID
							});
						},
						fail: err=>{
							wx.cloud.database().collection('failBack').add({
								data: {
									open_id: that.data.userInfo._id,
									name: that.data.userInfo.name,
									event: err,
									time: new Date(),
									value: "thumb upload"
								}
							})
							wx.hideLoading()
							wx.showToast({
								title: '上传错误，请重试',
								icon: 'none'
							});
							this.setData({
								fileList2: [],
							});
						}
					});
				},
				fail: err=>{
					wx.cloud.database().collection('failBack').add({
						data: {
							open_id: that.data.userInfo._id,
							name: that.data.userInfo.name,
							event: err,
							time: new Date(),
							value: "video upload"
						}
					})
					wx.hideLoading()
					wx.showToast({
						title: '上传错误，请重试',
						icon: 'none'
					});
					this.setData({
						fileList2: [],
					});
				}
			});
		}
	},
	deteleFile() {
		var that = this
		wx.cloud.deleteFile({
			fileList: [that.data.video_url,that.data.video_thumb],
			success: res => {
				console.log(res.fileList)
			},
			fail: console.error
		})
		that.setData({
			fileList: [],
			video_url: "",
			video_thumb: ""
		})
	},
	deteleFile2() {
		var that = this
		wx.cloud.deleteFile({
			fileList: [that.data.video_url2,that.data.video_thumb2],
			success: res => {
				console.log(res.fileList)
			},
			fail: console.error
		})
		that.setData({
			fileList2: [],
			video_url2: "",
			video_thumb2: ""
		})
	},
})