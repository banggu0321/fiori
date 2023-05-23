sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("ER.zferslipchart.controller.Main", {
            onInit: function () {
                // oModel.loadData( sap.ui.require.toUrl("zprojectteste1104/model/data.json") );
                // this.getView().setModel(new JSONModel(),"PartnerList");
                this.getView().setModel(new JSONModel(sap.ui.require.toUrl("ER/zferslipchart/model/Tree.json")),"PartnerList");
                
                
                this._getData();
                // debugger;
                // var oModel = new JSONModel();
                // oModel.loadData( sap.ui.require.toUrl("ER.zferslipchart/webapp/model/Tree.json") );
                // this.getView().setModel(oModel, 'ParterList');
            },
            _getData : function(){
                // var oPartnerList = { "list":[ ]};
                var aPartner = [];
                var aPartnercode = [];
                this.getOwnerComponent().getModel().read("/employeeSet", {
                    success: function(oReturn) {
                        this.empid = oReturn.results[0].Employeeid;
                        this.byId("idAtUserName").setText(`${oReturn.results[0].Name}(${this.empid})`);
                        this.byId("idAtDept").setText(`${oReturn.results[0].Deptname}`);
                        this.byId("idLabeluname").setText(`${oReturn.results[0].Deptname} ${oReturn.results[0].Name}(${oReturn.results[0].Employeeid})`);
                    }.bind(this)
                });

                this.getOwnerComponent().getModel().read("/partnerSet", {
                    success: function(oReturn) {
                        debugger;
                        for(var i = 0; i < oReturn.results.length + 1 ; i++){
                            var j = i - 1;
                            if(i === oReturn.results.length){
                                aPartnercode.push({text: oReturn.results[j].Partcode,nodes:aPartner});
                            }else if(i === 0){
                                aPartner.push({text: oReturn.results[i].Partid});
                            }
                            else if(oReturn.results[j].Partcode === oReturn.results[i].Partcode){
                                aPartner.push({text: oReturn.results[i].Partid});
                            }else{
                                aPartnercode.push({text: oReturn.results[j].Partcode,nodes:aPartner});
                                aPartner = [];
                                aPartner.push({text: oReturn.results[i].Partid});
                            }
                        }
                        this.getView().setModel(new JSONModel({list:aPartnercode}),"PartnerList");
                        debugger;
                    }.bind(this)
                });

                // this.getOwnerComponent().getModel().read("/partnercodeSet", {
                //     success: function(oReturn) {
                //         for(var j = 0; j < oReturn.results.length; j++){
                //             oPartnerList.push
                //         }
                //         oReturn.results
                //     }.bind(this)
                // });
                
            }
        });
    });
