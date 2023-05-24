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
                // this.getView().setModel(new JSONModel(sap.ui.require.toUrl("ER/zferslipchart/model/Tree.json")),"PartnerList");
                
                this.getView().setModel(new JSONModel(),"slipAll");
                this.getView().setModel(new JSONModel(),"partnerList");
                this.getView().setModel(new JSONModel(),"slipPartnerList");

                this._defaultSet();
                this._getData();
                // debugger;
                // var oModel = new JSONModel();
                // oModel.loadData( sap.ui.require.toUrl("ER.zferslipchart/webapp/model/Tree.json") );
                // this.getView().setModel(oModel, 'ParterList');
            },
            _defaultSet : function(){
                // odata model 변수 세팅
                this.oModel = this.getOwnerComponent().getModel(); //oData
                //json model 변수 세팅
                this.oslipAll = this.getView().getModel("slipAll"); //slipAll
                //json model 변수 세팅
                this.opartnerList = this.getView().getModel("partnerList"); //partneList
                //json model 변수 세팅
                this.oslipPartnerList = this.getView().getModel("slipPartnerList"); //partneList
            },
            _getData : function(){
                var aPartner = [];
                var aPartnercode = [];
                var aPartnerAll = [];
                var aPartnerAmtTem = [];
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
                        this.opartnerList.setProperty("/list",oReturn);
                        for(var i = 0; i < oReturn.results.length + 1 ; i++){ //0 6
                            // debugger;
                            var j = i - 1;
                            if(i === oReturn.results.length){
                                aPartnercode.push({text: oReturn.results[j].Partcode,nodes:aPartner});
                            }else if(i === 0){
                                aPartner.push({text: oReturn.results[i].Partid});
                            }else if(oReturn.results[j].Partcode === oReturn.results[i].Partcode){
                                aPartner.push({text: oReturn.results[i].Partid});
                            }else{
                                aPartnercode.push({text: oReturn.results[j].Partcode,nodes:aPartner});
                                aPartner = [];
                                aPartner.push({text: oReturn.results[i].Partid});
                            }

                            if(oReturn.results[i] != undefined){
                                aPartnerAll.push(oReturn.results[i].Partid);
                                aPartnerAmtTem.push(0);
                            }
                        }
                        this.getView().setModel(new JSONModel({list:aPartnercode}),"PartnerTreeList");
                    }.bind(this)
                });

                this.getOwnerComponent().getModel().read("/sliphSet", {
                    success: function(oReturn) {
                        // var sPstdatei, sPstdatej ;
                        var aPartnerAmt = aPartnerAmtTem;
                        var aDatas = [];
                        // debugger;
                        for(var i = 0; i < oReturn.results.length  ; i++){
                            // debugger;
                            var sPstdatei, sPstdatej;
                            var j = i + 1;
                            sPstdatei = this._datefomatter(oReturn.results[i].Pstdate); //202304 , 202305
                            
                            
                            if(i != oReturn.results.length - 1){
                                sPstdatej = this._datefomatter(oReturn.results[j].Pstdate); //202305, 202306
                            };
                            // debugger;
                            
                            if(sPstdatei === sPstdatej){
                                for(var k = 0; k < aPartnerAll.length ; k++){
                                    if(aPartnerAll[k] === oReturn.results[i].Partid){
                                        aPartnerAmt[k] += Number(oReturn.results[i].Amt);
                                        break;
                                    }
                                }
                                // debugger;
                            }
                            // else if( i === oReturn.results.length - 1){
                            //     for(var l = 0; l < aPartnerAll.length ; l++){
                            //         if(aPartnerAll[l] === oReturn.results[i].Partid){
                            //             aPartnerAmt[l] += Number(oReturn.results[i].Amt);
                            //             break;
                            //         }
                            //     }
                            //     // debugger;
                            // }
                            else {
                                for(var l = 0; l < aPartnerAll.length ; l++){
                                    if(aPartnerAll[l] === oReturn.results[i].Partid){
                                        aPartnerAmt[l] += Number(oReturn.results[i].Amt);
                                        break;
                                    }
                                };
                                var oData = {
                                    year: sPstdatei.substr(0, 4), //20230401 ->2023
                                    month: oReturn.results[i].Month              //'1'
                                  };

                                for (var m = 0; m < aPartnerAll.length; m++) {
                                    var key = aPartnerAll[m];
                                    var value = aPartnerAmt[m];
                                    oData[key] = value;
                                }
                                aDatas.push(oData);
                                aPartnerAmt = aPartnerAmtTem;
                                // debugger;
                            };

                            //무한루프
                            if(i === oReturn.results.length - 1){
                                var oData = {
                                    year: sPstdatei.substr(0, 4), //20230401 ->2023
                                    month: oReturn.results[i].Month              //'1'
                                  };

                                for (var o = 0; o < aPartnerAll.length; o++) {
                                    var key = aPartnerAll[o];
                                    var value = aPartnerAmt[o];
                                    oData[key] = value;
                                }
                                aDatas.push(oData);
                                aPartnerAmt = aPartnerAmtTem;
                            };
                        };
                        this.oslipPartnerList.setProperty("/list",aDatas);
                    
                        
                        // debugger;

                        // debugger;

                        // aPartnerAmt = [0, 0, 409500, 3842370, 0] ;  
                        // aPartnerAll = ['PAT05', 'PAT00', 'PAT07', 'PAT08', 'PAT09'];
                        // oData = {PAT05:0, PAT00:0, PAT07:409500, PAT08:3842370, PAT09:0};
                        // debugger;
                    }.bind(this)
                });
                // this.getOwnerComponent().getModel().read("/sliphSet", {
                //     success: function(oReturn) {
                //         for(var j = 0; j < oReturn.results.length; j++){
                //             oPartnerList.push
                //         }
                //         oReturn.results
                //     }.bind(this)
                // });
                
            },
            _datefomatter: function(date){

                let oDateTimeInstance;

                oDateTimeInstance = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern : 'yyyyMM'
                });

                return oDateTimeInstance.format(date);
            },
            onSearch : function(){
                // debugger;
            }
        });
    });
