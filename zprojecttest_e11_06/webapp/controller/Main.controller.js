sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zprojectteste1106.controller.Main", {
            onInit: function () {

            },
            onAdd: function(){
                var oDialog = this.byId("addDialog");

                if(oDialog){
                    oDialog.open();
                    return;
                }

                this.loadFragment({
                    name:"zprojectteste1106.view.fragment.addDialog"
                }).then(function(oDialog) {
                    oDialog.open();
                }, this)  //controller를 바라봄
            },
            onClose : function(oEvent){
                var oDialog = oEvent.getSource().getParent(); //Dialog
                var oModel = this.getView().getModel("todo"),
                    aTodo = oModel.getData().value;
                // var oDialog = this.byId("addDialog"); 위와 동일

                // var sValue = oDialog.getContent()[0].getItems()[1].getValue();
                // console.log(sValue);

                var sValue = this.getView().getModel("todo").getProperty("/value");

                console.log(sValue);
                if(sValue){
                    aTodo.unshift({content: sValue});
                    oModel.setProperty("/todo", aTodo);
                }

                // console.log(sValue);

                //oEvent.getSource() 관련된 정보 , button 객체
                //oEvent.getSource().getParent()  -> aggregation 제외,  dialog 객체
                // debugger;

                oDialog.close();
                
                // afterOpen.
            },onDelete: function(){
                var oTable = this.byId("todoTable");
                var oModel = this.getView().getModel("root");

                var aSelectedIndices = oTable.getSelectedIndices();
                var aDatas = oModel.getProperty("/todo");
                
                let sMsg = '정말 삭제하시겠습니까?';

                if(aSelectedIndices.length >= 1){
                    MessageBox.confirm(sMsg, {
                        // icon: MessageBox.Icon.INFORMATION,
                        title: "Delete row",
                        actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                        emphasizedAction: MessageBox.Action.YES,
                        onClose: function (oAction) {
                            if (oAction === 'YES'){
                                for(var i = aSelectedIndices.length - 1 ; i >= 0; i--){
                                    aDatas.splice(aSelectedIndices[i], 1);
                                }
                                oModel.setProperty("/todo", aDatas);
                            } 
                        } //param -> YES / NO값
                    });
                }
            },
            onRowDelete: function(oEvent){
                var oModel = this.getView().getModel("root");
                var aDatas = oModel.getProperty("/todo");
                var index = oEvent.getParameters().row.getIndex();

                aDatas.splice(index, 1);
                oModel.setProperty("/todo", aDatas);
            }
        });
    });
