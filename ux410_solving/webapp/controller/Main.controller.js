sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, JSONModel) {
        "use strict";

        return Controller.extend("sap.btp.ux410solving.controller.Main", {
            onInit: function () {
                var datas = {
                        list : [
                            {type : "bar"},
                            {type : "column"},
                            {type : "line"},
                            {type : "donut"}
                        ]
                    };

                this.getView().setModel(new JSONModel(datas),"typeList");

                if(_rootPath){
                    this.byId("idImage").setSrc(_rootPath + '/image/pinggu.png');
                }
            },
            onSearch: function(){
                var oComboBox1 = this.byId("idComboBox1");
                var oComboBox2 = this.byId("idComboBox2");
                var oDataset = this.byId("idFlattenedDataset");
                var oFilter ;

                if(oComboBox2.getSelectedKey()){  // if(oComboBox2.getSelectedKey() != ""){
                    oComboBox2.setValueState("None");
                   
                    if(oComboBox1.getSelectedKey()) oFilter = new Filter('OrderID', 'EQ', oComboBox1.getSelectedKey());
                    // if(oComboBox1.getSelectedKey()){  // if(oComboBox1.getSelectedKey() = ""){
                        // var oFilter = new Filter({
                        //     filters : [
                        //         new Filter({ path:'OrderID', operator:'EQ', value1: oComboBox1.getSelectedKey()})
                        //     ],
                        //     and :false
                        // });
                    // }else{
                    //     var oFilter = new Filter({
                    //         filters : [
                    //             new Filter({ path:'OrderID', operator:'ALL'})
                    //         ],
                    //         and :false
                    //     });
                    // }
                    // var oFilter = oComboBox1.getSelectedKey() ? new Filter('OrderID','EQ',oComboBox1.getSelectedKey()) : [] ;
                    
                    oDataset.getBinding("data").filter(oFilter);

                    this.byId("idViewChart").setVizType(oComboBox2.getSelectedKey());
                }else{
                    oComboBox2.setValueState("Error");
                }
                
                // !oComboBox2.getSelectedKey() -> list안 유효성검사 가능
                
// 강사님풀이 
                // if(!oComboBox2.getSelectedKey()){
                //     oComboBox2.setValueState("Error");
                //     return;
                // }
                // oComboBox2.setValueState("None");
                // if(oComboBox1.getSelectedKey()) oFilter = new Filter('OrderID', 'EQ', oComboBox1.getSelectedKey());

                // oDataset.getBinding("data").filter(oFilter);
                // this.byId("idViewChart").setVizType(oComboBox2.getSelectedKey());
            },
            onSelectData: function(oEvent){
                var oRouter = this.getOwnerComponent().getRouter();
                // var oData = oEvent.getParameters().data[0]["data"];
                // var oData = oEvent.getParameter("data")[0].data;
                var oData = oEvent.getParameters().data[0].data;
                var oVizFrame = this.byId("idViewChart");

                oVizFrame.vizSelection(oData, { clearSelection : true });  //차트 선택된거 초기화

                // debugger;
                oRouter.navTo("RouteDetail",{  //detail로 이동
                    OrderID : oData.OrderID,
                    ProductID : oData.ProductID
                });
            }
        });
    });
