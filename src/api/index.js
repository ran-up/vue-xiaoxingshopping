// 对api进行统一管理
import requests from "./axios";
import mockRequests from "./mockAxios";

// /api/product/getBaseCategoryList get 无参数 
// 多级菜单数据
export const reqCategoryList = () => requests.get('/product/getBaseCategoryList')
// 轮播图数据
export const reqBannerList = () => mockRequests.get('/banner')
// 家用电器处的轮播图数据
export const reqFloorList = () => mockRequests.get('/floor')
// 搜索数据
export const reqGetSearchInfo = (data) => requests({ method: 'post', url: '/list', data })
// 详情页detail的数据 /api/item/{ skuId }
export const reqGetGoodsInfo = (skuId) => requests({ url: `/item/${skuId}`, method: 'get' })
// 提交数据到【购物车】界面或修改购物车界面的数据  /api/cart/addToCart/{ skuId }/{ skuNum }
export const reqAddOrUpdateShopCart = (skuId, skuNum) => requests({ method: 'post', url: `/cart/addToCart/${skuId}/${skuNum}` })
// 获取购物车数据 /api/cart/cartList
export const reqShopCartInfo = () => requests({ method: 'get', url: 'cart/cartList' })
// 删除购物车中的数据 /api/cart/deleteCart/{skuId}
export const reqDeleteShopCart = (skuId) => requests({ method: 'delete', url: `/cart/deleteCart/${skuId}` })
// 切换商品选中状态 /api/cart/checkCart/{skuID}/{isChecked}
export const reqIsCheckeds = (skuID, isChecked) => requests({ method: 'get', url: `/cart/checkCart/${skuID}/${isChecked}` })
// 获取验证码 /api/user/passport/sendCode/{phone}
export const reqGetCode = (phone) => requests({ method: 'get', url: `/user/passport/sendCode/${phone}` })
// 用户注册 /api/user/passport/register
export const userRegisterInfo = (data) => requests({ method: 'post', url: '/user/passport/register', data })
// 用户登录 /api/user/passport/login
export const reqUserLogin = (data) => requests({ method: 'post', url: '/user/passport/login', data })
// 获取登录信息 /api/user/passport/auth/getUserInfo
export const reqUserInfo = () => requests({ url: `/user/passport/auth/getUserInfo`, method: 'get' })
// 退出登录 /api/user/passport/logout
export const reqOutLogin = () => requests({ url: `/user/passport/logout`, method: 'get' })
// 获取用户地址信息 /api/user/userAddress/auth/findUserAddressList
export const findUserAddressList = () => requests({ url: `/user/userAddress/auth/findUserAddressList`, method: 'get' })
//获取订单交易页信息
export const reqShopInfo = () => requests({ url: `/order/auth/trade`, method: 'get' });
// 提交用户订单 /api/order/auth/submitOrder?tradeNo={tradeNo}
export const reqSubmitOrder = (tradeNo, data) => requests({ url: `/order/auth/submitOrder?tradeNo=${tradeNo}`, data, method: 'post' })
// 获取支付信息 /api/payment/weixin/createNative/{orderId}
export const reqPayInfo = (orderId) => requests({ url: `/payment/weixin/createNative/${orderId}`, method: 'get' });
// 支付结果查询 /api/payment/weixin/queryPayStatus/{orderId}
export const reqPayResult = (orderId) => requests({ url: `/payment/weixin/queryPayStatus/${orderId}`, method: 'get' });
// 获取我的订单列表 /api/order/auth/{page}/{limit}
export const reqMyOrderList = (page, limit) => requests({ url: `/order/auth/${page}/${limit}`, method: 'get' });