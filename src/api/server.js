
let base = 'https://nccloud.weihong.com.cn/ncmes';
var baseUrl2 = "https://nccloud.weihong.com.cn/api/device/";
import post from './post.js';
import get from './get.js';

export const userLogin = param => {
  return post(`${base}/web/login`,param)   
}
 
export const vercode = param => {
  return get(`${base}/vercode/${param.phone}?=${param.num}`)
}
//消息报警
export const htrMsg = param => {
    return get(`${baseUrl2}/device/focusmachine/fivealarm?username=${param.username}&token=${param.token}`)
}
//去获取关注设备，并以磁铁形式展示

export const getFocusMachine = param => {
    return get(`${base}/focusmachinelist?username=${param.username}&openid=${param.openid}&token=${param.token}`)
}
