
//API地址
// let BASE_URL = 'http://lucky.winzkj.com';
let BASE_URL = 'http://pt.winzkj.com/m';
// let BASE_URL = 'http://192.168.0.178:8080/m';

//前端地址
// let FRONTEND_URL = 'http://192.168.0.140:8080';
// let FRONTEND_URL = 'http://frps.winzkj.com';
let FRONTEND_URL = 'http://ptweb.winzkj.com';

let API_URL = {
	baseUrl: BASE_URL,
	//前端地址
	frontEndUrl: FRONTEND_URL,
	//微信登录地址
	wxLoginUrl: BASE_URL + '/api/login',
	//获取学校地址
	getCampusListUrl: BASE_URL + '/api/getCampusList',
	//获取快递公司选项
	getShippingCompanyListUrl: BASE_URL + '/api/getShippingCompanyList',
	//获取送快递时间段
	getShippingTimeListUrl: BASE_URL + '/api/getShippingTimeList',
	//获取订单详情
	getOrderDetailUrl: BASE_URL + '/api/getOrderDetail',
	//查询订单列表
	getOrderListUrl: BASE_URL + '/api/getOrderList',
	//立即支付
	saveOrderUrl: BASE_URL + '/api/saveOrder',
	//获取支付价钱
	getUnityCostUrl: BASE_URL + '/api/getUnityCost',
	
}


export {
	API_URL
};
