sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zprojectteste1107.controller.Detail", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this); 
                //패턴이 맞다면 onPatternMatched function 실행 -> this에 붙이기
            },
            _onPatternMatched: function(oEvent){
                var oArgu = oEvent.getParameter("arguments");
                // oEvent.getParameters().arguments;
                console.log(oArgu);
                // debugger;
            },
            onNavButtonPress: function(){
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteMain",{},true);
                // navTo(1,2,3)s
                //  1: Route Name
                //  2: Parameters
                //  3: Route History Clear
            }
        });
    });
