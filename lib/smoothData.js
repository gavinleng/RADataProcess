/*
 * Created by G on 22/09/2016.
 */


"use strict";

var kernel = require("kernel-smooth");

module.exports = exports = function (vArray) {
	//get max value and add 10% to make graph cleaner
	var max_x = +vArray[vArray.length - 1] - (+vArray[0]);
	
	var step = +(max_x / 9);
	
	//create x_arr
	var x_arr = [];
	for(var i = Math.floor(vArray[0]) - 1; i <= Math.ceil(vArray[vArray.length - 1]) + step + 1; i += step){
		x_arr.push(i);
	}
	
	var bandwidth = Math.abs(max_x) / 5;
	
	var kde = kernel.density(vArray, kernel.fun.epanechnikov, bandwidth);
	
	return [x_arr, kde(x_arr)];
};
