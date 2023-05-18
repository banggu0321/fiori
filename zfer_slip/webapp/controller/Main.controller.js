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

                var sPath = "/wbatsofSet";   // '/auto'
                this.oModel.read(sPath,{ 
                    success:function(oReturn){
                        // debugger;
                        console.log("wbatso데이터성공");
                        for(var i = 0 ; i < oReturn.results.length; i++){
                            // debugger;
                            tabledatas.push({
                                Status : "미완료",
                                Docnum : oReturn.results[i].Batterysoid,
                                Partid : oReturn.results[i].Partnerid,
                                Partname : oReturn.results[i].Partname,
                                Sliptype : oReturn.results[i].Sliptype,
                                Sliptypedesc : oReturn.results[i].Sliptypedesc,
                                Prfdate : oReturn.results[i].Indate,
                                Amount : oReturn.results[i].Amt,
                                Curkey : oReturn.results[i].Curkey
                            });
                            sliphdatas.push({
                                Slipid : 'BON'+i,
                                Docnum : oReturn.results[i].Batterysoid,
                                Sliptype : oReturn.results[i].Sliptype,
                                Sliptypedesc : oReturn.results[i].Sliptypedesc,
                                Prfdate : oReturn.results[i].Indate,
                                Pdtdate : this.todaydate,
                                Managerid : this.empid,
                                Partid : oReturn.results[i].Partnerid,
                                Partname : oReturn.results[i].Partname
                            });
                            this.oslipH.setProperty("/hlist",sliphdatas);
                            
                            slipidatas.push({
                                Slipid : 'BON'+i,
                                Prnum : '01',
                                Accocode : '101',
                                Acconm : 'aa',
                                Dcindicator : '3',
                                Amt : Number(oReturn.results[i].Amt),
                                Tax : 0,
                                Curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                Slipid : 'BON'+i,
                                Prnum : '02',
                                Accocode : '401',
                                Acconm : 'aa',
                                Dcindicator : '4',
                                Amt : Number(oReturn.results[i].Amt) * 0.9,
                                Tax : 0,
                                Curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                Slipid : 'BON'+i,
                                Prnum : '03',
                                Accocode : '225',
                                Acconm : 'aa',
                                Dcindicator : '4',
                                Amt : 0,
                                Tax : Number(oReturn.results[i].Amt) * 0.1,
                                Curkey : oReturn.results[i].Curkey
                            });
                            this.oslipI.setProperty("/ilist",slipidatas);
                            snum += 1;
                        };
                        this.oSlipBefore.setProperty("/blist",tabledatas);
                        this.byId("idObjNum").setNumber(snum);
                    }.bind(this)
                });

                var sPath = "/rentalfSet";
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
                                Status : "미완료",
                                Docnum : oReturn.results[i].Rentalid,
                                Partid : oReturn.results[i].Partnerid,
                                Partname : oReturn.results[i].Partname,
                                Sliptype : oReturn.results[i].Sliptype,
                                Sliptypedesc : oReturn.results[i].Sliptypedesc,
                                Prfdate : oReturn.results[i].Fdate,
                                Amount : Number(oReturn.results[i].Retfee) + Number(oReturn.results[i].Drivfee),
                                Curkey : oReturn.results[i].Curkey
                            });
                            
                            sliphdatas.push({
                                Slipid : 'REN'+i,
                                Docnum : oReturn.results[i].Rentalid,
                                Sliptype : oReturn.results[i].Sliptype,
                                Sliptypedesc : oReturn.results[i].Sliptypedesc,
                                Prfdate : oReturn.results[i].Fdate,
                                Pdtdate : this.todaydate,
                                Managerid : this.empid,
                                Partid : oReturn.results[i].Partnerid,
                                Partname : oReturn.results[i].Partname
                            });
                            this.oslipH.setProperty("/hlist",sliphdatas);
                            
                            slipidatas.push({
                                Slipid : 'REN'+i,
                                Prnum : '01',
                                Accocode : '102',
                                Acconm : 'aa',
                                Dcindicator : '3',
                                Amt : Number(oReturn.results[i].Retfee) + Number(oReturn.results[i].Drivfee),
                                Tax : 0,
                                Curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                Slipid : 'REN'+i,
                                Prnum : '02',
                                Accocode : '830',
                                Acconm : 'aa',
                                Dcindicator : '4',
                                Amt : ( Number(oReturn.results[i].Retfee) + Number(oReturn.results[i].Drivfee) ) * 0.9,
                                Tax : 0,
                                Curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                Slipid : 'REN'+i,
                                Prnum : '03',
                                Accocode : '135',
                                Acconm : 'aa',
                                Dcindicator : '4',
                                Amt : 0,
                                Tax : ( Number(oReturn.results[i].Retfee) + Number(oReturn.results[i].Drivfee) ) * 0.1,
                                Curkey : oReturn.results[i].Curkey
                            });
                            this.oslipI.setProperty("/ilist",slipidatas);
                            snum += 1;
                        };
                        this.oSlipBefore.setProperty("/blist",tabledatas);
                        this.byId("idObjNum").setNumber(snum);
                    }.bind(this)
                });
                
                var sPath = "/autofSet";   // '/auto'
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
                                Status : "미완료",
                                Docnum : oReturn.results[i].Autonum,
                                Partid : oReturn.results[i].Partid,
                                Partname : oReturn.results[i].Partname,
                                Sliptype : oReturn.results[i].Sliptype,
                                Sliptypedesc : oReturn.results[i].Sliptypedesc,
                                Prfdate : oReturn.results[i].Autodat,
                                Amount : oReturn.results[i].Amount,
                                Curkey : oReturn.results[i].Curkey
                            });
                            
                            sliphdatas.push({
                                Slipid : 'MON'+i,
                                Docnum : oReturn.results[i].Autonum,
                                Sliptype : oReturn.results[i].Sliptype,
                                Sliptypedesc : oReturn.results[i].Sliptypedesc,
                                Prfdate : oReturn.results[i].Autodat,
                                Pdtdate : this.todaydate,
                                Managerid : this.empid,
                                Partid : oReturn.results[i].Partid,
                                Partname : oReturn.results[i].Partname
                            });
                            this.oslipH.setProperty("/hlist",sliphdatas);
                            
                            slipidatas.push({
                                Slipid : 'MON'+i,
                                Prnum : '01',
                                Accocode : '102',
                                Acconm : 'aa',
                                Dcindicator : '4',
                                Amt : Number(oReturn.results[i].Amount),
                                Tax : 0,
                                Curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                Slipid : 'MON'+i,
                                Prnum : '02',
                                Accocode : '830',
                                Acconm : 'aa',
                                Dcindicator : '3',
                                Amt : Number(oReturn.results[i].Amount) * 0.9,
                                Tax : 0,
                                Curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                Slipid : 'MON'+i,
                                Prnum : '03',
                                Accocode : '135',
                                Acconm : 'aa',
                                Dcindicator : '3',
                                Amt : 0,
                                Tax : Number(oReturn.results[i].Amount) * 0.1,
                                Curkey : oReturn.results[i].Curkey
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
                        aFilter.push(new Filter("Docnum", "Contains", sFilter1));
                        // debugger;
                    };
                    // debugger;
                    if (oDateRange.getValue()){
                        aFilter.push(new Filter("Prfdate", "BT", oDateRange.getFrom(), oDateRange.getTo()));
                        // debugger;
                    };
                    
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
                    if(aSlipHData[i].Docnum == oSelectData.Docnum){
                        this.oslipH.setProperty("/select",aSlipHData[i]);
                        this.oslipH.setProperty("/selectBefore",aSlipBeforeData[i]);

                        for(var j = 0; j < aSlipIData.length ; j++){
                            if(aSlipIData[j].Slipid == aSlipHData[i].Slipid){
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
                var oTable = this.byId("idSlipDetailTable");
                let index = oTable.getSelectedIndices();

                for(var j = index.length - 1 ; j >= 0 ; j--){
                    oTable.getRows()[index[j]].getCells()[2].setEnabled(false);
                    oTable.getRows()[index[j]].getCells()[3].setEnabled(false);
                };
                
                oDialog.close();
                oTable.clearSelection();
                
                // debugger;
            },
            onSelectionChange :function(oEvent){
                var oTable = oEvent.getSource();
                var aSelectedIndices = oTable.getSelectedIndices();
                var aRows = oTable.getRows();
                var aSelectidata = this.oslipI.getData().select;

                // debugger;

                // Table 내에서 선택된 Row 일괄 enabled = true 설정
                aSelectedIndices.forEach(function (item) {
                    if(aSelectidata[item].Dcindicator === '3'){
                        aRows[item].getCells()[2].setEnabled(true);
                    } else{
                        aRows[item].getCells()[3].setEnabled(true);
                    }
                });

                // 만약 Check를 풀었을 때, Table 선택된 Indices 에 포함되어 있지 않으면 풀었다는 거니까 enabled = false 설정
                var rowIndex = oEvent.getParameters().rowIndex;
                if (aSelectedIndices.indexOf(rowIndex) < 0) {
                    for(var i = 2 ; i <= 3 ; i++){
                        aRows[rowIndex].getCells()[i].setEnabled(false);
                        // var ocell = this.oTable.getRows()[rowIndex].getCells()[i];  //aRows[rowIndex].getCells()[4].setEnabled(false);
                        // var sAmountValue = ocell.getValue(); 
                        //  = sAmountValue
                    }
                };
            },
            onSave : function(oEvent){
                var oTable = this.byId("idSlipDetailTable");
                var aSelectidata = this.oslipI.getData().select;
                var aSlipIData = this.oslipI.getData().ilist;
                let index = oTable.getSelectedIndices();

                for(var i = 0; i < aSelectidata.length; i++){
                    for(var j = 0 ; j < aSlipIData.length ; j++){
                        if(aSlipIData[j].Slipid === aSelectidata[i].Slipid && aSlipIData[j].Prnum === aSelectidata[i].Prnum){
                            for(var k = 2 ; k <= 3 ; k++){
                                // aRows[rowIndex].getCells()[i].setEnabled(false);
                                // debugger;
                                var ocell = oTable.getRows()[i].getCells()[k];  //aRows[rowIndex].getCells()[4].setEnabled(false);
                                var sAmountValue = ocell.getValue(); 
                                if(sAmountValue != 0){
                                    // console.log(i, j, k);
                                    // console.log(sAmountValue);
                                    // aSelectidata = sAmountValue
                                    if(aSlipIData[j].Amt == 0 ){ ///tax
                                        aSlipIData[j].Tax = sAmountValue;
                                    } else {
                                        aSlipIData[j].Amt = sAmountValue;
                                    }
                                }
                            }
                        }
                    }
                };
                var oDialog = oEvent.getSource().getParent(); //Dialog        
                // var oDialog = this.byId("ProductsDialog");      
                for(var j = index.length - 1 ; j >= 0 ; j--){
                    oTable.getRows()[index[j]].getCells()[2].setEnabled(false);
                    oTable.getRows()[index[j]].getCells()[3].setEnabled(false);
                };
                oDialog.close();
                oTable.clearSelection();
                
            }
        });
    });
