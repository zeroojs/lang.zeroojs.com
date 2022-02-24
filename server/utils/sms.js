/*
 * @Descripttion: 腾讯云发送短信
 * @version: 0.0.0
 * @Author: Minyoung
 * @Date: 2022-02-22 22:27:36
 * @LastEditors: Minyoung
 * @LastEditTime: 2022-02-23 21:22:33
 * 案例：https://cloud.tencent.com/document/product/382/43197#example
 */
const tencentcloud = require('tencentcloud-sdk-nodejs')
const { tencent } = require('../config')
const { SECRET_ID, SECRET_KEY, SMS_SDK_APP_ID, SIGN_NAME, TEMPLATE_ID } = tencent
// 导入对应产品模块的client models。
const smsClient = tencentcloud.sms.v20210111.Client

/* 实例化要请求产品(以sms为例)的client对象 */
const client = new smsClient({
  credential: {
  /* 必填：腾讯云账户密钥对secretId，secretKey。
   * 这里采用的是从环境变量读取的方式，需要在环境变量中先设置这两个值。
   * 你也可以直接在代码中写死密钥对，但是小心不要将代码复制、上传或者分享给他人，
   * 以免泄露密钥对危及你的财产安全。
   * SecretId、SecretKey 查询: https://console.cloud.tencent.com/cam/capi */
    secretId: SECRET_ID,
    secretKey: SECRET_KEY,
  },
  /* 必填：地域信息，可以直接填写字符串ap-guangzhou，支持的地域列表参考 https://cloud.tencent.com/document/api/382/52071#.E5.9C.B0.E5.9F.9F.E5.88.97.E8.A1.A8 */
  region: 'ap-guangzhou',
  /* 非必填:
   * 客户端配置对象，可以指定超时时间等配置 */
  profile: {
    /* SDK默认用TC3-HMAC-SHA256进行签名，非必要请不要修改这个字段 */
    signMethod: 'HmacSHA256',
    httpProfile: {
      /* SDK默认使用POST方法。
       * 如果你一定要使用GET方法，可以在这里设置。GET方法无法处理一些较大的请求 */
      reqMethod: 'POST',
      /* SDK有默认的超时时间，非必要请不要进行调整
       * 如有需要请在代码中查阅以获取最新的默认值 */
      reqTimeout: 30,
      /**
       * 指定接入地域域名，默认就近地域接入域名为 sms.tencentcloudapi.com ，也支持指定地域域名访问，例如广州地域的域名为 sms.ap-guangzhou.tencentcloudapi.com
       */
      endpoint: 'sms.tencentcloudapi.com'
    },
  },
})

function sendSms(phoneNumber, code, timeout) {
  const params = {
    SmsSdkAppId: SMS_SDK_APP_ID,
    SignName: SIGN_NAME,
    TemplateId: TEMPLATE_ID,
    TemplateParamSet: [code, timeout],
    PhoneNumberSet: [`+86${phoneNumber}`]
  }
  return new Promise((resolve) => {
    // 通过client对象调用想要访问的接口，需要传入请求对象以及响应回调函数
    client.SendSms(params, function (err, response) {
      // 请求异常返回，打印异常信息
      if (err) {
        console.log(err, err)
        resolve({ sendCode: -1, message: err })
        return
      }
      // 请求正常返回，打印response对象
      // console.log(response)
      const { SendStatusSet: [{ SerialNo }] } = response
      const result = {
        ...response,
        sendCode: !SerialNo ? -1 : 0
      }
      resolve(result)
    })
  })
}

exports.sendSms = sendSms
exports.client = client

// Test
// sendSms('17772430935', '666', 2)
//   .then(res => {
//     console.log(res)
//   })

// Response
// {
//   SendStatusSet: [
//     {
//       SerialNo: '2645:347906444716455447150203093',
//       PhoneNumber: '+8617772430935',
//       Fee: 1,
//       SessionContext: '',
//       Code: 'Ok',
//       Message: 'send success',
//       IsoCode: 'CN'
//     }
//   ],
//   RequestId: 'c3db958f-f0fe-43bc-8710-dcad52f9462c'
// }