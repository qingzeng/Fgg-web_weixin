/*
 *估价记录
 *valuationrecordServices
 */
"use strict";
define(['handler'], function(handler) {
    var valuationrecordServices = angular.module('valuationrecordServices', []);

    valuationrecordServices.factory('valuationrecordServices',
        function($http, $q, $timeout) {
            var rootUrl = handler.rootUrl;
            /*
             *估价记录列表
             *param{cityName 城市名称,keHuId  用户唯一标识}
             */
            var recordlist = function(from) {
                var params = {
                    cityName: from.cityName,
                    keHuId: from.keHuId,
                    page:from.page,
                    pageSize:from.pageSize
                };
                return $http({
                    method: 'get',
                    params: params,
                    url: rootUrl + '/webservice/findAllAccurateValuation'
                });
            };
            
            /*
             *估价记录详情
             *param{keHuId 用户唯一标识,cityName 城市名称,AccurateValuationId 估价记录ID}
             */
            var recorddetails = function(from) {
                var params = {
                    jiLuId:from.jiLuId
                };
                return $http({
                    method: 'get',
                    params: params,
                    url: rootUrl + '/webservice/findAccurateValuation'
                });
            };
            return {
                recordlist: function(from) {
                    return recordlist(from);
                },
                recorddetails: function(from) {
                    return recorddetails(from);
                }
            }
        })
})