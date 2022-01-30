<template>
	<view class="wrapper">
		
		<u-navbar 
			title="收件信息"
			right-text="历史列表"
			:fixed="true"
			@rightClick="onClickRight"
			bgColor="#ecf5ff"
		>
			<view slot="left">
			</view>
		</u-navbar>
		
		<view class="content">
			
			<el-form class="form" ref="form" :model="form" label-width="80px">
				<div class="form-label">收件信息：</div>
			  <el-form-item label="姓名">
			    <el-input v-model="receivedName" placeholder="请输入姓名"></el-input>
			  </el-form-item>
			  <el-form-item label="手机号码">
			    <el-input v-model="receivedPhone" placeholder="请手机号码"></el-input>
			  </el-form-item>
			  <el-form-item label="配送地址">
				<el-select class="select-item" v-model="form.address.area" placeholder="请选择校区..." @change="getCampusListLevel">
					<el-option
						v-for="item in form.areaOptions"
						:key="item.id"
						:label="item.infoName"
						:value="{ value: item.id, label: item.infoName }">
					</el-option>
				</el-select>
				<el-select class="select-item" v-model="form.address.level" placeholder="请选择宿舍区..." @change="getCampusListPlate">
				  <el-option
				  	v-for="item in form.levelOptions"
				  	:key="item.id"
				  	:label="item.infoName"
				  	:value="{ value: item.id, label: item.infoName }">
				  </el-option>
				</el-select>
				<el-select class="select-item" v-model="form.address.plate" placeholder="请选择宿舍楼...">
				  <el-option
				  	v-for="item in form.plateOptions"
				  	:key="item.id"
				  	:label="item.infoName"
				  	:value="{ value: item.id, label: item.infoName }">
				  </el-option>
				</el-select>
				<el-input v-model="dormNumber" placeholder="请输入宿舍号"></el-input>
			  </el-form-item>
			  <view class="form-label">包裹信息：</view>
			  <view class="tips"><text class="sign">*</text>每个包裹统一收费<text class="price">{{unityCost}}</text>元。&nbsp;&nbsp;如包裹过大过重（如大件行李、大件饮料等），平台有权利联系您，追加服务费用。</view>
			  <block v-for="(item,index) in packageList" :key="index">
				  <el-card class="package-info">				  
					  <el-form-item class="pick-up" label="取件号">
						<el-input type="number" placeholder="X" class="first-item" :ref="'firstItem_'+index" oninput="if(value.length>2)value=value.slice(0,2)" v-model.number="item.expressNumber.firstNumber"></el-input> <text class="text">&nbsp;-&nbsp;</text>
						<el-input type="number" placeholder="X" class="second-item" :ref="'secondItem_'+index" oninput="if(value.length>2)value=value.slice(0,2)" v-model.number="item.expressNumber.secondNumber"></el-input> <text class="text">&nbsp;-&nbsp;</text>
						<el-input type="number" placeholder="XXXX" class="third-item" :ref="'thirdItem_'+index" oninput="if(value.length>4)value=value.slice(0,4)" v-model.number="item.expressNumber.thirdNumber"></el-input>
					  </el-form-item>
					  <el-form-item label="快递公司">
						<el-select class="select-item" v-model="item.expressCompanyName" placeholder="请选择快递公司...">
						<block v-for="(item,index) in form.shippingCompanyName">
							<el-option :label="item.companyName" :value="{ value: item.id, label: item.companyName }"></el-option>
						</block>
						</el-select>
					  </el-form-item>
					  <u-icon class="delete" name="trash" color="#ccc" size="24" v-if="index !== 0" @click="deletePackage(index)"></u-icon>
				  </el-card>
			  </block>
			  <view class="add-package">
				  <u-icon name="plus-circle" color="#2979ff" size="28" @click="addPackage"></u-icon>
			  </view>
			  <el-form-item label="送件时段">
				  <el-select style="width: 100%;" v-model="form.orderShippingTime" placeholder="送件时段">
					  <block v-for="(item,index) in orderShippingTime">
						<el-option :label="item.shippingTime" :value="{ value: item.id, label: item.shippingTime }"></el-option>
					  </block>
				  </el-select>
				</el-form-item>
			  <el-form-item label="备注">
			    <el-input v-model="form.remark"></el-input>
			  </el-form-item>
			</el-form>
			
		</view>
		
		<view class="submit-wrap">
			<el-button class="btn-submit" type="primary" size="medium" @click="submitForm">提交</el-button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				receivedName: '',
				receivedPhone: '',
				dormNumber: '',
				form: {
					receivedAddress: '',
					address: {
						area: '',
						level: '',
						plate: ''
					},
					areaOptions: [],
					levelOptions: [],
					plateOptions: [],
					expressCode: {
						firstNumber: 0,
						secondNumber: 0,
						thirdNumber: 0
					},
					shippingCompanyName: '',
					orderShippingTime: '',
					remark: ''
				},
				packageList: [{
					expressCode: '',
					expressNumber: {
						firstNumber: '',
						secondNumber: '',
						thirdNumber: ''
					},
					expressCompanyName: '',
					shippingCompanyName: '',
				}],
				orderShippingTime: '',
				expressData: {},
				unityCost: '',  //快递单价
			}
		},
		async onLoad() {
			
			// 初始化收件信息获取缓存数据
			this.initExpressData();
			
			//获取快递单价
			this.getUnityCost();
			
			//请求快递公司
			this.getShippingCompanyList();
			//请求送快递时间段
			this.getShippingTimeList();

		},
		methods: {
			handleChange(value) {
				console.log(value);
			},
			onClickRight() {
				uni.navigateTo({
					url: "/pages/index/list"
				})
			},
			async initExpressData() {
				
				this.expressData = uni.getStorageSync('expressData');
				
				if(this.expressData) {
					
					this.receivedName = this.expressData.receivedName;
					this.receivedPhone = this.expressData.receivedPhone;
					
					
					let areaResult = await this.getCampusListArea();
					
					let areaData = areaResult.data.data.list;
					
					//设置跳出循环结束执行
					let areaFlag = false;
					
					for (let i = 0; i < areaData.length; i++) {
						
						if(this.expressData.address.area.label === areaData[i].infoName && this.expressData.address.area.value === areaData[i].id) {
							
							this.form.address.area = {
								value: this.expressData.address.area.value,
								label: this.expressData.address.area.label
							};
				
							areaFlag = true;
				
							break
							
						}
						
						
					}
					
					if(!areaFlag) return;
				
				
				
				
					
					//存在一级类目再请求二级类目
					let levelResult = await this.getCampusListLevel(this.expressData.address.area);
					
					let levelData = levelResult.data.data.list;
				
					
					//设置跳出循环结束执行
					let levelFlag = false;
					
					for (let j = 0; j < levelData.length; j++) {
						
						if(this.expressData.address.level.label === levelData[j].infoName && this.expressData.address.level.value === levelData[j].id) {
							
							this.form.address.level = {
								value: this.expressData.address.level.value,
								label: this.expressData.address.level.label
							};
				
							levelFlag = true;
							
							break
							
						}
						
						
					}
					
					if(!levelFlag) return;
					
					
					
					
					//存在二级类目再请求三级类目
					let plateResult = await this.getCampusListPlate(this.expressData.address.level);
					
					let plateData = plateResult.data.data.list;
					
					//设置跳出循环结束执行
					let plateFlag = false;
					
					
					for (let k = 0; k < plateData.length; k++) {
						
						if(this.expressData.address.plate.label === plateData[k].infoName && this.expressData.address.plate.value === plateData[k].id) {
							
							this.form.address.plate = {
								value: this.expressData.address.plate.value,
								label: this.expressData.address.plate.label
							};
							
							plateFlag = true;
							
							break
							
						}
						
					}
					
					
					if(!plateFlag) return;
					
					//存在三级目录设置宿舍号
					this.dormNumber = this.expressData.dormNumber;
					
					
					
					
				} else {
					
					//请求学校地址
					this.getCampusListArea();
				}
				
			},
			//请求学校地址--校区
			async getCampusListArea() {

				
				let wxLoginUser = uni.getStorageSync('token') || '';
				
				let res = await uni.$http.get(uni.$url.getCampusListUrl, { wxLoginUser, level: 1, pid: 0 });
				
				if(res.data.code !== 0) return uni.showToast({title: res.data.msg, icon: 'none', duration: 2000});
				
				this.form.areaOptions = res.data.data.list;
			
				
				return res
				
			},
			//请求学校地址--宿舍楼
			async getCampusListLevel(obj) {
				
				let wxLoginUser = uni.getStorageSync('token') || '';
				
				let res = await uni.$http.get(uni.$url.getCampusListUrl, { wxLoginUser, level: 2, pid: obj.value });
				
				if(res.data.code !== 0) return uni.showToast({title: res.data.msg, icon: 'none', duration: 2000});
				
				this.form.levelOptions = res.data.data.list;
			
				//重新选择一级类目时重置二级三级类目
				this.form.address.level = {};
				
				this.form.address.plate = {};
				this.form.plateOptions = [];
				
				this.dormNumber = '';
			
				return res
				
			},
			//请求学校地址--宿舍门牌
			async getCampusListPlate(obj) {
				
				let wxLoginUser = uni.getStorageSync('token') || '';
				
				let res = await uni.$http.get(uni.$url.getCampusListUrl, { wxLoginUser, level: 3, pid: obj.value });
				
				if(res.data.code !== 0) return uni.showToast({title: res.data.msg, icon: 'none', duration: 2000});
				
				this.form.plateOptions = res.data.data.list;
				
				
				//重新选择一级类目时重置二级三级类目
				this.form.address.plate = {};
				
				this.dormNumber = '';
								
				return res
				
			},
			//请求快递公司
			async getShippingCompanyList() {
				
				let wxLoginUser = uni.getStorageSync('token') || '';
				
				let res = await uni.$http.get(uni.$url.getShippingCompanyListUrl, { wxLoginUser });
				
				if(res.data.code !== 0) return uni.showToast({title: res.data.msg, icon: 'none', duration: 2000});
				this.form.shippingCompanyName = res.data.data.list;
				
			},
			//请求送快递时间段
			async getShippingTimeList() {
				
				let wxLoginUser = uni.getStorageSync('token') || '';
				
				let res = await uni.$http.get(uni.$url.getShippingTimeListUrl, { wxLoginUser });
				
				if(res.data.code !== 0) return uni.showToast({title: res.data.msg, icon: 'none', duration: 2000});
				
				this.orderShippingTime = res.data.data.list;
				
			},
			//获取支付价钱
			async getUnityCost() {
				
				let wxLoginUser = uni.getStorageSync('token') || '';
				
				let res = await uni.$http.get(uni.$url.getUnityCostUrl, { wxLoginUser });
				
				if(res.data.code !== 0) return uni.showToast({title: res.data.msg, icon: 'none', duration: 2000});
				
				this.unityCost = res.data.data;
				
			},
			//增加包裹项
			addPackage() {
				
				let item = {
					expressCode: '',
					expressNumber: {
						firstNumber: '',
						secondNumber: '',
						thirdNumber: ''
					},
					expressCompanyName: '',
					shippingCompanyName: '',
				}
				
				
				this.packageList.push(item);
				
				
			},
			//删除包裹项
			deletePackage(index) {
				
				this.packageList.splice(index, 1)
				
			},
			// 提交表单
			async submitForm() {
				
				let wxLoginUser = uni.getStorageSync('token') || '';
				
				
				//姓名不能为空
				if(!this.receivedName || this.receivedName == '') return uni.showToast({title:'姓名不能为空!', icon: 'none', duration: 2000});
				
				if(!this.receivedPhone || this.receivedPhone == '') return uni.showToast({title:'手机号码不能为空!', icon: 'none', duration: 2000});
				//校验手机号码
				let regex = new RegExp(/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/);
				if (!regex.test(this.receivedPhone)) return uni.showToast({ title: '请填写正确的手机号码', icon: 'none', duration: 2000 });
				
				//请选择配送地址-校区...!
				if(!this.form.address.area || JSON.stringify(this.form.address.area) == '{}') return uni.showToast({title:'请选择配送地址-校区!', icon: 'none', duration: 2000});
				//请选择配送地址-宿舍区...!
				if(!this.form.address.level || JSON.stringify(this.form.address.level) == '{}') return uni.showToast({title:'请选择配送地址-宿舍区!', icon: 'none', duration: 2000});
				//请选择配送地址-宿舍楼...!
				if(!this.form.address.plate || JSON.stringify(this.form.address.plate) == '{}') return uni.showToast({title:'请选择配送地址-宿舍楼!', icon: 'none', duration: 2000});
				//请选择配送地址-宿舍号...!
				if(!this.dormNumber || this.dormNumber == '') return uni.showToast({title:'请选择配送地址-宿舍号!', icon: 'none', duration: 2000});
				
				this.form.receivedAddress = this.form.address.area.label + "-" + this.form.address.level.label + "-" + this.form.address.plate.label + "-" + this.dormNumber;
			
				
				
				//设置跳出循环结束执行
				let flag = true;
				
				for (let i = 0; i < this.packageList.length; i++) {
					
					let firstItem = this.packageList[i].expressNumber.firstNumber;
					let secondItem = this.packageList[i].expressNumber.secondNumber;
					let thirdItem = this.packageList[i].expressNumber.thirdNumber;
					
					if(!firstItem || firstItem == '' || firstItem.toString().length > 2) {						
						let title = '请填写完整第'+(i + 1) +'项包裹信息！第一位取件码不能为空，且不能少于1位多于2位';
						
						uni.showToast({ title: title, icon: 'none', duration: 2000 });
						
						//获取焦点
						this.$refs[`firstItem_${i}`][0].focus();
						
						flag = false;
						
						break
					}
					
					if(!secondItem || secondItem == '' || secondItem.toString().length > 2) {						
						let title = '请填写完整第'+(i + 1) +'项包裹信息！第二位取件码不能为空，且不能少于1位多于2位';
						
						uni.showToast({ title: title, icon: 'none', duration: 2000 });
						
						//获取焦点
						this.$refs[`secondItem_${i}`][0].focus();
						
						flag = false;
						
						break
					}
					
					if(!thirdItem || thirdItem == '' || thirdItem.toString().length !== 4) {						
						let title = '请填写完整第'+(i + 1) +'项包裹信息！第三位取件码不能为空，且只能为4位';
						
						uni.showToast({ title: title, icon: 'none', duration: 2000 });
						
						//获取焦点
						this.$refs[`thirdItem_${i}`][0].focus();
						
						flag = false;
						
						break
					}
					
					if(!this.packageList[i].expressCompanyName.label || this.packageList[i].expressCompanyName.label == '') {
						uni.showToast({title:`请选择第${(i + 1)}项包裹的快递公司！`, icon: 'none', duration: 2000});
	
						flag = false;
						
						break
						
					}
					
					
					this.packageList[i].expressCode = this.packageList[i].expressNumber.firstNumber + '-' + this.packageList[i].expressNumber.secondNumber + '-' + this.packageList[i].expressNumber.thirdNumber;
					
					this.packageList[i].shippingCompanyName = this.packageList[i].expressCompanyName.label;
					

					
				 }
				 
				 if(!flag) return;
				 

				 
				 
				 //请选择送件时段!
				 if(!this.form.orderShippingTime || this.form.orderShippingTime == '') return uni.showToast({title:'请选择送件时段!', icon: 'none', duration: 2000});
				
				let query = {
					wxLoginUser,
					receivedName: this.receivedName,
					receivedPhone: this.receivedPhone,
					receivedAddress: this.form.receivedAddress,
					orderDetailStr: JSON.stringify(this.packageList),
					orderShippingTime: this.form.orderShippingTime.label,
					remark: this.form.remark
				};
				
				
				let expressData = {
					receivedName: this.receivedName,
					receivedPhone: this.receivedPhone,
					// areaOptions: this.areaOptions,
					// levelOptions: this.levelOptions,
					// plateOptions: this.plateOptions,
					address: {
						area: 
						{	value: this.form.address.area.value,
							label: this.form.address.area.label,
						},
						level: 
						{	value: this.form.address.level.value,
							label: this.form.address.level.label,
						},
						plate: 
						{	value: this.form.address.plate.value,
							label: this.form.address.plate.label,
						}
					},
					dormNumber: this.dormNumber
				}
				
				uni.setStorageSync('expressData', expressData);

				
				// 询问用户是否退出登录
				const [err, succ] = await uni.showModal({
				  title: '提示',
				  content: '确认要提交吗？'
				}).catch(err => err)
				
				if (err || !succ || !succ.confirm) return;
				
				let res = await uni.$http.post(uni.$url.saveOrderUrl, query );
				
				if(res.data.code !== 0) return uni.showToast({title: res.data.msg, icon: 'none', duration: 2000});
				
				
				//会员免费  非会员付费
				if(res.data.data.type == "weixin") {
					this.weChatPayment(res.data.data.params);
				} else if (res.data.data.type == "free") {
					
					let orderNumber = res.data.data.orderNumber;
					uni.navigateTo({
						url: `/pages/index/detail?orderNumber=${orderNumber}`
					})
				}
				
				
				
			},
			//微信支付
			weChatPayment(data) {
		
				let that = this;
				this.onBridgeReady(data, function(res) {
		
					uni.showToast({
						title: '支付成功',
						icon: 'none',
						duration: 2000
					});
					
					let orderNumber = data.orderNumber;
					
					uni.navigateTo({
						url: `/pages/index/detail?orderNumber=${orderNumber}`
					})
		
				}, function(res) {
					uni.showToast({
						title: '支付失败',
						icon: 'none',
						duration: 2000
					});
				});
			},
			/* 微信支付调起函数 */
			onBridgeReady(param, successCallBack, failCallBack) {
				WeixinJSBridge.invoke( //自带的
					'getBrandWCPayRequest', {
						"appId": param.appId, //公众号名称，由商户传入
						"timeStamp": param.timeStamp, //时间戳，自1970年以来的秒数
						"nonceStr": param.nonceStr, //随机串
						"package": param.package,
						"signType": param.signType, //微信签名方式：
						"paySign": param.paySign //微信签名
					},
					function(res) {
						// alert(res);
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							// 使用以上方式判断前端返回,微信团队郑重提示：
							//res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
							if (typeof successCallBack == "function") {
								successCallBack(res);
							}
						} else {
							if (typeof failCallBack == "function") {
								failCallBack(res);
							}
						}
					}
				);
			},
	
		}
	}
</script>

<style lang="scss">
	
	.content {
		padding: 44px 0;
	}
	
	.form {
		padding: 20rpx;
	}
	
	.form-label {
		margin-bottom: 20rpx;
	}
	
	.select-item {
		margin-bottom: 20rpx;
		width: 100%;
	}
	
	.pick-up {
		.first-item {
			width: 25%;
		}
		.second-item {
			width: 25%;
		}
		.third-item {
			width: 40%;
		}
		.text {
			display: inline-block;
			width: 5%;
			text-align: center;
		}
	}
	
	.package-info {
		position: relative;
		padding: 25rpx;
		margin-bottom: 25rpx;
		.delete {
			position: absolute;
			top: 0;
			left: 0;
		}
	}
	
	.add-package {
		display: flex;
		height: 100rpx;
		justify-content: center;
		align-items: center;
	}
	
	.submit-wrap {		
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 44px;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0;
		background: #ffffff;
		.btn-submit {
			width: 45%;
		}
	}
	
	.tips {
		margin-bottom: 20rpx;
		font-size: 24rpx;
		color: #555555;
		.sign {
			margin-right: 10rpx;
			color: #DD524D;
		}
		.price {
			color: #DD524D;
		}
	}
		
</style>
