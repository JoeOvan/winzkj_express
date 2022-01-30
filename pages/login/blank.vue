<template>
	<!-- 此页面为空白页，只为去掉扫码页面的code -->
	<div class="wrapper">
		<view class="login">登录中...</view>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad(options) {
			
			//清除缓存
			// uni.clearStorageSync();
			
			
			let token = uni.getStorageSync('token');
			
			if(token == null || token == "") {
				//如果为空获取code发起请求
				let code = this.getUrlCode('code');
				console.log(code)
				// alert(code);
				if(code !== null || code !== "") {
					this.getOpenidAndUserinfo(code)
				}
			} else {
				
				this.goIndex();
				
			}
			
		},
		methods: {
			getUrlCode (name) {
				return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ''])[1].replace(/\+/g, '%20')) || null
			},
			async getOpenidAndUserinfo(code) {
				
				let res = await uni.$http.post(uni.$url.wxLoginUrl, {code});
				
				if(res.data.code !== 0) return uni.showToast({title: res.data.msg, icon: 'none', duration: 2000});
				
				let token = res.data.data;

				uni.setStorageSync('token', token);
				
				this.goIndex();


			},
			goIndex() {
				let url = uni.$url.frontEndUrl + '/#/pages/index/index';
				window.location.href = url;
			},
		}
	}
</script>
<style lang="scss">
	page {
		display: flex;
		width: 100%;
		height: 100%;
	}
	.wrapper {
		display: flex;
		width: 100%;
		height: 100%;
		justify-content: center;
		align-items: center;
		.btn-login {
			
		}
	}
</style>