<template>
	<view class="wrapper">
		
		<u-navbar
			title="历史详情"
			left-text="返回"
			:fixed="true"
			bgColor="#ecf5ff"
			@leftClick="onClickLeft"
		>
		</u-navbar>
		
		
		<view class="content" v-if="expressInfo">
			
			<el-descriptions :span="24" title="收件信息">
				<el-descriptions-item :span="24" label="姓名">{{ expressInfo.receivedName }}</el-descriptions-item>
				<el-descriptions-item :span="24" label="手机号码">{{ expressInfo.receivedPhone }}</el-descriptions-item>
				<el-descriptions-item :span="24" label="配送地址">{{ expressInfo.receivedAddress }}</el-descriptions-item>
			</el-descriptions>
			
			<el-descriptions :span="24" title="包裹信息">
				<block v-for="(item,index) in expressInfo.orderDetail" :key="index">
					<el-descriptions-item contentStyle="color: #409EFF;font-weigh: bold;" :span="24" label="取件号">{{ item.expressCode }}</el-descriptions-item>
					<el-descriptions-item :span="24" label="快递公司">{{ item.shippingCompanyName }}</el-descriptions-item>
				</block>
				<el-descriptions-item :span="24" label="送件时段">{{ expressInfo.orderShippingTime }}</el-descriptions-item>
				<el-descriptions-item :span="24" label="备注">{{ expressInfo.remark }}</el-descriptions-item>
				<el-descriptions-item :span="24" label="创建时间">{{ expressInfo.createTime }}</el-descriptions-item>
				<el-descriptions-item  contentStyle="color: #DD524D;font-weigh: bold;" :span="24" label="金额总计">{{ expressInfo.orderPayTotal }}元</el-descriptions-item>
			</el-descriptions>
						
		</view>
		
	</view>
</template>

<script>
export default {
	data() {
		return {
			expressInfo: {}
		}
	},
	onLoad(options) {
		
		// alert(options.orderId);
		this.getOrderDetail(options.orderNumber);
	},
	methods: {
		onClickLeft() {
			uni.navigateBack()
		},
		async getOrderDetail(orderNumber) {
			
			let wxLoginUser = uni.getStorageSync('token') || '';
			
			let query = {
				wxLoginUser,
				orderNumber
			};
			
			let res = await uni.$http.get(uni.$url.getOrderDetailUrl, query );
			
			// alert(JSON.stringify(res));
			
			if(res.data.code !== 0) return uni.showToast({title: res.data.msg, icon: 'none', duration: 2000});
			
			this.expressInfo = res.data.data;
			
		}
	}
	
}
	
</script>

<style lang="scss">
	.wrapper {
		position: relative;
	}
	.content {
		padding: 44px 20rpx;
	}
	.btn-list {
		position: fixed;
		bottom: 0;
		height: 44px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgb(236, 245, 255);
	}

</style>
