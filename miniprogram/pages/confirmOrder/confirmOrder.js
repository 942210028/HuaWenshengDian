const app = getApp();
let that = null;
Page({
	data: {
		navbarData: {
			showCapsule: 1,
			title: "确认订单",
			bg_color: "white",
		},
		height: app.globalData.height,
		totalPrice: 6000,
		magazineType: null,
		goodsNum: 4,
		userInfo: {},
		successIcon: false,
		register: false,
	},

	selectNumber(e) {
		this.setData({
			goodsNum: e.currentTarget.dataset.value,
			totalPrice: e.currentTarget.dataset.value * 1500,
		});
	},
	onShow() {
		wx.cloud.callFunction({
			name: "getUserInfo",
			success: (res) => {
				console.log(res);
				if (res.result && res.result.data) {
					console.log(res.result.data);
					that.setData({
						userInfo: res.result.data,
						["userInfo.address"]: res.result.data.city && res.result.data.address ? res.result.data.city.replace(/,/g, "") + res.result.data.address : ""
					});
				}
				wx.getStorage({
					key: "address",
					success: (res) => {
						console.log(res);
						that.setData({
							["userInfo.name"]: res.data.name,
							["userInfo.phone_number"]: res.data.phone,
							["userInfo.address"]: res.data.city + res.data.address,
						});
					},
				});
			},
		});
	},
	onLoad(options) {
		that = this;
		that.setData({
			magazineType: options.magazineType,
			goodsNum: options.goodsNum,
			register: options.register ? options.register : false,
			totalPrice: options.goodsNum * 1500,
		});
	},
	toEditAddress() {
		wx.navigateTo({
			url: "../shoppingAddress/shoppingAddress",
		});
	},
	//提交订单
	onSubmit() {
		let that = this;
		if (!that.data.userInfo.address) {
			wx.showToast({
				title: "请输入地址！",
				icon: "error",
			});
			return;
		}
		wx.cloud.callFunction({
			name: "Payment",
			data: {
				totalFee: that.data.totalPrice, //支付金额单位分
				// totalFee: 1, //支付金额单位分
				type: "pay",
			},
			success: (res) => {
				console.log(res);
				that.setData({
					outTradeNo: res.result.outTradeNo, //返回商户订单号
				});
				const payment = res.result.payment;
				wx.requestPayment({
					...payment,
					success(res) {
						console.log("pay success", res);
						wx.showLoading({
							title: "支付成功",
							mask: true,
						});
						wx.cloud.callFunction({
							name: "Order",
							data: {
								type: "add",
								address: that.data.userInfo.address,
								group: that.data.magazineType == "red" ? "小低" : (that.data.magazineType == "green" ? "小高" : "初中"),
								name: that.data.userInfo.name,
								number: that.data.goodsNum,
								outTradeNo: that.data.outTradeNo,
								phone_number: that.data.userInfo.phone_number,
								totalFee: that.data.totalPrice,
							},
							success: (res) => {
								wx.hideLoading();
								app.globalData.is_buyMagazine = that.data.register ? that.data.register : false
								wx.cloud.callFunction({
									name: "UpdateUserInfo",
									data: {
										is_buyMagazine: that.data.register ? that.data.register : false
									}
								})
								that.setData({
									successIcon: true
								})
							},
							fail: err=>{
								wx.cloud.database().collection('failBack').add({
									data: {
										event: err,
									}
								})
							}
						});
					},
					fail(err) {
						console.error("pay fail", err);
					},
				});
			},
			fail: console.error,
		});
	},
	successIcon() {
		that.setData({
			successIcon: false
		})
		wx.switchTab({
			url: '../index/index',
		})
	}
});