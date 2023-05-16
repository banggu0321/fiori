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
                var tabledatas = {
                    list :[
                        // {
                        //     status : "미완료",
                        //     docnum : "CWN11111111",
                        //     partid : "PAT00",
                        //     sliptype : "AA",
                        //     prfdate : "20230516",
                        //     amount : "1000000",
                        //     curkey : "KRW"
                        // }
                    ]
                };
                // debugger;
                this.getView().setModel(new JSONModel(typedatas),"typeList"); //전표유형
                this.getView().setModel(new JSONModel(tabledatas),"slipBefore"); //table
                this.getView().setModel(new JSONModel(tabledatas),"slipBefore"); //table
                
                this._defaultSet();
                this._getdata();

                // let oo = this.getOwnerComponent().getModel().getObject("/employeeSet");
                // console.log(oo);

                this.getOwnerComponent().getModel().read("/employeeSet", {
                    success: function(oReturn) {
                        this.byId("idAtUserName").setText(`${oReturn.results[0].Name}(${oReturn.results[0].Employeeid})`);
                        this.byId("idAtDept").setText(`${oReturn.results[0].Deptname}`);
                        this.byId("idLabeluname").setText(`${oReturn.results[0].Deptname} ${oReturn.results[0].Name}(${oReturn.results[0].Employeeid})`);
                    }.bind(this)
                });
                
            },
            _defaultSet: function(){
                // odata model 변수 세팅
                this.oModel = this.getOwnerComponent().getModel(); //oData
                //json model 변수 세팅
                this.oSlipBefore = this.getView().getModel("slipBefore"); //main
                //table객체 
                this.oTable = this.byId("idSlipbeforeTable");
            },
            _getdata :function(){
                var tabledatas = [];
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
                            snum += 1;
                        };
                        this.oSlipBefore.setProperty("/list",tabledatas);
                        this.byId("idObjNum").setNumber(snum);
                        // debugger;
                        // this.oSlipBefore.setpr
                        // sap.m.MessageToast.show("삭제되었습니다.");
                    }.bind(this)
                });

                var sPath = "/rentalSet";
                tabledatas = [];
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
                            snum += 1;
                        };
                        this.oSlipBefore.setProperty("/list",tabledatas);
                        this.byId("idObjNum").setNumber(snum);
                        // debugger;
                        // this.oSlipBefore.setpr
                        // sap.m.MessageToast.show("삭제되었습니다.");
                    }.bind(this)
                });
                
                var sPath = "/autoSet";   // '/auto'
                tabledatas = [];
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
                            snum += 1;
                        };
                        this.oSlipBefore.setProperty("/list",tabledatas);
                        this.byId("idObjNum").setNumber(snum);
                        // this.oSlipBefore.setpr
                        // sap.m.MessageToast.show("삭제되었습니다.");
                    }.bind(this)
                });
            },
            onSearch: function(){
                // debugger;
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
                    
                    oTable.getBinding("items").filter(aFilter);
                   
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
            onDetailBtn :function(){
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
