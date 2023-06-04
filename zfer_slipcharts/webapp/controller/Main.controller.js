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

        return Controller.extend("ER.zferslipcharts.controller.Main", {
            onInit: function () {
                this.getView().setModel(new JSONModel(),"slipAll");
                this.getView().setModel(new JSONModel(),"partnerList");
                // this.getView().setModel(new JSONModel(),"slipPartnerList");
                this.getView().setModel(new JSONModel(),"PartnerTreeList");

                this._defaultSet();
                this._getData();
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
                this._getPartnerData();
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
                        if(oDatai.Inoutcome === 'I' || oDatai.Partid === 'PAT00'){
                            // aPartnerI.push({Patid : oDatai.Partid ,text: oDatai.Partcode+"-"+oDatai.Partid+"("+oDatai.Partname+")"});
                            if(oDatai.Partid === 'PAT00'){
                                aPartnerI.push({text: oDatai.Partid+"("+oDatai.Partname+")"});
                                aPartnercodeI.push({text: oDatai.Partcode+"["+"대여"+"]",nodes:aPartnerI});
                                aPartnerI = [];
                            }
                            else if(oDatai.Partcode === oDataj.Partcode){
                                aPartnerI.push({text: oDatai.Partid+"("+oDatai.Partname+")"});
                            }else{
                                aPartnerI.push({text: oDatai.Partid+"("+oDatai.Partname+")"});
                                aPartnercodeI.push({text: oDatai.Partcode+"["+oDatai.Partcodedesc+"]",nodes:aPartnerI});
                                aPartnerI = [];
                            }
                        }else{
                            // aPartnerO.push({Patid : oDatai.Partid ,text: oDatai.Partcode+"-"+oDatai.Partid+"("+oDatai.Partname+")"});
                            if(oDatai.Partcode === oDataj.Partcode){
                                aPartnerO.push({text: oDatai.Partid+"("+oDatai.Partname+")"});
                            }else{
                                aPartnerO.push({text: oDatai.Partid+"("+oDatai.Partname+")"});
                                aPartnercodeO.push({text:oDatai.Partcode+"["+oDatai.Partcodedesc+"]",nodes:aPartnerO});
                                aPartnerO = [];
                            }
                        }
                    }
                    this.oPartnerTreeList.setProperty("/ilist", {list:aPartnercodeI});
                    this.oPartnerTreeList.setProperty("/olist", {list:aPartnercodeO});
                    // this.oPartnerTreeList.setProperty("/ilist", {list:aPartnerI});
                    // this.oPartnerTreeList.setProperty("/olist", {list:aPartnerO});
                    this._getSlipData();
                    this._setCharrInController1();
                    this._setCharrInController2();
            
                  }.bind(this),
                  error: function(error) {
                    console.error("Failed to get partner data:", error);
                  }
                });
              },
              _getSlipData: function() {
                var oDateRange = this.byId("idDateRangeSelection");
                var aFilters = [];   
                if (oDateRange.getValue()){ 
                    var oFilter = new Filter("Year", "EQ", oDateRange.getValue());
                }else{
                    var oFilter =new Filter("Year", "EQ", String(new Date().getFullYear()));
                }
                aFilters.push(oFilter);
                
                var aPartnerList = this.opartnerList.getData().list.results;
                var aPartnerMonthI = [];
                var aPartnerMonthO = [];
                var aPartnerMonth = [];
                var stotalSumI = 0;
                var stotalSumO = 0;
                var scurkey ;
                
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
                            if(oReturn.results[i].Inoutcome === 'I'){
                                stotalSumI += Number(oReturn.results[i].Amt);
                            }else{
                                stotalSumO += Number(oReturn.results[i].Amt);
                            }
                            scurkey = oReturn.results[i].Curkey;
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
                                }
                            }
                        });

                        this.oslipAll.setProperty("/ilist", aPartnerMonthI);
                        this.oslipAll.setProperty("/itotalcount", stotalSumI);
                        this.oslipAll.setProperty("/olist", aPartnerMonthO);
                        this.oslipAll.setProperty("/ototalcount", stotalSumO);
                        this.oslipAll.setProperty("/Curkey", scurkey);
                        this.oslipAll.setProperty("/ichartlist", adataI);
                        this.oslipAll.setProperty("/ochartlist", adataO);
                        this.oslipAll.setProperty("/ichart2list", adataI2);
                        this.oslipAll.setProperty("/ochart2list", adataO2);
                    }.bind(this),
                    error: function(error) {
                        console.error("Failed to get slip data:", error);
                    }
                });
              },
            _setCharrInController1 : function(){
                var oChart = this.byId("idViewChart1");
                var aMeasureD = []; //[{name : "PAT07" , value : "{slipPartnerList>PAT07}"}]
                var aMeasureV = []; //["PAT07","PAT07","PAT07"...]
                var aPartnerList = this.opartnerList.getData().list.results;
                    // debugger;

                for (var p = 0; p < aPartnerList.length; p++) {
                    if(aPartnerList[p].Inoutcome === 'I'){
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
                        {name : "Month" , value : "{slipAll>Month}월"}],
                    measures : aMeasureD, 
                    data : {
                        path : "slipAll>/ichart2list"
                    }
                });
                oChart.setDataset(oColDataset);

                var oFeedValueAxis = new FeedItem({
                    type : "Measure",
                    uid : "valueAxis",
                    values : aMeasureV
                });
                var oFeedCategoryAxis = new FeedItem({
                    type : "Dimension",
                    uid : "categoryAxis",
                    values : ["Month"]
                });

                oChart.addFeed(oFeedValueAxis);
                oChart.addFeed(oFeedCategoryAxis);

                oChart.setVizProperties({
                    title: {text: '실적차트', visible:"false"},
                    plotArea : {
                        drawingEffect: 'glossy',
                        dataLabel: { visible: true, type:'value', position:"outsideFirst" },
                        gap : { barSpacing : 0.01, groupSpacing:0.01, innerGroupSpacing:0.01 },
                        gridline:{size:0.5},
                        background:{border:{strokeWidth : 0.1}},
                        colorPalette :['#56BDF7', '#C68CFF', '#80F4FF', '#4DFFA6', '#FFF04D', '#FF9966', '#CCCCCC', '#808080', '#FF99CC', '#FF8066']

                    },
                    legend : {
                        hoverShadow : { visible: true, color:'#BFBFBF'},
                        marker : {shape : "squareWithRadius", size:0.0001}
                    },
                });
                var chartUid = oChart.getVizUid();
                this.byId("idViewPopover1").connect(chartUid);
            },
            _setCharrInController2 : function(){
                var oChart = this.byId("idViewChart2");
                var aMeasureD = [];
                var aMeasureV = [];
                var aPartnerList = this.opartnerList.getData().list.results;

                for (var p = 0; p < aPartnerList.length; p++) {
                    if(aPartnerList[p].Inoutcome === 'O'){
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
                        {name : "Month" , value : "{slipAll>Month}월"}],
                    measures : aMeasureD, 
                    data : {
                        path : "slipAll>/ochart2list"
                    }
                });
                oChart.setDataset(oColDataset);

                var oFeedValueAxis = new FeedItem({
                    type : "Measure",
                    uid : "valueAxis",
                    values : aMeasureV
                });
                var oFeedCategoryAxis = new FeedItem({
                    type : "Dimension",
                    uid : "categoryAxis",
                    values : ["Month"]
                });

                oChart.addFeed(oFeedValueAxis);
                oChart.addFeed(oFeedCategoryAxis);

                oChart.setVizProperties({
                    title: {text: '실적차트', visible:"false"},
                    plotArea : {
                        drawingEffect: 'glossy',
                        dataLabel: { visible: true, type:'value', position:"outsideFirst" },
                        gap : { barSpacing : 0.01, groupSpacing:0.01, innerGroupSpacing:0.01 },
                        gridline:{size:0.5},
                        background:{border:{strokeWidth : 0.1}},
                        colorPalette :['#FF8066', '#FF99CC', '#808080', '#CCCCCC', '#FF9966', '#FFF04D', '#4DFFA6', '#80F4FF', '#C68CFF', '#56BDF7']
                    },
                    legend : {
                        hoverShadow : { visible: true, color:'#BFBFBF'},
                        marker : {shape : "squareWithRadius", size:0.0001}
                    },
                });
                var chartUid = oChart.getVizUid();
                this.byId("idViewPopover2").connect(chartUid);
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
            }
        });
    });
