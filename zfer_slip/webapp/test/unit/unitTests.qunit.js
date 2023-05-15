/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"ER/zfer_slip/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
