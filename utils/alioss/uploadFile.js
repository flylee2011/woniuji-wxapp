/**
 * 上传文件到阿里 oss
 */
// 加密相关类库
require('../crypto/hmac.js');
require('../crypto/sha1.js');
var Base64 = require('../crypto/base64.js');
var Crypto = require('../crypto/crypto.js');
// 全局参数
var globalVars = require('../globalVars.js');

// 阿里云签名算法
var getPolicyBase64 = function () {
  // 设置失效时间，2小时
  var date = new Date();
  date.setHours(date.getHours() + 2);
  var expirationTime = date.toISOString();
  var policyText = {
    // 设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了，格式("2020-01-01T12:00:00.000Z")。
    "expiration": expirationTime,
    // 设置上传文件的大小限制
    "conditions": [
      ["content-length-range", 0, globalVars.aliyun.maxSize]
    ]
  };
  var policyBase64 = Base64.encode(JSON.stringify(policyText));

  return policyBase64;
}
var getSignature = function (policyBase64) {
  var accessKey = globalVars.aliyun.accessKey;
  var bytes = Crypto.HMAC(Crypto.SHA1, policyBase64, accessKey, {
    asBytes: true
  });
  var signature = Crypto.util.bytesToBase64(bytes);

  return signature;
}
// 补0方法
var fixZero = function(num) {
  var fixNum = parseInt(num, 10);
  if (fixNum < 10) {
    fixNum = '0' + fixNum;
  }
  return fixNum;
}

// 上传文件
var uploadFile = function (options) {
  var date = new Date();
  // 参数
  var uploadOpt = {
    // 临时文件
    filePath: options.filePath,
    // 存储目录
    fileDir: date.getFullYear() + '' + fixZero(date.getMonth() + 1) + '' + fixZero(date.getDate()) + '/',
    // 回调
    callback: options.callback
  };
  if(globalVars.debug) {
    uploadOpt.fileDir = 'test/' + uploadOpt.fileDir;
  }

  if (!uploadOpt.filePath) {
    // 模态弹框
    wx.showModal({
      title: '文件错误',
      content: '请重试',
      showCancel: false,
    })
    return;
  }
  // 计算各种签名参数
  var aliyunFileKey = uploadOpt.fileDir + uploadOpt.filePath.replace('wxfile://tmp_', '');
  var aliyunServerURL = globalVars.aliyun.ossDomain;
  var accessid = globalVars.aliyun.accessId;
  var policyBase64 = getPolicyBase64();
  var signature = getSignature(policyBase64);

  // 调用微信上传文件 api
  wx.uploadFile({
    url: aliyunServerURL,
    filePath: uploadOpt.filePath,
    name: 'file',
    formData: {
      'key': aliyunFileKey,
      'OSSAccessKeyId': accessid,
      'policy': policyBase64,
      'Signature': signature,
      'success_action_status': '200',
    },
    success: function (res) {
      if (res.statusCode != 200 && uploadOpt.callback) {
        uploadOpt.callback({
          code: 501,
          data: res,
          message: 'oss upload error'
        });
        return;
      }

      if(uploadOpt.callback) {
        uploadOpt.callback({
          code: 200,
          data: aliyunFileKey,
          message: 'success'
        });
      }
    },
    fail: function (err) {
      if (uploadOpt.callback) {
        uploadOpt.callback({
          code: 502,
          data: err,
          message: 'wx uploadFile error'
        });
      }
    }
  });
}

module.exports = uploadFile;