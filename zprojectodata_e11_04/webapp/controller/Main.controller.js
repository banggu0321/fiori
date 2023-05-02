sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter) {
        "use strict";

        return Controller.extend("zprojectodatae1104.controller.Main", {
            onInit: function () {

            },
            onselectionChange: function(oEvent){
                // debugger;
                var oRouter = this.getOwnerComponent().getRouter();
                var sPath = oEvent.getParameters().listItem.getBindingContextPath(); //'/Orders(10248)'
                var sKey = this.getView().getModel().getProperty(sPath+'/OrderID');//10230
                oRouter.navTo("RouteDetail",{
                    "key" : sKey
                });
            },
            onValueHelpRequest: function(){
                /*
                    Dialog 오픈.
                    CustomerDialog.fragment.xml 오픈

                    해당 Dialog 안에 sap.ui.table.Table 세팅 후, 
                    /Customers 바인딩한다. 표시할 필드는 CustomerID, CompanyName
                    팝업에 close버튼을 구성하여 클릭시 팝업이 닫히도록 한다.
                */
                // sap.m.MessageToast.show("input value help 실행!");

                var oDialog = this.byId("customerDialog");

                if (oDialog){
                    oDialog.open();
                    return;                    
                }
                
                this.loadFragment({
                    name: "zprojectodatae1104.view.fragment.CustomerDialog"
                }).then(function(oDialog){
                    oDialog.open();
                },this);

            },
            onClose: function(){
                // var oDialog = oEvent.getSource().getParent(); //Dialog        
                var oDialog = this.byId("customerDialog");      
                oDialog.close();
            },
            onRowSelectionChange: function(oEvent){
                var sCustID = oEvent.getParameters().rowContext.getObject().CustomerID; //'/Orders(10248)'
                // var sKey = oEvent.getParameters().rowContext.getProperty("CustomerID")
                this.byId("idInput").setValue(sCustID);
                // debugger;
                // var oDialog = oEvent.getSource().getParent(); //Dialog               
                // oDialog.close();
                
                this._search(sCustID);

                this.onClose();
            },
            _search: function(sCustID){
                let oFilter = new Filter({
                    filters : [
                        new Filter({ path:'CustomerID',operator:'EQ',value1: sCustID})
                    ],
                    and :false
                });
                this.byId("idProductsTable").getBinding("items").filter([oFilter]);
                // var oFilter2 = sap.ui.model.Filter('OrderID','EQ', oArge.key);
                // this.byId("idProductsTable").getBinding("items").filter(oFilter2);
            },
            onBtnPress: function(){
                let sCustID = this.byId("idInput").getValue();

                let oFilter = new Filter({
                    filters : [
                        new Filter({ path:'CustomerID',operator:'EQ',value1: sCustID})
                    ],
                    and :false
                });
                // debugger;
                this.byId("idProductsTable").getBinding("items").filter([oFilter]);
            }
        });
    });
