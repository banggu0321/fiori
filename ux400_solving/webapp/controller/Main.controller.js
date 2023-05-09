sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("sap.btp.ux400solving.controller.Main", {
            formatter:{
                transformDiscontinued : function(sData){
                    // console.log(sData);
                    // if (sData == true){
                    //     sData = "Yes";
                    // }else{
                    //     sData = "No";
                    // }    
                    // return sData;
                    return sData == true ? 'Yes' : 'No'; 
                }
            },
            onInit: function () {
                // var datas = {
                //     randomValue : [
                //     ]
                // };

                this.getView().setModel(new JSONModel({value:[]}),"list");
            },
            onRandomPress: function(){
                var oControl = this.byId("idInput");

                oControl.setValueState("None");

                var oListModel = this.getView().getModel("list"),
                    aList = oListModel.getData().value;


                // if(oControl.getValue() == ""){
                    var cRandomValue = Math.floor(Math.random() * 100) + 1 ;
                    oControl.setValue(cRandomValue);
                    
                    var result = {num : cRandomValue};
                    aList.push(result);
                    oListModel.setProperty("/value", aList);
                // }else{
                //     var result = {num : oControl.getValue()};
                //     aList.push(result);
                //     oListModel.setProperty("/value", aList);
                // }
            },
            onOpenProduct: function(){
                var oDialog = this.byId("ProductsDialog"); //DialogID

                if (oDialog){
                    oDialog.open();
                    return;                    
                }
                
                this.loadFragment({
                    name: "sap.btp.ux400solving.view.fragment.Products"
                }).then(function(oDialog){
                    oDialog.open();
                    // debugger;
                },this);

                // debugger;
            },
            onClose: function(oEvent){
                var oDialog = oEvent.getSource().getParent(); //Dialog        
                // var oDialog = this.byId("ProductsDialog");      
                oDialog.close();
            },
            onValueChange: function(){
                var sInputValue = Number(this.byId("idInput").getValue());
                // var sInputValue2 = this.byId("idInput").getValue();
                // debugger;

                if(sInputValue >= 1 && sInputValue <= 100 ){
                    this.byId("idInput").setValueState("None");

                    var oListModel = this.getView().getModel("list"),
                        aList = oListModel.getData().value;
                    
                    var result = {num : sInputValue};
                    aList.push(result);
                    oListModel.setProperty("/value", aList);
                    this.byId("idBtn").setEnabled(true);
                }else if(sInputValue = ""){
                    this.byId("idInput").setValueState("None");
                }else{
                    this.byId("idInput").setValueState("Error");
                    // this.byId("idInput").setValueStateText("1이상 100이하의 숫자를 입력하세요");
                    this.byId("idBtn").setEnabled(false);
                }
                // 강사님 풀이
                // let oControl = this.byId("inInput");
                // let iNum = Number(oControl.getValue());
                // let isOK = iNum >= 1 && iNum <= 100;

                // oControl.setValueState(isOK ? 'None' : 'Error');
                // oControl.setValueStateText(isOK ? '' : '1~100사이의 숫자를 입력하세요');
                // this.byId("id").setEnabled(isOK ? true : false);

                // let isOK = iNum >= 1 && iNum <= 100;

                // oControl.setValueState(isOK?'None':'Error');
                // oControl.setValueStatText(isOK?'':'1~100숫자를 입력하세요');
                // this.byId("idBtn").setEnabled(isOK?true:false);

            }
        });
    });
