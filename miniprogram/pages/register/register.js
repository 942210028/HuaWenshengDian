const app = getApp()
let that = null
import {
  areaList
} from "../../miniprogram_npm/@vant/area-date"
const citys = {
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
      title: "",
			titleColor: "white",
			bg_color: "#b81d1d",
			backIcon: "white"
    },
		height: app.globalData.height,
		userType: null,
		groupActive: ['1'],
		groupList: ["大学"],
		gradeColumns: ["2019","2020","2021","2022","2023"],
		schoolColumns: [
      {
        values: Object.keys(citys),
        className: 'column1',
      },
      {
        values: citys["南京师范大学"],
        className: 'column2',
      },
    ],

    areaList,
		modifyCityShow: false,
		modifyGradeShow: false,
		modifyschoolShow: false,
		studentInfo: {
      username: null, //学生姓名
      school: null, //学校名称
			group: null, //参赛组别
			otherName: null, //主要联系人
			phone: null, //手机号
			email: null, //邮箱
			instructorName: null, //指导老师
      instructorPhone: null, //指导老师电话
      city: null, // 所在城市
      address: null, // 详细地址
		},
		teacherInfo: {
      group: null, //组别
			username: null, //教师姓名
			phone: null, //手机号
			schoolName: null, //学校名称
      city: null, // 所在城市
      address: null, // 详细地址
		},
		schoolInfo: {
			schoolName: null, //学校名称
			grade: null, //年级
			speciality: null, //专业
			name: null, //姓名
			phone: null, //手机号
			email: null, //邮箱
      city: null, // 所在城市
      address: null, // 详细地址
		},
		modifySchoolContent: "",
  },
  onShow(){
    console.log(app.globalData.agreement)
    if(!app.globalData.agreement){
      wx.navigateTo({
        url: '../agreement/agreement',
      })
    }
  },
	onLoad(options) {
		that = this
		// 1学生 2老师 3校方
		console.log(options)
		that.setData({
			userType: Number(options.type)
		})
	},
	commit(){
		if(that.data.userType==1){
			var studentInfo = that.data.studentInfo
			console.log(that.data.studentInfo)
			if(!studentInfo.username||!studentInfo.group||!studentInfo.otherName||!studentInfo.phone||!studentInfo.email||!studentInfo.city||!studentInfo.address||!studentInfo.school){
				wx.showToast({
					title: '请完整填写',
					icon: 'none',
					mask: true,
				})
			}else{
        console.log(studentInfo)
        app.globalData.userType = that.data.userType
        wx.showLoading({
          title: '加载中',
        })
        wx.cloud.callFunction({
          name: "UpdateUserInfo",
          data: {
            name: studentInfo.username,
            school: studentInfo.school,
            group: studentInfo.group,
            contacts: studentInfo.otherName,
            phone_number: studentInfo.phone,
            email: studentInfo.email,
            instructor: studentInfo.instructorName,
            instructorPhone: studentInfo.instructorPhone,
            city: studentInfo.city,
            address: studentInfo.address,
            type: that.data.userType,
            is_buyMagazine: false,
          },
          success: res=>{
            console.log(res)
            wx.hideLoading()
            wx.redirectTo({
							// url: `../orderDetail/orderDetail?group=${studentInfo.group}&city=${studentInfo.city}&register=true`,
							url: `../index/index`
            })
          }
        })
			}
		}else if(that.data.userType==2){
			var teacherInfo = that.data.teacherInfo
			console.log(that.data.teacherInfo)
			if(!teacherInfo.username||!teacherInfo.phone||!teacherInfo.schoolName){
				wx.showToast({
					title: '请完整填写',
					icon: 'none',
					mask: true,
				})
			}else{
        console.log(teacherInfo)
        wx.showLoading({
          title: '加载中',
        })
        wx.cloud.callFunction({
          name: "UpdateUserInfo",
          data: {
            name: teacherInfo.username,
            phone_number: teacherInfo.phone,
            schoolName: teacherInfo.schoolName,
            type: that.data.userType,
            group: teacherInfo.group,
            city: teacherInfo.city,
            address: teacherInfo.address,
            is_buyMagazine: true,
          },
          success: res=>{
            console.log(res)
            app.globalData.userType = that.data.userType
            app.globalData.is_buyMagazine = true
            wx.hideLoading()
            wx.redirectTo({
							url: `../index/index`
            })
          }
        })
			}
		}else if(that.data.userType==3){
			var schoolInfo = that.data.schoolInfo
			console.log(that.data.schoolInfo)
			if(!schoolInfo.name||!schoolInfo.schoolName||!schoolInfo.grade||!schoolInfo.speciality||!schoolInfo.phone||!schoolInfo.email||!schoolInfo.city||!schoolInfo.address){
				wx.showToast({
					title: '请完整填写',
					icon: 'none',
					mask: true,
				})
			}else{
				wx.showModal({
					content: '请核对以上信息，确定无误！',
					success: (res) => {
						if (res.confirm) {
							console.log(schoolInfo)
							wx.showLoading({
								title: '加载中',
							})
							wx.cloud.callFunction({
								name: "UpdateUserInfo",
								data: {
									grade: schoolInfo.grade,
									name: schoolInfo.name,
									schoolName: schoolInfo.schoolName,
									phone_number: schoolInfo.phone,
									email: schoolInfo.email,
									type: that.data.userType,
									group: "初中",
									speciality: schoolInfo.speciality,
									city: schoolInfo.city,
									address: schoolInfo.address,
									is_buyMagazine: true,
								},
								success: res=>{
									console.log("大学组",res)
									app.globalData.userType = that.data.userType
									app.globalData.is_buyMagazine = true
									wx.hideLoading()
									wx.showToast({
										title: '注册成功',
										mask: true,
										duration: 1500
									})
									setTimeout(()=>{
										wx.switchTab({
											url: `../index/index`
										})
									},1500)
								}
							})
						}
					}
				})
			}
		}
	},
	inputChange(e){
		that.data.studentInfo[e.currentTarget.dataset.value]=e.detail
		that.data.teacherInfo[e.currentTarget.dataset.value]=e.detail
		that.data.schoolInfo[e.currentTarget.dataset.value]=e.detail
		that.setData({
			studentInfo: that.data.studentInfo,
			teacherInfo: that.data.teacherInfo,
			schoolInfo: that.data.schoolInfo,
		})
	},
	selectGroup(e){
		console.log(e)
    this.setData({
			groupActive: ['1'],
			['studentInfo.group']: e.currentTarget.dataset.value,
			['teacherInfo.group']: e.currentTarget.dataset.value,
			['schoolInfo.group']: e.currentTarget.dataset.value,
		});
	},
  onChange_group(e) {
    this.setData({
      groupActive: e.detail,
    });
  },
  // 改城市列表显示
  modifyCityShow() {
    this.setData({
      modifyCityShow: !this.data.modifyCityShow
    })
	},
	// 改年级列表显示
	modifyGradeShow() {
    this.setData({
      modifyGradeShow: !this.data.modifyGradeShow
    })
	},
	// 选学校列表显示
	modifySchoolShow(e) {
		console.log(e)
    this.setData({
      modifySchoolShow: !this.data.modifySchoolShow
    })
	},
  // 选择城市
  modifyCity(e) {
    console.log(e)
    var that = this
    that.setData({
      ["studentInfo.city"]: e.detail.values[0].name + "," + e.detail.values[1].name + "," + e.detail.values[2].name,
      ["teacherInfo.city"]: e.detail.values[0].name + "," + e.detail.values[1].name + "," + e.detail.values[2].name,
      ["schoolInfo.city"]: e.detail.values[0].name + "," + e.detail.values[1].name + "," + e.detail.values[2].name,
      modifyCityShow: false
    })
	},
	modifyGrade(e){
    var that = this
    that.setData({
      ["schoolInfo.grade"]: e.detail.value,
      modifyGradeShow: false
    })
	},
	// 选学校列表变动
	modifyschoolOnChange(e){
		const { picker, value, index } = e.detail;
    picker.setColumnValues(1, citys[value[0]]);
	},
	modifyschool(e){
		var that = this
    that.setData({
			["schoolInfo.schoolName"]: e.detail.value[0],
			["schoolInfo.speciality"]: e.detail.value[1],
			modifySchoolContent: e.detail.value[0] + '/' + e.detail.value[1],
      modifySchoolShow: false
    })
	},
})