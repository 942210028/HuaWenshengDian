const user = [{
		pagePath: "pages/index/index",
		text: "主页",
		iconPath: "/images/userTabBar/index.png",
		selectedIconPath: "/images/userTabBar/index_active.png",
		auth: 0
	},
	{
		pagePath: "pages/race/race",
		text: "活动",
		iconPath: "/images/userTabBar/race.png",
		selectedIconPath: "/images/userTabBar/race_active.png",
		auth: 0
	},
	{
		pagePath: "pages/mine/mine",
		text: "我的",
		iconPath: "/images/userTabBar/mine.png",
		selectedIconPath: "/images/userTabBar/mine_active.png",
		auth: 0
	}
]
const admin = [{
		pagePath: "pages/index/index",
		text: "主页",
		iconPath: "/images/adminTabBar/index.png",
		selectedIconPath: "/images/adminTabBar/index_active.png",
		auth: 0
	},
	{
		pagePath: "pages/userInfo/userInfo",
		text: "用户信息",
		iconPath: "/images/adminTabBar/userInfo.png",
		selectedIconPath: "/images/adminTabBar/userInfo_active.png",
		auth: 0
	},
	{
		pagePath: "pages/examine/examine",
		text: "在线审阅",
		iconPath: "/images/adminTabBar/examine.png",
		selectedIconPath: "/images/adminTabBar/examine_active.png",
		auth: 0
	},
	{
		pagePath: "pages/mine/mine",
		text: "我的",
		iconPath: "/images/adminTabBar/mine.png",
		selectedIconPath: "/images/adminTabBar/mine_active.png",
		auth: 0
	}
]
module.exports = {
	user,
	admin
}