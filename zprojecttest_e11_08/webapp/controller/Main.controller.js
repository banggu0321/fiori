sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/viz/ui5/data/FlattenedDataset",
    "sap/viz/ui5/controls/common/feeds/FeedItem"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, FlattenedDataset, FeedItem) {
        "use strict";

        return Controller.extend("zprojectteste1108.controller.Main", {
            onInit: function () {
                this._setChartInView();
                this._setCharrInController();
            },
            _setCharrInController : function(){
                //chart data setting
                var oData ={
                    sales : [
                        {product : 'Jackets', amount :"65"},
                        {product : 'Shirts', amount :"70"},
                        {product : 'Pants', amount :"83"},
                        {product : 'Coats', amount :"95"},
                        {product : 'Purse', amount :"65"}
                    ]
                };
                this.getView().setModel(new JSONModel(oData), "cont");
                //chart control setting
                var oChart = this.byId("idConChart");
                //chart dataset 정보 setting
                var oColDataset = new FlattenedDataset({
                    dimensions : [{name : "Product" , value : "{cont>product}"}],
                    measures : [{name : "Amount" , value : "{cont>amount}"}], 
                    data : {
                        path : "cont>/sales"
                    }
                });
                oChart.setDataset(oColDataset);

                var oFeedValueAxis = new FeedItem({
                   type : "Measure",
                    uid : "valueAxis",
                    values : ["Amount"]
                });
                var oFeedCategoryAxis = new FeedItem({
                    type : "Dimension",
                     uid : "categoryAxis",
                     values : ["Product"]
                });

                oChart.addFeed(oFeedValueAxis);
                oChart.addFeed(oFeedCategoryAxis);

                oChart.setVizProperties({
                    title: {text: 'Sales Data`'}
                });
            }, 
            _setChartInView : function(){
                var oData = {
                    list : [
                        {name : '국어', rate : '100', cost: '10'},
                        {name : '영어', rate : '50', cost : '22'},
                        {name : '수학', rate : '80', cost : '33'},
                        {name : '도덕', rate : '80', cost : '44'},
                        {name : '체육', rate : '70', cost : '99'}
                    ]
                };
                var chartUid = this.byId("idViewChart").getVizUid();
                this.getView().setModel(new JSONModel(oData), "view");
                this.byId("idViewPopover").connect(chartUid);
            }
        });
    });
