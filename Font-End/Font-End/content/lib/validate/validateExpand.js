/*
 *jquery.validate.min.js验证扩展
 * author 徐铮
 * by 2015-12-8
*/
// 联系电话(手机/固定电话皆可)验证   
jQuery.validator.addMethod("isTel", function (value, element) {
    var length = value.length;
    var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var tel = /^(\d{3,4}-?)?\d{7,9}$/g;
    return this.optional(element) || tel.test(value) || (length == 11 && mobile.test(value));
}, "请正确填写您的联系方式");

// 匹配密码，以字母开头，长度在6-12之间，只能包含字符、数字和下划线。      
jQuery.validator.addMethod("isPwd", function (value, element) {
    return this.optional(element) || /^[a-zA-Z]\\w{6,20}$/.test(value);
}, "以字母开头，长度在6-20之间，只能包含字符、数字和下划线。");

// 字符验证，只能包含中文、英文、数字、下划线等字符。    
jQuery.validator.addMethod("stringCheck", function (value, element) {
    return this.optional(element) || /^[a-zA-Z0-9\u4e00-\u9fa5-_+]+$/.test(value);
}, "只能包含中文、英文、数字、下划线等字符");

// 匹配汉字 
jQuery.validator.addMethod("isChinese", function (value, element) {
    return this.optional(element) || /^[\u4e00-\u9fa5]+$/.test(value);
}, "匹配汉字");

// 手机号码验证    
jQuery.validator.addMethod("isMobile", function (value, element) {
    var length = value.length;
    return this.optional(element) || (length == 11 && /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(value));
}, "请正确填写您的手机号码。");

// 只能输入[0-9]数字
jQuery.validator.addMethod("isDigits", function (value, element) {
    return this.optional(element) || /^\d+$/.test(value);
}, "只能输入0-9数字");

// 只能输入1-9正整数
jQuery.validator.addMethod("posint", function (value, element) {
    return this.optional(element) || /^[1-9]\d*$/.test(value);
}, "只能输入1-9正整数");

// 保留至多两位小数
jQuery.validator.addMethod("posintdec", function (value, element) {
    return this.optional(element) || /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/.test(value);
}, "保留至多两位小数");

// 保留至多5位小数
jQuery.validator.addMethod("posintdec3", function (value, element) {
    return this.optional(element) || /^[0-9]+\.{0,1}[0-9]{0,5}$/.test(value);
}, "保留至多两位小数");
