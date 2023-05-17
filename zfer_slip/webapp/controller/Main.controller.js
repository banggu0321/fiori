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

        return Controller.extend("ER.zferslip.controller.Main", {
            formatter: {
                dateTime: function(oDate) {
                    let oDateTimeInstance;

                    oDateTimeInstance = sap.ui.core.format.DateFormat.getDateTimeInstance({
                        pattern : 'yyyy-MM-dd'
                    });

                    return oDateTimeInstance.format(oDate);
                },
                dateTime2: function(sDate) {
                    
                    // let oDateTimeInstance;

                    // oDateTimeInstance = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    //     pattern : 'yyyy-MM-dd'
                    // });
                    return sDate.slice(0,4) + '-' + sDate.slice(4, 6) + '-' + sDate.slice(6,8);;
                },
                dcindicator3Text : function(sDcIndicator, sAmtValue, sTaxValue) {
                    if (sDcIndicator === '3' && sAmtValue === 0) {
                      return sTaxValue;
                    } else if (sDcIndicator === '3' && sAmtValue !== 0) {
                      return sAmtValue;
                    } else {
                      return 0;
                    }
                },
                dcindicator4Text : function(sDcIndicator, sAmtValue, sTaxValue) {
                    if (sDcIndicator === '4' && sAmtValue === 0) {
                      return sTaxValue;
                    } else if (sDcIndicator === '4' && sAmtValue !== 0) {
                      return sAmtValue;
                    } else {
                      return 0;
                    }
                }
            },
            onInit: function () {
                var typedatas = {
                    list : [
                        {type : "오토필"},
                        {type : "대여"},
                        {type : "배터리판매"}
                    ]
                };
                // var tabledatas = {
                //     // list :[
                //     //     // {
                //     //     //     status : "미완료",
                //     //     //     docnum : "CWN11111111",
                //     //     //     partid : "PAT00",
                //     //     //     sliptype : "AA",
                //     //     //     prfdate : "20230516",
                //     //     //     amount : "1000000",
                //     //     //     curkey : "KRW"
                //     //     // }
                //     // ]
                // };
                // debugger;
                this.getView().setModel(new JSONModel(typedatas),"typeList"); //전표유형
                this.getView().setModel(new JSONModel(),"slipBefore"); //table
                this.getView().setModel(new JSONModel(),"slipH"); //table -> 전체 배열 [ {}, {}, {}]
                this.getView().setModel(new JSONModel(),"slipI"); //table -> [ obj{ [item] [item] [item]}, , , , , , ]
                
                this._defaultSet();
                this.todaydate = this.getToday();
                // this._createSlip();

                // let oo = this.getOwnerComponent().getModel().getObject("/employeeSet");
                // console.log(oo);

                this.getOwnerComponent().getModel().read("/employeeSet", {
                    success: function(oReturn) {
                        this.empid = oReturn.results[0].Employeeid;
                        this.byId("idAtUserName").setText(`${oReturn.results[0].Name}(${this.empid})`);
                        this.byId("idAtDept").setText(`${oReturn.results[0].Deptname}`);
                        this.byId("idLabeluname").setText(`${oReturn.results[0].Deptname} ${oReturn.results[0].Name}(${oReturn.results[0].Employeeid})`);
                    }.bind(this)
                });
                this._getdata();
            },
            _defaultSet : function(){
                // odata model 변수 세팅
                this.oModel = this.getOwnerComponent().getModel(); //oData
                //json model 변수 세팅
                this.oSlipBefore = this.getView().getModel("slipBefore"); //main
                //json model 변수 세팅
                this.oslipH = this.getView().getModel("slipH"); //main
                //json model 변수 세팅
                this.oslipI = this.getView().getModel("slipI"); //main
                //table객체 
                this.oTable = this.byId("idSlipbeforeTable");
            },
            _getdata : function(){
                var tabledatas = [];
                var sliphdatas = [];
                var slipidatas = [];
                var snum = 0;

                var sPath = "/wbatsoSet";   // '/auto'
                this.oModel.read(sPath,{ 
                    success:function(oReturn){
                        // debugger;
                        console.log("wbatso데이터성공");
                        for(var i = 0 ; i < oReturn.results.length; i++){
                            // debugger;
                            tabledatas.push({
                                status : "미완료",
                                docnum : oReturn.results[i].Batterysoid,
                                partid : oReturn.results[i].Partnerid,
                                sliptype : "SP",
                                prfdate : oReturn.results[i].Indate,
                                amount : oReturn.results[i].Price,
                                curkey : oReturn.results[i].Curkey
                            });
                            sliphdatas.push({
                                slipid : 'BON'+i,
                                docnum : oReturn.results[i].Batterysoid,
                                sliptype : "SP",
                                prfdate : oReturn.results[i].Indate,
                                pdtdate : this.todaydate,
                                managerid : this.empid,
                                partid : oReturn.results[i].Partnerid
                            });
                            this.oslipH.setProperty("/hlist",sliphdatas);
                            
                            slipidatas.push({
                                slipid : 'BON'+i,
                                prnum : '01',
                                accocode : '101',
                                dcindicator : '3',
                                amt : Number(oReturn.results[i].Price),
                                tax : 0,
                                curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                slipid : 'BON'+i,
                                prnum : '02',
                                accocode : '401',
                                dcindicator : '4',
                                amt : Number(oReturn.results[i].Price) * 0.9,
                                tax : 0,
                                curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                slipid : 'BON'+i,
                                prnum : '03',
                                accocode : '225',
                                dcindicator : '4',
                                amt : 0,
                                tax : Number(oReturn.results[i].Price) * 0.1,
                                curkey : oReturn.results[i].Curkey
                            });
                            this.oslipI.setProperty("/ilist",slipidatas);
                            snum += 1;
                        };
                        this.oSlipBefore.setProperty("/blist",tabledatas);
                        this.byId("idObjNum").setNumber(snum);
                    }.bind(this)
                });

                var sPath = "/rentalSet";
                tabledatas = [];
                sliphdatas = [];
                slipidatas = [];
                this.oModel.read(sPath,{
                    success:function(oReturn){
                        // debugger;
                        console.log("rental데이터성공");
                        for(var i = 0 ; i < oReturn.results.length; i++){
                            // debugger;
                            tabledatas.push({
                                status : "미완료",
                                docnum : oReturn.results[i].Rentalid,
                                partid : "PAT00",
                                sliptype : "SS",
                                prfdate : oReturn.results[i].Fdate,
                                amount : Number(oReturn.results[i].Retfee) + Number(oReturn.results[i].Drivfee),
                                curkey : oReturn.results[i].Curkey
                            });
                            
                            sliphdatas.push({
                                slipid : 'REN'+i,
                                docnum : oReturn.results[i].Rentalid,
                                sliptype : "SS",
                                prfdate : oReturn.results[i].Fdate,
                                pdtdate : this.todaydate,
                                managerid : this.empid,
                                partid : "PAT00"
                            });
                            this.oslipH.setProperty("/hlist",sliphdatas);
                            
                            slipidatas.push({
                                slipid : 'REN'+i,
                                prnum : '01',
                                accocode : '102',
                                dcindicator : '3',
                                amt : Number(oReturn.results[i].Retfee) + Number(oReturn.results[i].Drivfee),
                                tax : 0,
                                curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                slipid : 'REN'+i,
                                prnum : '02',
                                accocode : '830',
                                dcindicator : '4',
                                amt : ( Number(oReturn.results[i].Retfee) + Number(oReturn.results[i].Drivfee) ) * 0.9,
                                tax : 0,
                                curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                slipid : 'REN'+i,
                                prnum : '03',
                                accocode : '135',
                                dcindicator : '4',
                                amt : 0,
                                tax : ( Number(oReturn.results[i].Retfee) + Number(oReturn.results[i].Drivfee) ) * 0.1,
                                curkey : oReturn.results[i].Curkey
                            });
                            this.oslipI.setProperty("/ilist",slipidatas);
                            snum += 1;
                        };
                        this.oSlipBefore.setProperty("/blist",tabledatas);
                        this.byId("idObjNum").setNumber(snum);
                    }.bind(this)
                });
                
                var sPath = "/autoSet";   // '/auto'
                tabledatas = [];
                sliphdatas = [];
                slipidatas = [];
                this.oModel.read(sPath,{
                    success:function(oReturn){
                        // debugger;
                        console.log("auto데이터성공");
                        for(var i = 0 ; i < oReturn.results.length; i++){
                            // debugger;
                            tabledatas.push({
                                status : "미완료",
                                docnum : oReturn.results[i].Autonum,
                                partid : oReturn.results[i].Partid,
                                sliptype : "KZ",
                                prfdate : oReturn.results[i].Autodat,
                                amount : oReturn.results[i].Amount,
                                curkey : oReturn.results[i].Curkey
                            });
                            
                            sliphdatas.push({
                                slipid : 'MON'+i,
                                docnum : oReturn.results[i].Autonum,
                                sliptype : "KZ",
                                prfdate : oReturn.results[i].Autodat,
                                pdtdate : this.todaydate,
                                managerid : this.empid,
                                partid : oReturn.results[i].Partid
                            });
                            this.oslipH.setProperty("/hlist",sliphdatas);
                            
                            slipidatas.push({
                                slipid : 'MON'+i,
                                prnum : '01',
                                accocode : '102',
                                dcindicator : '4',
                                amt : Number(oReturn.results[i].Amount),
                                tax : 0,
                                curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                slipid : 'MON'+i,
                                prnum : '02',
                                accocode : '830',
                                dcindicator : '3',
                                amt : Number(oReturn.results[i].Amount) * 0.9,
                                tax : 0,
                                curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                slipid : 'MON'+i,
                                prnum : '03',
                                accocode : '135',
                                dcindicator : '3',
                                amt : 0,
                                tax : Number(oReturn.results[i].Amount) * 0.1,
                                curkey : oReturn.results[i].Curkey
                            });
                            this.oslipI.setProperty("/ilist",slipidatas);
                            snum += 1;
                        };
                        this.oSlipBefore.setProperty("/blist",tabledatas);
                        this.byId("idObjNum").setNumber(snum);
                    }.bind(this)
                });
                // debugger;
            },
            getToday : function(){
                var date = new Date();
                var year = date.getFullYear();
                var month = ("0" + (1 + date.getMonth())).slice(-2);
                var day = ("0" + date.getDate()).slice(-2);
            
                return year + month + day;
            },
            // _createSlip : function(){
            //     var sliphdatas = [];
            //     var slipidatas = [];

            //     debugger;
            //     var aSlipBeforeData = this.oSlipBefore.getData("list");
            //     for(var i = 0; i < aSlipBeforeData.length; i++){
            //         sliphdatas.push({
            //             slipid : i,
            //             docnum : aSlipBeforeData[i].docnum,
            //             sliptype : aSlipBeforeData[i].sliptype,
            //             prfdate : aSlipBeforeData[i].prfdate,
            //             pdtdate : "오늘날짜",
            //             managerid : this.sempi,
            //             partid : aSlipBeforeData[i].partid
            //         });
                    
            //         this.oslipH.setProperty("/",sliphdatas);
            //         this.oslipi.setProperty("/",slipidatas);

            //     }
            // },
            onSearch: function(){
                var oComboBox = this.byId("idComboBox1");
                // var sDateRange1 = this.byId("idDateRangeSelection").getFrom();
                // var sDateRange2 = this.byId("idDateRangeSelection").getTo();
                var oDateRange = this.byId("idDateRangeSelection");
                // debugger;
                var oTable = this.byId("idSlipbeforeTable");
                var aFilter = [];
                var sFilter1 = '';

                // if(oComboBox2.getSelectedKey()){  // if(oComboBox2.getSelectedKey() != ""){
                    // oComboBox2.setValueState("None");
                    // case()
                    switch(oComboBox.getSelectedKey()){
                        case '오토필' : 
                            sFilter1 = 'MON';
                            break;
                        case '대여' : 
                            sFilter1 = 'REN';
                            break;
                        case '배터리판매' : 
                            sFilter1 = 'BON';
                            break;
                    };

                    if (sFilter1) {
                        aFilter.push(new Filter("docnum", "Contains", sFilter1));
                        // debugger;
                    }
                    if (oDateRange.getValue()){
                        aFilter.push(new Filter("prfdate", "BT", oDateRange.getFrom(), oDateRange.getTo()));
                        // debugger;
                    }
                    
                    oTable.getBinding("rows").filter(aFilter);
                   
                    // if(oDateRange.getValue()) {
                    //     // debugger;
                    //     oFilter = new Filter({
                    //         filters : [
                    //             new Filter({ path:'docnum', operator:'Contains', value1: sFilter1}),
                    //             new Filter({ path:'prfdate', operator:'BT', value1: oDateRange.getFrom(), value2 : oDateRange.getTo()})
                    //         ],
                    //         and : true
                    //     });
                    //     // oFilter = new Filter('docnum', 'con', oComboBox1.getSelectedKey());
                    // };
                    // oTable.bindItems ("slipBefore>/list", oFilter );
                    // getBinding("slipBefore").filter(oFilter);
                    // this.byId("idViewChart").setVizType(oComboBox2.getSelectedKey());
                // }else{
                //     oComboBox2.setValueState("Error");
                // }
            },
            onDetailBtn :function(oEvent){
                // debugger;
                var oSelectData = oEvent.getSource().getParent().getRowBindingContext().getObject();
                var aSlipHData = this.oslipH.getData().hlist;
                var aSlipIData = this.oslipI.getData().ilist;
                var aSlipBeforeData = this.oSlipBefore.getData().blist;
                var aSlipidatas = [];
                for(var i = 0; i < aSlipHData.length; i++){
                    if(aSlipHData[i].docnum == oSelectData.docnum){
                        this.oslipH.setProperty("/select",aSlipHData[i]);
                        this.oslipH.setProperty("/selectBefore",aSlipBeforeData[i]);

                        for(var j = 0; j < aSlipIData.length ; j++){
                            if(aSlipIData[j].slipid == aSlipHData[i].slipid){
                                aSlipidatas.push(aSlipIData[j]);
                            }
                        }
                        this.oslipI.setProperty("/select",aSlipidatas);
                        break;
                    };
                    // console.log(i);
                }
                // debugger;

                var oDialog = this.byId("DetailDialog"); //DialogID

                if (oDialog){
                    oDialog.open();
                    return;                    
                }
                
                this.loadFragment({
                    name: "ER.zferslip.view.fragment.Detail"
                }).then(function(oDialog){
                    oDialog.open();
                    // debugger;
                },this);
            },
            onClose: function(oEvent){
                var oDialog = oEvent.getSource().getParent(); //Dialog        
                // var oDialog = this.byId("ProductsDialog");      
                oDialog.close();
            }
        });
    });
