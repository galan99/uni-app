let url = "http://video.midefangzhi.com"
// let url = "http://192.168.1.3:3003"
export const post = (opt) => {
	let data = opt.data || {};
	let cmd = opt.cmd || "";
	return new Promise((resolve, reject) => {
		uni.request({
			url: url + cmd, //仅为示例，并非真实接口地址。
			data: data,
			method: "post",
			success: (res) => {
				resolve(res.data)
				if (res.data.code != 200) {
					uni.showToast({
						title: res.data.message || "服务器开小差了！",
						duration: 2000
					});
				}
			},
			fail: (res) => {
				reject(res)
				uni.showToast({
					title: res.message || "服务器开小差了！",
					duration: 2000
				});
			}
		});
	})
}

export const get = (opt) => {
	let headerConfig = opt.headerConfig;
	let url = opt.url;
	let data = opt.data || {}
	return new Promise((resolve, reject) => {
		uni.request({
			url: url, //仅为示例，并非真实接口地址。
			method: "GET",
			data: data,
			header:{
				"user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
			},
			success: (res) => {
				resolve(res.data)
			},
			fail: (res) => {
				console.log(res)
				uni.showToast({
					title: res.message || "服务器开小差了！",
					duration: 2000
				});
				reject(res)
			}
		});
	})
}
