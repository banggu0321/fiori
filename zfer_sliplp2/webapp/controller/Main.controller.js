sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/json/JSONModel",
    'sap/m/MessageToast', 
    "sap/ui/core/Fragment"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Filter, JSONModel, MessageToast, Fragment) {
        "use strict";

        return Controller.extend("ER.zfersliplp2.controller.Main", {
            formatter: {
                dateTime: function(oDate) {
                    let oDateTimeInstance;

                    oDateTimeInstance = sap.ui.core.format.DateFormat.getDateTimeInstance({
                        pattern : 'yyyy-MM-dd'
                    });

                    return oDateTimeInstance.format(oDate);
                },
                dateTime2: function(sDate) {
                    if(sDate !== undefined){
                        // debugger;
                        return sDate.slice(0,4) + '-' + sDate.slice(4, 6) + '-' + sDate.slice(6,8);
                    }
                    
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
                this.getView().setModel(new JSONModel(typedatas),"typeList"); //전표유형
                this.getView().setModel(new JSONModel(),"slipBefore"); //table
                this.getView().setModel(new JSONModel(),"slipH"); //table -> 전체 배열 [ {}, {}, {}]
                this.getView().setModel(new JSONModel(),"slipI"); //table -> [ obj{ [item] [item] [item]}, , ]
                
                this._defaultSet();
                this.todaydate = this.getToday();

                this.getOwnerComponent().getModel().read("/employeeSet", {
                    success: function(oReturn) {
                        this.empid = oReturn.results[0].Employeeid;
                        this.byId("idEmp").setText('사번 : '+oReturn.results[0].Employeeid);
                        this.byId("idDept").setText('부서 : '+oReturn.results[0].Deptname);
                        this.byId("idName").setText('이름 : '+ oReturn.results[0].Name + " " +oReturn.results[0].Rankname);
                        this.byId("idTel").setText(
                            oReturn.results[0].Telno.substr(0, 3) +"-" +oReturn.results[0].Telno.substr(4, 4) +"-" +oReturn.results[0].Telno.substr(7, 4));
                        this.byId("idEmail").setText(oReturn.results[0].Email);
                        // this.byId("idAtUserName").setText(`${oReturn.results[0].Name}(${this.empid})`);
                        // this.byId("idAtDept").setText(`${oReturn.results[0].Deptname}`);
                        this.byId("idLabeluname").setText(`${oReturn.results[0].Deptname} ${oReturn.results[0].Name} ${oReturn.results[0].Rankname}(${oReturn.results[0].Employeeid})`);
                    }.bind(this)
                });
                this._getdata();
            },
            _defaultSet : function(){
                // odata model 변수 세팅
                this.oModel = this.getOwnerComponent().getModel(); //oData
                this.oModel.setUseBatch(false);
                //json model 변수 세팅
                this.oSlipBefore = this.getView().getModel("slipBefore"); //slipBefore
                //json model 변수 세팅
                this.oslipH = this.getView().getModel("slipH"); //slipH
                //json model 변수 세팅
                this.oslipI = this.getView().getModel("slipI"); //slipI
                //table객체 
                this.oTable = this.byId("idSlipbeforeTable");
            },
            _getdata : function(){
                this.oSlipBefore.setData({});
                this.oslipH.setData({});
                this.oslipI.setData({});

                var tabledatas = [];
                var sliphdatas = [];
                var slipidatas = [];
                var snum = 0;

                var sPath = "/wbatsofSet"; 
                this.oModel.read(sPath,{ 
                    success:function(oReturn){
                        // debugger;
                        console.log("wbatso데이터성공");
                        for(var i = 0 ; i < oReturn.results.length; i++){
                            var sStatus;
                            if(oReturn.results[i].Indate < new Date(new Date().getFullYear(), new Date().getMonth(), 1)){
                                sStatus = "Necessary";
                            }else{
                                sStatus = "Irrelevant"; //Irrelevant
                            }
                            // debugger;
                            tabledatas.push({
                                Status : sStatus,
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
                                Pstdate : this.todaydate,
                                Managerid : this.empid,
                                Partid : oReturn.results[i].Partnerid,
                                Partname : oReturn.results[i].Partname
                            });
                            slipidatas.push({
                                Slipid : 'BON'+i,
                                Docnum : oReturn.results[i].Batterysoid,
                                Prnum : '01',
                                Accocode : '101',
                                Acconm : '현금',
                                Dcindicator : '3',
                                Amt : Number(oReturn.results[i].Amt),
                                Tax : 0,
                                Curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                Slipid : 'BON'+i,
                                Docnum : oReturn.results[i].Batterysoid,
                                Prnum : '02',
                                Accocode : '401',
                                Acconm : '상품매출',
                                Dcindicator : '4',
                                Amt : Number(oReturn.results[i].Amt) * 0.9,
                                Tax : 0,
                                Curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                Slipid : 'BON'+i,
                                Docnum : oReturn.results[i].Batterysoid,
                                Prnum : '03',
                                Accocode : '255',
                                Acconm : '부가세예수금',
                                Dcindicator : '4',
                                Amt : 0,
                                Tax : Number(oReturn.results[i].Amt) * 0.1,
                                Curkey : oReturn.results[i].Curkey
                            });
                            this.oslipI.setProperty("/ilist",slipidatas);
                            snum += 1;
                        };
                        this.oSlipBefore.setProperty("/blist",tabledatas);
                        this.oslipH.setProperty("/hlist",sliphdatas);
                        this.byId("idObjNum").setNumber(snum);
                        this._sortStatus();
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
                            var sStatus;
                            if(oReturn.results[i].Fdate < new Date(new Date().getFullYear(), new Date().getMonth(), 1)){
                                sStatus = "Necessary";
                            }else{
                                sStatus = "Irrelevant";
                            }
                            // debugger;
                            tabledatas.push({
                                Status : sStatus,
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
                                Pstdate : this.todaydate,
                                Managerid : this.empid,
                                Partid : oReturn.results[i].Partnerid,
                                Partname : oReturn.results[i].Partname
                            });
                            
                            slipidatas.push({
                                Slipid : 'REN'+i,
                                Docnum : oReturn.results[i].Rentalid,
                                Prnum : '01',
                                Accocode : '102',
                                Acconm : '당좌예금',
                                Dcindicator : '3',
                                Amt : Number(oReturn.results[i].Retfee) + Number(oReturn.results[i].Drivfee),
                                Tax : 0,
                                Curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                Slipid : 'REN'+i,
                                Docnum : oReturn.results[i].Rentalid,
                                Prnum : '02',
                                Accocode : '830',
                                Acconm : '소모품비',
                                Dcindicator : '4',
                                Amt : ( Number(oReturn.results[i].Retfee) + Number(oReturn.results[i].Drivfee) ) * 0.9,
                                Tax : 0,
                                Curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                Slipid : 'REN'+i,
                                Docnum : oReturn.results[i].Rentalid,
                                Prnum : '03',
                                Accocode : '135',
                                Acconm : '부가세대급금',
                                Dcindicator : '4',
                                Amt : 0,
                                Tax : ( Number(oReturn.results[i].Retfee) + Number(oReturn.results[i].Drivfee) ) * 0.1,
                                Curkey : oReturn.results[i].Curkey
                            });
                            this.oslipI.setProperty("/ilist",slipidatas);
                            snum += 1;
                        };
                        this.oSlipBefore.setProperty("/blist",tabledatas);
                        this.oslipH.setProperty("/hlist",sliphdatas);
                        this.byId("idObjNum").setNumber(snum);
                        this._sortStatus();
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
                            var sStatus;
                            if(oReturn.results[i].Autodat < new Date(new Date().getFullYear(), new Date().getMonth(), 1)){
                                sStatus = "Necessary";
                            }else{
                                sStatus = "Irrelevant";
                            }
                            // debugger;
                            tabledatas.push({
                                Status : sStatus,
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
                                Pstdate : this.todaydate,
                                Managerid : this.empid,
                                Partid : oReturn.results[i].Partid,
                                Partname : oReturn.results[i].Partname
                            });
                            
                            slipidatas.push({
                                Slipid : 'MON'+i,
                                Docnum : oReturn.results[i].Autonum,
                                Prnum : '01',
                                Accocode : '102',
                                Acconm : '당좌예금',
                                Dcindicator : '4',
                                Amt : Number(oReturn.results[i].Amount),
                                Tax : 0,
                                Curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                Slipid : 'MON'+i,
                                Docnum : oReturn.results[i].Autonum,
                                Prnum : '02',
                                Accocode : '830',
                                Acconm : '소모품비',
                                Dcindicator : '3',
                                Amt : Number(oReturn.results[i].Amount) * 0.9,
                                Tax : 0,
                                Curkey : oReturn.results[i].Curkey
                            });
                            slipidatas.push({
                                Slipid : 'MON'+i,
                                Docnum : oReturn.results[i].Autonum,
                                Prnum : '03',
                                Accocode : '135',
                                Acconm : '부가세대급금',
                                Dcindicator : '3',
                                Amt : 0,
                                Tax : Number(oReturn.results[i].Amount) * 0.1,
                                Curkey : oReturn.results[i].Curkey
                            });
                            this.oslipI.setProperty("/ilist",slipidatas);
                            snum += 1;
                        };
                        this.oSlipBefore.setProperty("/blist",tabledatas);
                        this.oslipH.setProperty("/hlist",sliphdatas);
                        this.byId("idObjNum").setNumber(snum);
                        this._sortStatus();
                    }.bind(this)
                });
                // debugger;
            },
            _sortStatus:function(){
                this.oSlipBefore.getData().blist.sort(function(a, b) {
                    return b.Status.localeCompare(a.Status);
                });
                this.oSlipBefore.setData(this.oSlipBefore.getData().blist);
            },
            getToday : function(){
                var date = new Date();
                var year = date.getFullYear();
                var month = ("0" + (1 + date.getMonth())).slice(-2);
                var day = ("0" + date.getDate()).slice(-2);
            
                return year + month + day;
            },
            onSearch: function(){
                var oComboBox = this.byId("idComboBox1");
                var oDateRange = this.byId("idDateRangeSelection");
                // var oTable = this.byId("idSlipbeforeTable");
                var aFilter = [];
                var sFilter1 = '';

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
                
                this.oTable.getBinding("rows").filter(aFilter);
                   
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
                var oSelectData ;
                var oColumn = oEvent.getSource().getParent();
                var oTable = oColumn.getParent();
                var oBindingInfo = oTable.getBindingInfo("rows");
              
                if (oBindingInfo) {
                  var iRowIndex = oTable.indexOfRow(oColumn);
              
                  if (iRowIndex !== -1) {
                    oSelectData = oTable.getContextByIndex(iRowIndex).getObject();
                  }
                }
                // var oSelectData = oEvent.getSource().getParent().getRowBindingContext().getObject();
                var aSlipHData = this.oslipH.getData().hlist;
                var aSlipIData = this.oslipI.getData().ilist;
                var aSlipBeforeData = this.oSlipBefore.getData().blist;
                var aSlipidatas = [];

                var selectedIndices = this.oTable.getSelectedIndices();
                selectedIndices.push(oEvent.getSource().getParent().getIndex());
                selectedIndices.forEach(function(item){
                    this.oTable.addSelectionInterval(selectedIndices[item], selectedIndices[item]);
                }.bind(this));
                // this.oTable.addSelectionInterval(selectedIndices[0], selectedIndices[selectedIndices.length - 1]);
                // debugger;

                // this.oTable.setSelectedIndex(oEvent.getSource().getParent().getIndex());
                for(var i = 0; i < aSlipHData.length; i++){
                    if(aSlipHData[i].Docnum == oSelectData.Docnum){
                        this.oslipH.setProperty("/select",aSlipHData[i]);
                        this.oslipH.setProperty("/selectBefore",aSlipBeforeData[i]);
                        this.sRollbackAmt = aSlipBeforeData[i].Amount;

                        for(var j = 0; j < aSlipIData.length ; j++){
                            if(aSlipIData[j].Slipid == aSlipHData[i].Slipid){
                                aSlipidatas.push(aSlipIData[j]);
                            }
                        }
                        this.oslipI.setProperty("/select",aSlipidatas);
                        break;
                    };
                }

                var oDetailDialog = this.byId("DetailDialog"); //DialogID
                var oView = this.getView();

                if(!oDetailDialog){
                    Fragment.load({
                        id: oView.getId(),
                        name: "ER.zfersliplp2/view/fragment/Detail",
                        controller: this
                    }).then(function(oDialog){
                        oView.addDependent(oDialog);
                        oDialog.open();
                    })
                }else{
                    oDetailDialog.open();
                    var oDTable = this.byId("idSlipDetailTable");
                    oDTable.unbindRows();
                    oDTable.bindRows("slipI>/select");
                    return;                    
                }

                // if (oDialog){
                //     oDialog.open();
                //     var oDTable = this.byId("idSlipDetailTable");
                //     oDTable.unbindRows();
                //     oDTable.bindRows("slipI>/select");
                //     return;                    
                // }
                
                // this.loadFragment({
                //     name: "ER.zfersliplp2.view.fragment.Detail"
                // }).then(function(oDialog){
                //     oDialog.open();
                //     // debugger;
                // },this);
            },
            onClose: function(oEvent){
                this._popupconfirm("변경 사항을 취소", function (bConfirm) {
                    if (bConfirm) {
                      var oDialog = this.byId("DetailDialog"); //Dialog 
                      var oTable = this.byId("idSlipDetailTable");
                      var index = oTable.getSelectedIndices();
                  
                      for (var j = index.length - 1; j >= 0; j--) {
                        oTable.getRows()[index[j]].getCells()[2].setEnabled(false);
                        oTable.getRows()[index[j]].getCells()[3].setEnabled(false);
                        oTable.getRows()[index[j]].getCells()[2].setValueState('None');
                        oTable.getRows()[index[j]].getCells()[3].setValueState('None');
                      }
                    //   debugger;
                      this.byId("idTotalAmt").setValue(this.sRollbackAmt);
                      oDialog.close();
                      MessageToast.show("변경 취소");
                      oTable.clearSelection();
                    }
                }.bind(this));
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
                if(aRows[rowIndex] != undefined){
                    if(aRows[rowIndex].getCells()[2].getValueState() === 'Error' 
                        || aRows[rowIndex].getCells()[3].getValueState() === 'Error' ){
                    }else{
                        if (aSelectedIndices.indexOf(rowIndex) < 0) {
                            aRows[rowIndex].getCells()[2].setEnabled(false);
                            aRows[rowIndex].getCells()[3].setEnabled(false);
                        };
                    }
                }
                
            },
            onSave : function(oEvent){
                this._popupconfirm("변경 사항을 저장", function (bConfirm) {
                    if (bConfirm) {
                        var oTable = this.byId("idSlipDetailTable");
                        var aSelectidata = this.oslipI.getData().select;
                        // var aSelecthdata = this.oslipH.getData().select;
                        // var aSlipHData = this.oslipH.getData().blist;
                        var aSlipIData = this.oslipI.getData().ilist;
                        let index = oTable.getSelectedIndices();
                        var sError = 0;

                        for(var i = 0; i < oTable.getRows().length; i++){
                            for(var j = 2; j <= 3; j++){
                                var sState = oTable.getRows()[i].getCells()[j].getValueState();
                                if(sState === 'Error'){
                                    sError += 1;
                                }
                            }
                        }

                        if(sError > 0){
                            MessageToast.show("총액을 확인하세요");
                        }else{
                            for(var i = 0; i < aSelectidata.length; i++){
                                for(var j = 0 ; j < aSlipIData.length ; j++){
                                    if(aSlipIData[j].Slipid === aSelectidata[i].Slipid && aSlipIData[j].Prnum === aSelectidata[i].Prnum){
                                        for(var k = 2 ; k <= 3 ; k++){
                                            var ocell = oTable.getRows()[i].getCells()[k];
                                            var sAmountValue = ocell.getValue(); 
                                            if(sAmountValue != 0){
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
                            // wow head엔 총액이 안들어가!
                            // for(var l = 0; l < aSlipHData.length; l++){
                            //     if(aSlipHData[l].slip === aSelecthdata.Slipid){
                            //         aSelecthdata.Amt = 
                            //     }
                            // }

                            var oDialog = this.byId("DetailDialog"); //Dialog    
                            var sDocnum = this.byId("idDocnum").getValue();    
                            var sTotalValue = this.byId("idTotalAmt").getValue();    
                            var aSlipBefore = this.oSlipBefore.getData().blist;
                            // debugger;
                            // var oDialog = this.byId("ProductsDialog");      
                            for(var j = index.length - 1 ; j >= 0 ; j--){
                                oTable.getRows()[index[j]].getCells()[2].setEnabled(false);
                                oTable.getRows()[index[j]].getCells()[3].setEnabled(false);
                            };
                            for(var k = 0; k <aSlipBefore.length; k++){
                                if(aSlipBefore[k].Docnum === sDocnum){
                                    aSlipBefore[k].Amount = sTotalValue;
                                    break;
                                }
                            };

                            oDialog.close();
                            MessageToast.show("변경 저장");
                            oTable.clearSelection();
                            var oBeforeTable = this.byId("idSlipbeforeTable");
                            oBeforeTable.unbindRows();
                            oBeforeTable.bindRows("slipBefore>/blist");
                        }
                    }
                }.bind(this));
            },
            _popupconfirm: function (sSaveCancel, callback) {
                var dialog = new sap.m.Dialog({
                  title: "확인",
                  type: sap.m.DialogType.Message,
                  content: new sap.m.Text({
                    text : sSaveCancel + "하시겠습니까?"
                  }),
                  beginButton: new sap.m.Button({
                    text: "예",
                    press: function () {
                      // 저장 버튼을 눌렀을 때의 동작 처리
                      dialog.close();
                      callback(true);
                    }
                  }),
                  endButton: new sap.m.Button({
                    text: "아니오",
                    press: function () {
                      // 취소 버튼을 눌렀을 때의 동작 처리
                      dialog.close();
                      callback(false);
                    }
                  }),
                  afterClose: function () {
                    dialog.destroy();
                  }
                });
                dialog.open();
            },
            onChange : function(oEvent){
                var sAmount3 = 0;
                var sAmount4 = 0;
                var oTable = this.byId("idSlipDetailTable");

                for(var i = 0; i < oTable.getRows().length; i++){
                    sAmount3 += Number(oTable.getRows()[i].getCells()[2].getValue());
                    sAmount4 += Number(oTable.getRows()[i].getCells()[3].getValue());
                }

                // debugger;
                if(sAmount3 === sAmount4){
                    this.byId("idTotalAmt").setValue(sAmount3);
                    for(var i = 0; i < oTable.getRows().length; i++){
                        oTable.getRows()[i].getCells()[2].setValueState('None');
                        oTable.getRows()[i].getCells()[3].setValueState('None');
                    }
                    MessageToast.show("총액이 변경되었습니다.");
                }else{
                    oEvent.getSource().setValueState('Error');
                    oEvent.getSource().setValueStateText("금액을 맞춰주세요");
                }
            },
            onPressAcceptBtn : function(){
                this._popupconfirm("전표를 생성", function (bConfirm) {
                    if (bConfirm) {
                        // var aSlipHData = this.oslipH.getData().hlist;
                        // var aSlipIData = this.oslipI.getData().ilist;
                        var oSlipCreateHData , oSlipCreateIData;
                        var oSlipReadHData ;
                        var sError = 0;
                        var promises = [];
        
                        // debugger;
                        let index = this.oTable.getSelectedIndices(); // [0,4,7]
        
                        if (index.length === 0) {
                            MessageToast.show("행을 선택해주세요!");
                            return;
                        }
        
                        for(var i = 0; i < index.length; i++){
                            let sPath = this.oTable.getContextByIndex(index[i]).getPath();
                            let skey = Number(sPath.substr(7));
        
                            // 
                            var oSlipCreateBData = this.oSlipBefore.getData().blist[skey];

                            for(var k = 0; k < this.oslipH.getData().hlist.length; k++){
                                if(this.oslipH.getData().hlist[k].Docnum === oSlipCreateBData.Docnum ){
                                    oSlipCreateHData = this.oslipH.getData().hlist[k];
                                    break;
                                }
                            }
                            debugger;
                            // oSlipCreateHData = this.oSlipBefore.getData().blist[skey];
                            
                            oSlipCreateHData.Prfdate = new Date(oSlipCreateHData.Prfdate);
                            oSlipCreateHData.Pstdate = new Date();
        
                            // create head
                            var promise = new Promise(function(resolve, reject) {
                                this.oModel.create("/sliphfSet", oSlipCreateHData, {
                                    success: function(oReturn){
                                        console.log("create head");
                                        oSlipReadHData = oReturn;
                                        for(var j = 0; j < this.oslipI.getData().ilist.length; j++){
                                            if(this.oslipI.getData().ilist[j].Docnum === oSlipReadHData.Docnum){
                                                oSlipCreateIData = this.oslipI.getData().ilist[j];
                                                oSlipCreateIData.Slipid = oSlipReadHData.Slipid;
                                                oSlipCreateIData.Amt = String(oSlipCreateIData.Amt);
                                                oSlipCreateIData.Tax = String(oSlipCreateIData.Tax);
        
                                                this.oModel.create("/slipifSet", oSlipCreateIData, {
                                                    success: function(){
                                                        console.log("Create item uccess!!");
                                                    },
                                                    error: function(){
                                                        console.log("Item Error~!");
                                                        sError += 1;
                                                    }
                                                });
                                            }
                                        };
                                        resolve();
                                    }.bind(this),
                                    error : function(){
                                        sError += 1;
                                        reject(); 
                                        // sap.m.MessageToast.show("Head Error~!");
                                        // debugger;
                                    }
                                });
                            }.bind(this));
                            promises.push(promise);
                        }
                        Promise.all(promises).then(function() {
                            console.log(sError);
        
                            if(sError > 0){
                                // debugger;
                                MessageToast.show("전표 생성 에러");
                            }else{
                                MessageToast.show("전표 생성 완료");
                                this._getdata();
                                this.oSlipBefore.refresh();
                                this.oTable.clearSelection();
                            }
                        }.bind(this));
                    }
                }.bind(this));
            },
            SelectRequiredIndices : function(){
                var oComboBox = this.byId("idComboBox1");
                var oDateRange = this.byId("idDateRangeSelection");
                // var oSColumn = this.byId("statusColumn");
                var oPColumn = this.byId("PrfdateColumn");
                oComboBox.setSelectedKey("");
                oDateRange.setValue("");
                this.oTable.unbindRows();
                this.oTable.bindRows("slipBefore>/blist");

                // this.oTable.sort(oSColumn, sap.ui.table.SortOrder.Descending, false);
                this.oTable.sort(oPColumn, sap.ui.table.SortOrder.Ascending, false);

                var aData = this.oTable.getBinding().getModel().getProperty("/");
                var aSelectedRows = [];

                for (var i = 0; i < aData.length; i++) {
                  if (aData[i].Status === 'Necessary') {
                    aSelectedRows.push(aData[i]);
                    this.oTable.addSelectionInterval(i, i);
                  }
                }
            },
            clearAllSortings: function(oEvent) {
                this.oTable.getBinding().sort(null);
                this._resetSortingState();
            },
            _resetSortingState: function() {
                var aColumns = this.oTable.getColumns();
                for (var i = 0; i < aColumns.length; i++) {
                    aColumns[i].setSorted(false);
                }
                this.byId("idComboBox1").setSelectedKey("");
                this.byId("idDateRangeSelection").getValue("");
                this.onSearch();
            },
            clearSelection : function(){
                this.oTable.clearSelection();
            }
        });
    });
