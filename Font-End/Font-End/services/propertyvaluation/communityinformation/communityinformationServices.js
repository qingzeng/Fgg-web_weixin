/*
 *用户登录
 *loginServices
 */
"use strict";
define(['handler'], function(handler) {
    var communityinformationServices = angular.module('communityinformationServices', []);

    communityinformationServices.factory('communityinformationServices',
        function($http, $q, $timeout) {
            var rootUrl = handler.rootUrl;

            var getResidentialAreaDetai = function(from) {

                var params = {
                    cityName: from.cityName,
                    residentialAreaID: from.residentialAreaID,
                    keHuId: from.keHuId
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/getResidentialAreaDetail'
                });
            };
            var getResidentialAreaAroundInfo = function(from) {

                var params = {
                    cityName: from.cityName,
                    residentialAreaID: from.residentialAreaID,
                    keHuId: from.keHuId
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/getResidentialAreaAroundInfo'
                });
            };
            var getresidentialAreaCount = function(from) {

                var params = {
                    cityName: from.cityName,
                    residentialAreaID: from.residentialAreaID

                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/getresidentialAreaCount'
                });
            };
            var updataResidentialAreaCount = function(id) {

                var params = {
                    id: id
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/updataResidentialAreaCount'
                });
            };
            return {
                getResidentialAreaDetai: function(from) {
                    return getResidentialAreaDetai(from);
                },
                getResidentialAreaAroundInfo: function(from) {
                    return getResidentialAreaAroundInfo(from);
                },
                getresidentialAreaCount: function(from) {
                    return getresidentialAreaCount(from);
                },
                updataResidentialAreaCount: function(id) {
                    return updataResidentialAreaCount(id);
                }

            }
        })
})