/*
 * Created by G on 22/09/2016.
 */


"use strict";

var median = require('./median');
var smoothData = require("./smoothData");

module.exports = exports = function (objArray, groupClass) {
	var smoothV, smoothVp;
	var obj = {};
	
	var vArr = objArray.map(function(obj){return +obj.value}).sort(function(a, b){return a-b});
	var vpArr = objArray.map(function(obj){return +obj.value_pp}).sort(function(a, b){return a-b});
	
	var medianV = median(vArr);
	var medianVp = median(vpArr);
	
	medianV = +medianV.toFixed(2);
	medianVp = +medianVp.toFixed(2);
	
	if ((vArr[0] == 0) && (vArr[vArr.length - 1] == 0)) {
		smoothV = [[], []];
	} else {
		smoothV = smoothData(vArr);
	}
	
	if ((vpArr[0] == 0) && (vpArr[vArr.length - 1] == 0)) {
		smoothVp = [[], []];
	} else {
		smoothVp = smoothData(vpArr);
	}
	
	obj.Line = objArray[0].Line;
	obj.Expenditure = objArray[0].Expenditure;
	obj.Period = objArray[0].Period;
	obj.Parent_Line = objArray[0].Parent_Line;
	obj.Parent_Expenditure = objArray[0].Parent_Expenditure;
	
	obj.value_array = vArr;
	obj.value_pp_array = vpArr;
	obj.value_median = medianV;
	obj.value_pp_median = medianVp;
	obj.value_distribution = smoothV;
	obj.value_pp_distribution = smoothVp;
	
	obj.class = groupClass;
	
	return obj;
};
