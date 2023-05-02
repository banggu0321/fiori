sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zprojectodatae1104.controller.Detail", {
            onInit: function () {
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this); 
                //패턴이 맞다면 onPatternMatched function 실행 -> this에 붙이기
            },
            _onPatternMatched: function(oEvent){
                var oArge = oEvent.getParameter("arguments");
                // oEvent.getParameters().arguments;
                var oModel = this.getView().getModel(); //Northwind Odata Model
                // console.log(oArge);
                var oFilter = sap.ui.model.Filter('OrderID','EQ', oArge.key);

                oModel.read("/Orders",{
                    Filters: [oFilter],
                    success: function(oReturn){
                        // debugger;
                        console.log(oReturn.results[0]);
                    }
                });
                console.log("pattern mathed function");
                // debugger;
            },
            onNavButtonPress: function(){
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteMain",{}, true);
            }
        });
    });
