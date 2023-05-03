sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("zprojectodatae1105.controller.Main", {
            onInit: function () {
                this.getView().setModel(new JSONModel(),"main");

                this._defaultSet();
            },
            _defaultSet: function(){
                // odata model 변수 세팅
                this.oModel = this.getOwnerComponent().getModel();
                //json model 변수 세팅
                this.oMainModel = this.getView().getModel("main");
                //table객체 
                this.oTable = this.byId("idTable");
            },
            onCreate: function(){
                let oData = this.oMainModel.getData();
                
                oData.Productno = Number(oData.Productno);
                
                this.oModel.create("/Products", oData, {
                    success: function(){
                        sap.m.MessageToast.show("Create Success!!");
                    },
                    error : function(){
                        sap.m.MessageToast.show("Error~!");
                    }
                });
            },
            onUpdate: function(){
                let jsonData = this.oMainModel.getProperty("/");
                var sFullPath = this.oModel.createKey("/Products",{
                    Productno : jsonData.Productno
                });
                
                this.oModel.update(sFullPath, jsonData,{
                    success:function(){
                        sap.m.MessageToast.show("success update");
                    },
                    error:function(){
                        sap.m.MessageToast.show("error update");
                    }
                });
            },
            onDelete: function(){
                let index = this.oMainModel.getProperty("/Productno");
                var sFullPath = this.oModel.createKey("/Products",{
                    Productno : Number(index)
                }); // "/Products(2)" 과 동일함 
                this.oModel.remove(sFullPath,{
                    success:function(){
                        sap.m.MessageToast.show("삭제되었습니다.");
                    }
                });
            },
            onReadEntity: function(){
                let index = this.oTable.getSelectedIndex();  //2
                let sPath = this.oTable.getContextByIndex(index).getPath(); //'/Products(13)'
                // let oMainModel = this.oMainModel;
                // this.oTable

                // var sFullPath = this.oModel.createKey("/Products",{
                //     Productno : 2
                // }); // "/Products(2)" 과 동일함
                
                // debugger;

                this.oModel.read(sPath,{
                    success: function(oReturn){
                        console.log("READ : ", oReturn);
                        this.oMainModel.setProperty("/", oReturn);
                        // this.oMainModel.setData(oReturn);
                        // debugger;
                    }.bind(this)
                });
            },
        });
    });
