/*
 *查询报告进度
 *progressreportServices
 */
"use strict";
define(['handler'], function(handler) {
    var progressreportServices = angular.module('progressreportServices', []);
    progressreportServices.factory('progressreportServices',
        function($http, $q, $timeout) {
            var rootUrl = handler.rootUrl;

            /*
             *获取合作机构
             *param{}
            */
            var getEstimateCompanyByKeHuId = function(keHuId) {
                var params = {
                  keHuId:keHuId
                }
                return $http({
                    method: 'GET',
                    url: rootUrl + '/webservice/getAllEstimateCompany'
                });
            };

            /*
             *获取评估列表
             *param{}
            */
            var getCommissionedEvaluationByType = function(keHuId,itype,cityName) {

                var params = {
                  keHuId:keHuId,
                  type:itype,
                  cityName:cityName,
                  pageIndex:1,
                  pageSize:15,
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/FindByTypeCommissionedEvaluation'
                });
            };

            /*
             *查询报告进度
             *param{}
            */
            var findcommissionedEvaluation = function(keHuId,cityName,reportNum) {
                var params = {
                  keHuId:keHuId,
                  reportNum:reportNum,
                  city:cityName
                }
                return $http({
                    method: 'GET',
                    params: params,
                    url: rootUrl + '/webservice/findcommissionedEvaluation'
                });
            };
            return {
                getEstimateCompanyByKeHuId : function(keHuId) {
                    return getEstimateCompanyByKeHuId(keHuId);
                },
                getCommissionedEvaluationByType : function(keHuId,itype,cityName) {
                    return getCommissionedEvaluationByType(keHuId,itype,cityName);
                },
                findcommissionedEvaluation : function(keHuId,cityName,reportNum) {
                    return findcommissionedEvaluation(keHuId,cityName,reportNum);
                }
            }

        })
})
