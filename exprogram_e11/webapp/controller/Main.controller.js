sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter, FlattenedDataset, FeedItem) {
        "use strict";

        return Controller.extend("exprograme11.controller.Main", {
            onInit: function () {
                var datas = {
                    list : [
                        {code : "USD"},
                        {code : "EUR"},
                        {code : "KRW"}
                    ]
                };

            this.getView().setModel(new JSONModel(datas),"CurCode");
            this.getView().setModel(new JSONModel(),'DetailModel');
            },
            onPressSearchBtn: function(){
                var oComboBoxCurrcode = this.byId("idComboBoxCurrcode");
                var oInputCarrname = this.byId("idInputCarrname");
                var oFilter, sFilter1;
                var sFilter2 = oInputCarrname.getValue();


                if(!oComboBoxCurrcode.getSelectedKey() ){ //currcode없으면
                    oFilter = new Filter('Carrname', 'Contains', sFilter2)
                    this.byId("idCarrierSetTable").getBinding("items").filter(oFilter);
                    // debugger;
                    return;
                }

                sFilter1 = oComboBoxCurrcode.getSelectedKey();
                oFilter = new Filter({
                    filters : [
                        new Filter({ path:'Currcode', operator:'EQ', value1: sFilter1}),
                        new Filter({ path:'Carrname', operator:'Contains', value1: sFilter2})
                    ],
                    and : true
                });
                // debugger;
                this.byId("idCarrierSetTable").getBinding("items").filter(oFilter);
            },
            onPressDetailBtn :function(oEvent){
                // var oSelectData = oEvent.getSource().getBindingContext().getObject();
                var sPath = oEvent.getSource().getBindingContext().getPath();
                var oDetailModel = this.getView().getModel("DetailModel");
                // debugger;

                this.getOwnerComponent().getModel().read(sPath, {
                    urlParameters: { $expand: "to_Item" },
                    success: function (oReturn) {
                        oDetailModel.setProperty("/Carrname", oReturn.Carrname);
                        oDetailModel.setProperty("/Carrid", oReturn.Carrid);
                        oDetailModel.setProperty("/data", oReturn.to_Item.results);
                    }.bind(this),
                });

                var oDialog = this.byId("DetailsDialog");

                if (oDialog){
                    oDialog.open();
                    return;                    
                }
                
                this.loadFragment({
                    name: "exprograme11.view.fragment.Detail"
                }).then(function(oDialog){
                    oDialog.open();
                },this);
            },
            onClose: function(oEvent){
                var oDialog = oEvent.getSource().getParent(); //Dialog        
                // var oDialog = this.byId("ProductsDialog");      
                oDialog.close();
            },
            // onSelectRow:function(oEvent){
            //     // var sSelectRow = oEvent.getParameters().rowContext;
            //     var sSelectRow = oEvent.getParameters().rowIndex;
            //     // debugger;
            //     this.byId("idViewChart1").vizSelection();
            // },
            onRadioSelect : function(){
                var oRadioButton = this.byId("VizType");
                var sVizType = oRadioButton.getSelectedButton().getProperty("text");
                var oChart1 = this.byId("idViewChart1");
                var oChart2 = this.byId("idViewChart2");
                
                if(sVizType == "Price"){
                    oChart1.setVisible(false);
                    oChart2.setVisible(true);
                }else{
                    oChart1.setVisible(true);
                    oChart2.setVisible(false);
                    oChart1.setVizType(sVizType);
                }
            }
        });
    });