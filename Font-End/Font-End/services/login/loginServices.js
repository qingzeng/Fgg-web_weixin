/*
 *用户登录
 *loginServices
 */
"use strict";
define(['handler'], function(handler) {
    var loginServices = angular.module('loginServices', []);

    loginServices.factory('loginServices',
        function($http, $q, $timeout) {
            var rootUrl = handler.rootUrl;
            /*
             *用户登录
             *param{name 帐号名 ,password  密码,openid 微信用户id}
             */
            var login = function(from) {

                var params = {
                    userName: from.userName,
                    password: from.password,
                    openid: from.openid
                }
                return $http({
                    method: 'POST',
                    params: params,
                    url: rootUrl + '/webservice/bindUser'
                });
            };

            /*
             *获取用户信息
             *param{kehuId 用户ID}
             */
            var getUser = function(from) {
                var params = {
                    keHuId: from.keHuId
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/getUser'
                });
            };
            /*
             *获取验证码
             *param{phone 手机号码}
             */
            var getverificationcode = function(from) {
                var params = {
                    phone: from.phone
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/getverificationCode'
                });
            };
            /*
             *提交个人信息
             *param{name 帐号名 ,password  密码,openid 微信用户id}
             */
            var saveUserMessage = function(from) {
                var params = {
                    id: from.keHuId,
                    reslName:from.reslName,
                    phone: from.phone,
                    identifying: from.identifying,
                    gender: from.gender,
                    woke: from.woke,
                    organ: from.organ,
                    city: from.city,
                    district: from.district,
                    address: from.address
                }
                return $http({
                    method: 'POST',
                    params: params,
                    url: rootUrl + '/webservice/saveUserMessage'
                });
            };

            /*
             *获取城市列表
             *param{openid openid}
             */
            var getkeHuId = function(openid) {
                var params = {
                    openid: openid
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/getUserByOpenid'
                });
            };

            /*
             *获取城市列表
             *param{kehuId 用户ID}
             */
            var getCities = function(from) {

                var params = {
                    keHuId: from.keHuId
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/getCities'
                });
            };

            /*
             *提交绑定城市
             *param{kehuId 微信用户id}
             */
            var bindCity = function(from) {

                var params = {
                    cityId: from.cityId,
                    keHuId: from.keHuId
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/bindCity'
                });
            };

            /*
             *获取绑定城市
             *param{kehuId 微信用户id}
             */
            var getbindCity = function(from) {

                var params = {
                    keHuId: from.keHuId
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/findBindCity'
                });
            };

            /*
             *获取整个城市列表
             *param{}
             */
            var getallCities = function(from) {

                var params = {}
                return $http({
                    method: 'get',
                    params: params,
                    url: rootUrl + '/webservice/getCitySystem'
                });
            };

            /*
             *获取整个城市行政区
             *param{}
             */
            var getcityarea = function(from) {

                var params = {
                    parentid: from.parentid
                }
                return $http({
                    method: 'get',
                    params: params,
                    url: rootUrl + '/webservice/getCitySystem'
                });
            };

            return {
                login: function(from) {
                    return login(from);
                },
                getUser: function(from) {
                    return getUser(from);
                },
                getkeHuId: function(from) {
                    return getkeHuId(from);
                },
                getCities: function(from) {
                    return getCities(from);
                },
                bindCity: function(from) {
                    return bindCity(from);
                },
                getbindCity: function(from) {
                    return getbindCity(from);
                },
                getallCities: function(from) {
                    return getallCities(from);
                },
                getcityarea: function(from) {
                    return getcityarea(from);
                },
                getverificationcode: function(from) {
                    return getverificationcode(from);
                },
                saveUserMessage: function(from) {
                    return saveUserMessage(from);
                }
            }
        })
})
