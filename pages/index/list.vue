<template>
	<view class="wrapper">
		
		<u-navbar
			title="历史列表"
			left-text="返回"
			:fixed="true"
			bgColor="#ecf5ff"
			@leftClick="onClickLeft"
		>
		</u-navbar>
		
		<view class="content">			
			<view v-for="(item, index) in expressList" :key="index" class="text item">
				<el-card class="box-card">
					<view @click="toDetail(item.orderNumber)">						
						<view class="consignee-info">
							<view class="consignee">
								<text class="username">{{ item.receivedName }}</text>
								<text class="phone">{{ item.receivedPhone }}</text>
							</view>
							<view class="total">金额总计：{{ item.orderPayTotal }}元</view>
						</view>
						<view class="package-info">
							<text class="create-time">{{ item.createTime }}</text>
							<text class="timer">配送时段：{{ item.orderShippingTime }}</text>
						</view>
					</view>
				</el-card>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				expressList: []
			}
		},
		onLoad(options) {
			
			this.getOrderList();
		},
		methods: {
			onClickLeft() {
				uni.navigateBack()
			},
			async getOrderList() {
				
				let wxLoginUser = uni.getStorageSync('token') || '';
				
				let res = await uni.$http.get(uni.$url.getOrderListUrl, { wxLoginUser } );
				
				if(res.data.code !== 0) return uni.showToast({title: res.data.msg, icon: 'none', duration: 2000});
				
				this.expressList = res.data.data.list;
				
			},
			//跳转到详情
			toDetail(orderNumber) {
			
				uni.navigateTo({
					url: '/pages/index/detail?orderNumber=' + orderNumber
				})
			}
		}
	}
</script>

<style lang="scss">
	.box-card {
		padding: 20rpx;
		margin: 15rpx;
		.package-info {
			display: flex;
			justify-content: space-between;
			.create-time {
				color: #999999;
			}
		}
		
		.consignee-info {
			display: flex;
			justify-content: space-between;
			.username {
				margin-right: 15rpx;
			}
		}
	}
	
	.content {
		padding-top: 44px;
	}
</style>
