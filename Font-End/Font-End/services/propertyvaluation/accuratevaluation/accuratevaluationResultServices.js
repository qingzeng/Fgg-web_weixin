/*
 *用户登录
 *loginServices
 */
"use strict";
define(['handler'], function(handler) {
    var accuratevaluationResultServices = angular.module('accuratevaluationResultServices', []);

    accuratevaluationResultServices.factory('accuratevaluationResultServices',
        function($http, $q, $timeout) {
            var rootUrl = handler.rootUrl;

            var feekback = function(from) {

                var params = {
                    cityName: from.cityName,
                    xunjiaID: from.xunjiaID,
                    price: from.price,
                    totalprice: from.totalprice,
                    keHuId: from.kehuId
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/feekback'
                });
            };
            var getAroundResidentialAreaInfo = function(from) {

                var params = {
                    cityName: from.cityName,
                    residentialAreaID: from.residentialAreaID,
                    radius: from.radius
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/getAroundResidentialAreaInfo'
                });
            };
            var getCaseInfo = function(from) {

                var params = {
                    cityName: from.cityName,
                    residentialAreaName: from.residentialAreaName,
                    residentialAreaID: from.residentialAreaID,
                    timespan: from.timespan,
                    caseType: from.caseType,
                    pageSize: from.pageSize,
                    pageIndex: from.pageIndex
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/getCaseInfo'
                });
            };
            var getPriceTrendPic = function(from) {

                var params = {
                    cityName: from.cityName,
                    residentialAreaID: from.residentialAreaID
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/getAroundResidentialAreaTrendPic'
                });

            }
            return {
                feekback: function(from) {
                    return feekback(from);
                },
                getAroundResidentialAreaInfo: function(from) {
                    return getAroundResidentialAreaInfo(from);
                },
                getCaseInfo: function(from) {
                    return getCaseInfo(from);
                },
                getPriceTrendPic: function(from) {
                    return getPriceTrendPic(from);
                }
            }
        })
})