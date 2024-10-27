'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
var react_native_1 = require('react-native');
var RNOtpVerify = react_native_1.NativeModules.RNOtpVerify;
var OtpVerify = {
  getOtp:
    RNOtpVerify === null || RNOtpVerify === void 0
      ? void 0
      : RNOtpVerify.getOtp,
  getHash:
    RNOtpVerify === null || RNOtpVerify === void 0
      ? void 0
      : RNOtpVerify.getHash,
  addListener: function (handler) {
    return react_native_1.DeviceEventEmitter.addListener(
      'com.kailas.otpVerify:otpReceived',
      handler,
    );
  },
  removeListener: function () {
    return react_native_1.DeviceEventEmitter.removeAllListeners(
      'com.kailas.otpVerify:otpReceived',
    );
  },
};
exports.default = OtpVerify;
