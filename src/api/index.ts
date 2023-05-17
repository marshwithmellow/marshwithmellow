import axios from '../utils/request'

export const doRegisterCode = (data: { phone: string }) => axios({ url: `/user/doRegisterCode`, method: 'post', data })
// 检查手机号是否注册过
export const checkPhone = (data: { phone: string }) => axios({ url: `/user/checkPhone`, method: 'post', data })
// 根据手机号验证码注册
export const registerAccount = (data: { code: string; name: string; phone: string, inviteCode?: string }) => axios({ url: `/user/registerAccount`, method: 'post', data })
// 登陆验证码
export const doSendCode = (data: { phone: string }) => axios({ url: `/user/doSendCode`, method: 'post', data })
// 登陆接口
export const doLoginApi = (data: { code: string, inviteCode?: string, phone: string }) => axios({ url: `/user/doLogin`, method: 'post', data })
// 充值
export const wechatPay = (data: { payAmount: number; osType: number; accessKey: number }) => axios({ url: `/wechatPay`, method: 'post', data })
// 订单详情
export const orderDetail = (data: { orderNo: string; accessKey: string }) => axios({ url: `/orderDetail?orderNo=${data.orderNo}&accessKey=${data.accessKey}`, method: 'get' })

