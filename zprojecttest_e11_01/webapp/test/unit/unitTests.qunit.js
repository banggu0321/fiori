/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"zprojecttest_e11_01/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
