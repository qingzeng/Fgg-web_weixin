/*
 *用户登录
 *loginServices
 */
"use strict";
define(['handler'], function(handler) {
    var searchServices = angular.module('searchServices', []);

    searchServices.factory('searchServices',
        function($http, $q, $timeout) {
            var rootUrl = handler.rootUrl;
            /*
             *用户登录
             *param{name 帐号名 ,password  密码,openid 微信用户id}
             */
            var search = function(from) {

                var params = {
                    cityName:from.cityName,
                    residentialAreaName: from.residentialAreaName,
                    keHuId: from.keHuId
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/getResidentialAreaByName'
                });
            };


            return {
                search: function(from) {
                    return search(from);
                }
            }
        })
})