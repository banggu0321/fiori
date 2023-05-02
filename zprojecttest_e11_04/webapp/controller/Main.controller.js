sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("zprojectteste1104.controller.Main", {
            onInit: function () {
                let datas = {
                    title : {
                        subTitle : 'Json Title'
                    },
                    list:[
                        {name : 'moon', age: 20},
                        {name : 'hong', age: 21},
                        {name : 'kim',  age: 22},
                        {name : 'park', age: 23},
                        {name : 'song', age: 24}
                    ],
                    result:[

                    ],
                    todo : [
                        {content:'test'}
                    ],
                };
                // this.getView().setModel(new JSONModel(datas), 'MainModel');
                var oModel = new JSONModel(datas);
                // oModel.loadData( sap.ui.require.toUrl("zprojectteste1104/model/data.json") );
                this.getView().setModel(oModel, 'MainModel');

            },
            onChange: function(){
                var oModel = this.getView().getModel("MainModel");
                var oData = oModel.getProperty("/title/subTitle");
                
                console.log("변경 전 : ", oData);
                oModel.setProperty("/title/subTitle","Change Title");

                // var oData = oModel.getData();
                
                // oModel.getProperty("/title/subTitle");  //'Json Title' 속도느려짐~~
                // oModel.setProperty("/title/subTitle", 'hihi');  // 변경할 값

                // oData.list[4].age = 100;
                // oModel.setData(oData);
                // console.log(oData.list[4]);
                
                // var oModel = this.getView().getModel("MainModel");
                // var oData = oModel.getData(); //전체 데이터를 다 가져옴
                
                // console.log("변해당하는경 전 : ", oData.title.subTitle);

                // oData.title.subTitle = 'change Title';
                // oModel.setData(oData);
                
                // oModel.setData({num:30});

                // console.log(oData.title.subTitle);
                
                // var sTitle = oData.list[0].name;

                // this.byId("page").setTitle(sTitle);
                // this.byId("idText").setText(sTitle);

                // oModel.getProperty("/title/subTitle"); //특정 경로에 해당하는 데이터 가져옴
            },
            onDisplay: function(){
                var oModel = this.getView().getModel("MainModel");
                var oData = oModel.getProperty("/title/subTitle");
                console.log("변경 후 : ", oData);       
                // var oData = oModel.getData(); //전체 데이터를 다 가져옴
                // console.log("변경 후 : ", oData.title.subTitle);                
            },
            onButtonPress: function () {
                var oModel = this.getView().getModel("MainModel"),
                    aList = oModel.getData().result;

                let oSelect = this.byId("idSelect").getSelectedItem(),
                    iNum1 = Number(this.byId("idInput1").getValue()),
                    iNum2 = Number(this.byId("idInput2").getValue()),
                    result = 0;
                let sMsg = '';


                switch (oSelect.getKey()) {
                    case "plus":
                        result = iNum1 + iNum2;
                        break;
                    case "minus":
                        result = iNum1 - iNum2;
                        break;
                    case "multiply":
                        result = iNum1 * iNum2;
                        break;
                    case "devide":
                        result = iNum1 / iNum2;
                        break;
                    default:
                        break;
                }
                sMsg = `${iNum1} ${oSelect.getText()} ${iNum2} = ${result}`;

                var aResult2 = { num1 : iNum1, oper: oSelect.getText(), num2:iNum2, result: result};
                // // oData.result.push(aResult2);
                // // oModel.setData(oData);

                MessageBox.show(sMsg, {
                    icon: MessageBox.Icon.INFORMATION,
                    title: "계산기 결과는???",
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        if (oAction === 'YES'){
                            aList.push(aResult2);
                            oModel.setProperty("/result",aList);
                        } else if(oAction === 'NO') {
                            aList.push({ num1 : iNum1, oper: oSelect.getText(), num2:iNum2, result: ""});
                            oModel.setProperty("/result",aList);
                        }
                    } //param -> YES / NO값
                });
            },
            onAdd : function () {
                var oDialog = this.byId("addDialog");

                if(oDialog){
                    oDialog.open();
                    return;
                }

                this.loadFragment({
                    name:"zprojectteste1104.view.fragment.addDialog"
                }).then(function(oDialog) {
                    oDialog.open();
                }, this)  //controller를 바라봄
                
            },
            onClose : function(oEvent){
                var oDialog = oEvent.getSource().getParent(); //Dialog
                var oModel = this.getView().getModel("MainModel"),
                    aTodo = oModel.getData().todo;
                // var oDialog = this.byId("addDialog"); 위와 동일

                // var sValue = oDialog.getContent()[0].getItems()[1].getValue();
                // console.log(sValue);

                var sValue = this.getView().getModel("root").getProperty("/value");

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
            },
            onBeforeOpen : function(){
                this.byId("addInput").setValue();
            },
            onDelete :function(){
                
                var oTable = this.byId("todoTable");
                var oModel = this.getView().getModel("MainModel");

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
            onRowDelete:function(oEvent){
                // debugger;
                // console.log(oEvent.getParameters().row.getIndex());
                var oModel = this.getView().getModel("MainModel");
                var aDatas = oModel.getProperty("/todo");
                var index = oEvent.getParameters().row.getIndex();

                aDatas.splice(index, 1);
                oModel.setProperty("/todo", aDatas);
            }
        });
    });
