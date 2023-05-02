sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zprojectodatae1104.controller.Main", {
            onInit: function () {

            },
            onselectionChange: function(){
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteDetail");
            }
        });
    });
