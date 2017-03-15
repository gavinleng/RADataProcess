/*
 * Created by G on 22/09/2016.
 */


"use strict";

module.exports = exports = function (vArray) {
	var half = Math.floor(vArray.length / 2);
	
	if(vArray.length % 2) {
		return +vArray[half];
	} else {
		return +(vArray[half - 1] + vArray[half]) / 2.0;
	}
};
