import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import uView from "uview-ui";
import { API_URL } from './api/api.js'
// 导入网络请求的包
import { $http } from '@escook/request-miniprogram'

Vue.use(uView);
Vue.use(ElementUI);

uni.$url = API_URL
uni.$http = $http



// 请求的根路径
// $http.baseUrl = 'https://www.uinav.com'

// 请求拦截器
$http.beforeRequest = function(options) {
	uni.showLoading({
		title: '数据加载中...'
	})

	// // 判断当前请求的是否为有权限的接口
	// if (options.url.indexOf('/') !== -1) {
	// 	options.header = {
	// 		'X-Nideshop-Token': uni.getStorageSync('token') || ''
	// 	}
	// }
	// 判断当前请求的是否为有权限的接口
	if (options.url.indexOf('/') !== -1) {
		
		
		if (options.url.indexOf('/api/login') !== -1) {
			
			options.header = {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
			
			return
		}
		
		options.header = {
			'Content-Type': 'application/x-www-form-urlencoded'
			// 'wxLoginUser': uni.getStorageSync('token') || ''
		}
	}


}

// 响应拦截器
$http.afterRequest = function(res) {
	
	uni.hideLoading();

	let code = res.data.code;
	if (code == 401) {
		
		uni.setStorageSync('token', '');
		// uni.setStorageSync('userInfo', {});

		// 询问用户是否登录
		uni.showModal({
			title: '提示',
			content: '请先登录吗？',
			success: function(res) {
				if (res.confirm) {
					console.log('用户点击确定');
					// 用户确认了登录的操作
					uni.navigateTo({
						url: `/pages/login/login`
					})
				} else if (res.cancel) {
					console.log('用户点击取消');
				}
			}
		});
	}
}

// 封装弹框的方法
uni.$showMsg = function(title = '数据请求失败！', duration = 1500) {
	uni.showToast({
		title,
		duration,
		icon: 'none'
	})
}




Vue.config.productionTip = false

App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif