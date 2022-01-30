<template>
	<div class="wrapper">
		<!-- <el-button class="btn-login" type="primary" @click="login">微信登录</el-button> -->
		<view class="login">登录中...</view>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			this.login();
		},
		methods: {
			login() {
				
				let frontEndUrl = uni.$url.frontEndUrl;
				let url = encodeURIComponent(frontEndUrl+'/#/pages/login/blank');
				window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1c9d77f2a708e46d&redirect_uri=${url}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`;
				
			}
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