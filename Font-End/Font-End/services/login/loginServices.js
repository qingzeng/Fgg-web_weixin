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

            var getkeHuId = function(openid){
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

            return {
                login: function(from) {
                    return login(from);
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
                }
            }
        })
})