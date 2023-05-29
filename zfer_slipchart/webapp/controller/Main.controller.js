sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/ui/model/Filter"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, FlattenedDataset, FeedItem, Filter) {
        "use strict";

        return Controller.extend("ER.zferslipchart.controller.Main", {
            onInit: function () {
                
                // this.aPartnerAll = [];
                this.getView().setModel(new JSONModel(),"slipAll");
                this.getView().setModel(new JSONModel(),"partnerList");
                // this.getView().setModel(new JSONModel(),"slipPartnerList");
                this.getView().setModel(new JSONModel(),"PartnerTreeList");

                this._defaultSet();
                this._getData();

                // var oTree1 = this.byId("idTree1"); // 트리 컨트롤 식별자
                // var oTree2 = this.byId("idTree2"); // 트리 컨트롤 식별자
                // debugger;

                // // 트리의 모든 항목을 반복하면서 선택 속성 설정
                // oTree1.getItems().forEach(function (oItem) {
                //     oItem.setSelected(true);
                // });
                // oTree2.getItems().forEach(function (oItem) {
                //     oItem.setSelected(true);
                // });
            },
            _defaultSet : function(){
                // odata model 변수 세팅
                this.oModel = this.getOwnerComponent().getModel(); //oData
                //json model 변수 세팅
                this.opartnerList = this.getView().getModel("partnerList"); //partneList
                // //json model 변수 세팅
                // this.oslipPartnerList = this.getView().getModel("slipPartnerList"); //partnerList
                //json model 변수 세팅
                this.oPartnerTreeList = this.getView().getModel("PartnerTreeList"); //partnerList
                //json model 변수 세팅
                this.oslipAll = this.getView().getModel("slipAll"); //slipAll
            },
            _getData: function() {
                this._getEmployeeData();
                this._getPartnerData();
                // this._setCharrInController();
              },
              _getEmployeeData: function() {
                this.getOwnerComponent().getModel().read("/employeeSet", {
                  success: function(oReturn) {
                    this.empid = oReturn.results[0].Employeeid;
                    this.byId("idAtUserName").setText(`${oReturn.results[0].Name}(${this.empid})`);
                    this.byId("idAtDept").setText(`${oReturn.results[0].Deptname}`);
                    this.byId("idLabeluname").setText(`${oReturn.results[0].Deptname} ${oReturn.results[0].Name}(${oReturn.results[0].Employeeid})`);
                  }.bind(this),
                  error: function(error) {
                    console.error("Failed to get employee data:", error);
                  }
                });
              },
              _getPartnerData: function() {
                var aPartnerI = [];
                var aPartnerO = [];
                var aPartnercodeI = [];
                var aPartnercodeO = [];
                this.getOwnerComponent().getModel().read("/partnerSet", {
                  success: function(oReturn) {
                    this.opartnerList.setProperty("/list", oReturn);
                    // debugger;
                    for(var i = 0; i < oReturn.results.length; i++){ //0 6
                        var oDatai = oReturn.results[i];
                        var j = i + 1;
                        var oDataj = oReturn.results[j] === undefined ? { Partcode : ''} : oReturn.results[j] ;
                        if(oDatai.Inoutcome === 'I'){
                            // aPartnerI.push({Patid : oDatai.Partid ,text: oDatai.Partcode+"-"+oDatai.Partid+"("+oDatai.Partname+")"});
                            if(oDatai.Partcode === oDataj.Partcode){
                                aPartnerI.push({text: oDatai.Partid+"("+oDatai.Partname+")"});
                            }else{
                                aPartnerI.push({text: oDatai.Partid+"("+oDatai.Partname+")"});
                                aPartnercodeI.push({text: oDatai.Partcode+"("+oDatai.Partcodedesc+")",nodes:aPartnerI});
                                aPartnerI = [];
                            }
                        }else{
                            // aPartnerO.push({Patid : oDatai.Partid ,text: oDatai.Partcode+"-"+oDatai.Partid+"("+oDatai.Partname+")"});
                            if(oDatai.Partcode === oDataj.Partcode){
                                aPartnerO.push({text: oDatai.Partid+"("+oDatai.Partname+")"});
                            }else{
                                aPartnerO.push({text: oDatai.Partid+"("+oDatai.Partname+")"});
                                aPartnercodeO.push({text:oDatai.Partcode+"("+oDatai.Partcodedesc+")",nodes:aPartnerO});
                                aPartnerO = [];
                            }
                        }
                    }
                    this.oPartnerTreeList.setProperty("/ilist", {list:aPartnercodeI});
                    this.oPartnerTreeList.setProperty("/olist", {list:aPartnercodeO});
                    // this.oPartnerTreeList.setProperty("/ilist", {list:aPartnerI});
                    // this.oPartnerTreeList.setProperty("/olist", {list:aPartnerO});
                    this._getSlipData();
            
                  }.bind(this),
                  error: function(error) {
                    console.error("Failed to get partner data:", error);
                  }
                });
              },
              _getSlipData: function() {
                var oDateRange = this.byId("idDateRangeSelection");
                var aFilters = [];   
                if (oDateRange.getValue()){ //'2023'
                    var oFilter = new Filter("Year", "EQ", oDateRange.getValue());
                }else{
                    var oFilter =new Filter("Year", "EQ", String(new Date().getFullYear()));
                }
                aFilters.push(oFilter);
                
                var aPartnerList = this.opartnerList.getData().list.results;
                var aPartnerMonthI = [];
                var aPartnerMonthO = [];
                var aPartnerMonth = [];
                
                // 수정중**** 두개 나누는게 좋을것같아...아마도!
                
                //년도로 filter건 개수만 가져옴
                this.getOwnerComponent().getModel().read("/sliphSet", {
                  filters: aFilters,
                  success: function(oReturn) {
                    for(var i = 0; i < aPartnerList.length; i++){
                        var oPartnerMonth = {
                            Partid:aPartnerList[i].Partid,
                            Inoutcome:aPartnerList[i].Inoutcome,
                            Total : 0,
                            Curkey :'',
                            1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0,10:0,11:0,12:0}
                        aPartnerMonth.push(oPartnerMonth);
                    };
                    
                    for(var i = 0; i < oReturn.results.length; i++){
                        var Partid = oReturn.results[i].Partid;
                        var Month = oReturn.results[i].Month;
                        for(var j = 0; j<aPartnerMonth.length;j++){
                            if(aPartnerMonth[j].Partid === Partid){
                                aPartnerMonth[j][Month] += Number(oReturn.results[i].Amt);
                                aPartnerMonth[j].Total += Number(oReturn.results[i].Amt);
                                aPartnerMonth[j].Curkey = oReturn.results[i].Curkey;
                            }
                        }
                    }
                    var adataI = []; var adataO = [];
                    var adataI2 = []; var adataO2 = [];
                    aPartnerMonth.forEach(function(item){
                        var vPartid = item.Partid;
                        if(item.Inoutcome === 'I'){
                            aPartnerMonthI.push(item);
                        }else{
                            aPartnerMonthO.push(item);
                        }
                        //확인하세요~~~~~ 여기부터~

                        for (var i = 1; i <= 12; i++) {
                            var amount = item[i];
                            if(item.Inoutcome === 'I'){
                                adataI.push({ Partid: vPartid, Month: i, Amount: amount }); ///
                                var existingData = adataI2.find(function(o) {
                                    return o.Month === i;
                                });

                                if (existingData) {
                                    existingData[vPartid] = amount;
                                } else {
                                    var newData = { Month: i };
                                    newData[vPartid] = amount;
                                    adataI2.push(newData);
                                }
                                // odata2[vPartid] = amount;
                                // adataI2.push(odata2);
                            }else{
                                adataO.push({ Partid: vPartid, Month: i, Amount: amount }); ///

                                var existingData = adataO2.find(function(o) {
                                    return o.Month === i;
                                });

                                if (existingData) {
                                    existingData[vPartid] = amount;
                                } else {
                                    var newData = { Month: i };
                                    newData[vPartid] = amount;
                                    adataO2.push(newData);
                                }
                                // odata2[vPartid] = amount;
                                // adataO2.push(odata2);
                            }
                        }
                    });
                    // for (var i = 1; i <= 12; i++) {
                    //     var odata3 = { Month: i };
                    //     adataI2.forEach(function(item){
                    //         if(item.Month === i){
                    //             odata3[]
                    //         }
                    //     });
                    // }

                    adataI2.forEach(function(item){

                    });
                    // debugger;
                    this.oslipAll.setProperty("/ilist", aPartnerMonthI);
                    this.oslipAll.setProperty("/olist", aPartnerMonthO);
                    this.oslipAll.setProperty("/ichartlist", adataI);
                    this.oslipAll.setProperty("/ochartlist", adataO);
                    this.oslipAll.setProperty("/ichart2list", adataI2);
                    this.oslipAll.setProperty("/ochart2list", adataO2);

                    // aPartnerMonth.forEach(function (item) {
                    //     var partid = item.Partid;
                    //     for (var i = 1; i <= 12; i++) {
                    //         var amount = item[i];
                    //         data.push({ Partid: partid, month: i, amount: amount });
                    //     }
                    // });
                    this._setCharrInController();

                  }.bind(this),
                  error: function(error) {
                    console.error("Failed to get slip data:", error);
                  }
                });
                // debugger;
              },
            // _getData : function(){
            //     var aPartnerI = [];
            //     var aPartnerO = [];
            //     var aPartnercodeI = [];
            //     var aPartnercodeO = [];
            //     this.getOwnerComponent().getModel().read("/employeeSet", {
            //         success: function(oReturn) {
            //             this.empid = oReturn.results[0].Employeeid;
            //             this.byId("idAtUserName").setText(`${oReturn.results[0].Name}(${this.empid})`);
            //             this.byId("idAtDept").setText(`${oReturn.results[0].Deptname}`);
            //             this.byId("idLabeluname").setText(`${oReturn.results[0].Deptname} ${oReturn.results[0].Name}(${oReturn.results[0].Employeeid})`);
            //         }.bind(this)
            //     });

            //     this.getOwnerComponent().getModel().read("/partnerSet", {
            //         success: function(oReturn) {
            //             this.opartnerList.setProperty("/list", oReturn);
            //             for(var i = 0; i < oReturn.results.length; i++){ //0 6
            //                 var oDatai = oReturn.results[i];
            //                 var j = i + 1;
            //                 var oDataj = oReturn.results[j] === undefined ? { Partcode : ''} : oReturn.results[j] ;
            //                 if(oDatai.Inoutcome === 'I'){
            //                     // aPartnerI.push({Patid : oDatai.Partid ,text: oDatai.Partcode+"-"+oDatai.Partid+"("+oDatai.Partname+")"});
            //                     if(oDatai.Partcode === oDataj.Partcode){
            //                         aPartnerI.push({text: oDatai.Partid+"("+oDatai.Partname+")"});
            //                     }else{
            //                         aPartnerI.push({text: oDatai.Partid+"("+oDatai.Partname+")"});
            //                         aPartnercodeI.push({text: oDatai.Partcode+"("+oDatai.Partcodedesc+")",nodes:aPartnerI});
            //                         aPartnerI = [];
            //                     }
            //                 }else{
            //                     // aPartnerO.push({Patid : oDatai.Partid ,text: oDatai.Partcode+"-"+oDatai.Partid+"("+oDatai.Partname+")"});
            //                     if(oDatai.Partcode === oDataj.Partcode){
            //                         aPartnerO.push({text: oDatai.Partid+"("+oDatai.Partname+")"});
            //                     }else{
            //                         aPartnerO.push({text: oDatai.Partid+"("+oDatai.Partname+")"});
            //                         aPartnercodeO.push({text:oDatai.Partcode+"("+oDatai.Partcodedesc+")",nodes:aPartnerO});
            //                         aPartnerO = [];
            //                     }
            //                 }
            //             }
            //             this.oPartnerTreeList.setProperty("/ilist", {list:aPartnercodeI});
            //             this.oPartnerTreeList.setProperty("/olist", {list:aPartnercodeO});
            //             // this.oPartnerTreeList.setProperty("/ilist", {list:aPartnerI});
            //             // this.oPartnerTreeList.setProperty("/olist", {list:aPartnerO});
                        
            //             // var oTree1 = this.byId("idTree1"); // 트리 컨트롤 식별자
            //             // var oTree2 = this.byId("idTree2"); // 트리 컨트롤 식별자
            //             // debugger;
            //             // // 트리 컨트롤의 선택 모드를 "다중 선택"에서 "단일 선택"으로 변경
            //             // oTree1.setSelectionMode(sap.ui.commons.TreeSelectionMode.Single);

            //             // // 트리 컨트롤의 선택 모드를 "다중 선택"에서 "단일 선택(하위 항목 선택 가능)"으로 변경
            //             // oTree1.setSelectionMode(sap.ui.commons.TreeSelectionMode.SingleToggle);

            //         }.bind(this)
            //     });
            //     this._getSlipData();
            // },
            // _getSlipData : function(){
            //     var oDateRange = this.byId("idDateRangeSelection");
            //     // var oDateRange2 = this.byId("idDateRangeSelection2");
            //     var aFilters = [];    

            //     if (oDateRange.getValue()){ //'2023'
            //         var oFilter = new Filter("Year", "EQ", oDateRange.getValue());
            //     }else{
            //         var oFilter =new Filter("Year", "EQ", String(new Date().getFullYear()));
            //     }
            //     aFilters.push(oFilter);

            //     // if (oDateRange2.getValue()){ //'2023'
            //     //     var oFilter = new Filter("Year", "BT", oDateRange2.getFrom(),oDateRange2.getTo());
            //     // }
            //     // aFilters.push(oFilter);
            //     // debugger;
            //     var aPartnerList = this.opartnerList.getData();
            //     debugger;

            //     // for(var i = 0; i < this.opartnerList.get){

            //     // }

            //     this.getOwnerComponent().getModel().read("/sliphSet", {
            //         filters: aFilters,
            //         success: function(oReturn) {
            //             // debugger;
            //             // for(var i = 0; i < oReturn.results.length; i++){
            //             //     for(var j = 1; j <= 12 ; j++){
            //             //         if(oReturn.results[i].Month === j){

            //             //         }else{

            //             //         }
            //             //     }
            //             // }
            //         }.bind(this)
            //     });

            //     this._setCharrInController();
            // },
            _setCharrInController : function(){
                // debugger;
                var oChart = this.byId("idViewChart1");
                var aMeasureD = []; //[{name : "PAT07" , value : "{slipPartnerList>PAT07}"}]
                var aMeasureV = []; //["PAT07","PAT07","PAT07"...]
                var aPartnerList = this.opartnerList.getData().list.results;
                    // debugger;

                for (var p = 0; p < aPartnerList.length; p++) {
                    if(aPartnerList[p].Inoutcome === 'I'){
                        // debugger;
                        var measure = aPartnerList[p].Partid;
                        var measureData = {
                          name: measure,
                          value: "{slipAll>"+measure+"}"
                        };
                        aMeasureD.push(measureData);
                        aMeasureV.push(measure);
                    }
                }
                var oColDataset = new FlattenedDataset({
                    dimensions : [
                        {name : "Month" , value : "{slipAll>Month}"}],
                    measures : aMeasureD, 
                    // measures : [
                    //     { name: 'Partid', value: "{slipAll>PAT05}"},
                    //     { name: 'Partid2', value: "{slipAll>PAT00}"}],
                    data : {
                        path : "slipAll>/ichart2list"
                    }
                });
                oChart.setDataset(oColDataset);

                var oFeedValueAxis = new FeedItem({
                    type : "Measure",
                    uid : "valueAxis",
                    values : aMeasureV
                    // values : ["Partid","Partid2"]
                });
                var oFeedCategoryAxis = new FeedItem({
                    type : "Dimension",
                    uid : "categoryAxis",
                    values : ["Month"]
                });

                oChart.addFeed(oFeedValueAxis);
                oChart.addFeed(oFeedCategoryAxis);

                oChart.setVizProperties({
                    title: {text: '실적차트'},
                    plotArea : {
                        drawingEffect: 'glossy',
                        dataLabel: { visible: true, type:'value',position:"outsideFirst" },
                        gap : { barSpacing : 0.01, groupSpacing:0.01, innerGroupSpacing:0.01 },
                        gridline:{size:0.5},
                        background:{border:{strokeWidth : 0.1}}
                    },
                    legend : {
                        // hoverShadow : true,
                        hoverShadow : { visible: true, color:'#BFBFBF'},
                        // marker : true,
                        marker : {shape : "squareWithRadius", size:0.0001}
                    },
                    // general : { tabIndex: 1}
                    // valueAxis:{layout:{maxHeight:0.1}}
                });
            },
            _datefomatter: function(date){

                let oDateTimeInstance;

                oDateTimeInstance = sap.ui.core.format.DateFormat.getDateTimeInstance({
                    pattern : 'yyyyMM'
                });

                return oDateTimeInstance.format(date);
            },
            onSearch : function(){
                
                this._getSlipData();
                // oTable.getBinding("rows").filter(aFilter);
            },
            onSelectionChange1 : function(oEvent){
                // var selectedNode = oEvent.getParameter("listItem");
                // var tree = oEvent.getSource();
                // var model = tree.getModel("PartnerTreeList");

                // // 부모 노드인지 확인
                // if (selectedNode.getNodes && selectedNode.getNodes().length > 0) {
                //     // 부모 노드 선택 시 자식 노드들도 선택
                //     var nodes = selectedNode.getNodes();
                //     for (var i = 0; i < nodes.length; i++) {
                //     var path = nodes[i].getBindingContextPath();
                //     tree.setSelectedItem(tree.getItemByContextPath(path), true);
                //     }
                // } else {
                //     // 자식 노드 선택 시 부모 노드도 선택
                //     var parentPath = selectedNode.getBindingContextPath() + "/..";
                //     tree.setSelectedItem(tree.getItemByContextPath(parentPath), true);
                // }

                var selectedItems = oEvent.getParameter("listItems");
                var tree = oEvent.getSource();

                // selectedItems.forEach(function(item) {
                //     var isParentNode = item.getBindingContext("PartnerTreeList").getProperty("nodes");
                //     if (isParentNode && isParentNode.length > 0) {
                //     var childNodes = isParentNode;
                //     childNodes.forEach(function(child) {
                //         var path = item.getBindingContext("PartnerTreeList").getPath() + "/nodes/" + child.text;
                //         var treeItem = tree.getItems().find(function(item) {
                //         return item.getBindingContext("PartnerTreeList").getPath() === path;
                //         });
                //         if (treeItem) {
                //         tree.setSelectedItem(treeItem, true);
                //         }
                //     });
                //     }
                // });
                

                // var allItems = tree.getItems();
                // var selectedContextPaths = selectedItems.map(function(item) {
                //     return item.getBindingContextPath();
                // });

                // allItems.forEach(function(item) {
                //     var itemContextPath = item.getBindingContextPath();
                //     var parentNodeSelected = selectedContextPaths.some(function(path) {
                //     return path.startsWith(itemContextPath) && path !== itemContextPath;
                //     });

                //     if (parentNodeSelected) {
                //     tree.setSelectedItem(item, true);
                //     }
                // });      

                // //됨
                // selectedItems.forEach(function(item) {
                //     var isParentNode = item.getBindingContext("PartnerTreeList").getProperty("nodes");
                //     if (isParentNode && isParentNode.length > 0) {
                //         tree.removeSelections([item]);
                //     }
                // });
                
                // var selectedItems = oEvent.getParameter("listItems");
                // var tree = oEvent.getSource();

                // // Parent 노드 선택 해제
                // var invalidSelections = selectedItems.filter(function(item) {
                //     return item.getParent();
                // });

                // invalidSelections.forEach(function(item) {
                //     tree.removeSelections([item]);
                // });
            }
            // onSelectionChange : function(oEvent){
            //     debugger;
            // }
        });
    });
