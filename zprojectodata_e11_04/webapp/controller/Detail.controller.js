sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("zprojectodatae1104.controller.Detail", {
            onInit: function () {
                // let aDetail = {
                //     Customer : {},
                //     Employee: {}
                // };
                this.getView().setModel(new JSONModel(),'DetailModel')

                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this); 
                //패턴이 맞다면 onPatternMatched function 실행 -> this에 붙이기
            },
            _onPatternMatched: function(oEvent){
                var oView = this.getView();
                var oArgu = oEvent.getParameter("arguments"); //{key : 20468}
                // oEvent.getParameters().arguments;
                // console.log(oArge);
                
                var oModel = oView.getModel(); //Northwind Odata Model
                var oDetailModel = oView.getModel("DetailModel");
                var oFilter = new sap.ui.model.Filter('OrderID','EQ', oArgu.key);

                oView.setBusy(true);
                //GET: /iwfn/gw_client
                //.../northwind.svc/Orders?$filter=OrderID eq 10248
                //.../northwind.svc/Orders?$expand=Customer
                oModel.read("/Orders",{
                    urlParameters:{
                        '$expand' : 'Customer, Employee'
                    },
                    filters: [oFilter],
                    success: function(oReturn){
                        oView.setBusy(false);
                        console.log(oReturn.results[0]);

                        // var oData = oDetailModel.getData();
                        // var oEmployeeData = oDetailModel.getData().Employee;

                        //{data : {OrderID :10428, CustomID :'', Customers...}}
                        oDetailModel.setProperty("/data", oReturn.results[0]);

                        // oDetailModel.setProperty("/Customer/CustomerID",oReturn.results[0].Customer.CustomerID);
                        // oDetailModel.setProperty("/Customer/CompanyName",oReturn.results[0].Customer.CompanyName);
                        // oDetailModel.setProperty("/Customer/Phone",oReturn.results[0].Customer.Phone);
                        // oDetailModel.setProperty("/Employee/LastName",oReturn.results[0].Customer.LastName);
                        // oDetailModel.setProperty("/Employee/FirstName",oReturn.results[0].Customer.FirstName);
                        // oModel.setProperty("/Employee",oReturn.results[0].Employee);
                        
                        // debugger;
                        // oDetailModel.setProperty("/result",aList);


                    },
                    error: function(){
                        oView.setBusy(false);
                        sap.m.MessageToast('에러발생');
                    }
                });
                // console.log("pattern mathed function");
                // debugger;
            },
            onNavButtonPress: function(){
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("RouteMain",{}, true);
            }
        });
    });
