sap.ui.define(
    [
      "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel",
      "sap/ui/model/Filter",
    ],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Filter) {
      "use strict";
      return Controller.extend("ER.zferexmat.controller.Main", {
        formatter : {
          dateTime : function(oDate){    let oDateTimeInstance;
            oDateTimeInstance = sap.ui.core.format.DateFormat.getDateTimeInstance(
              {
                pattern: "yyyy-MM-dd",
              }
            );
            return oDateTimeInstance.format(oDate);
          }
        },
        onInit: function () { 
          //Chart defalut
         // ComboBox Filter
          let Datas = {
            list: [
              { type: "SE01" },
              { type: "SE02" },
              { type: "GY01" },
              { type: "DG01" },
              { type: "DJ01" },
              { type: "BU01" },
              { type: "IN01" },
            ],
          };
          this.getView().setModel(new JSONModel(Datas), "typeList");
          
          // Date Selection Change
          var that = this; // 컨트롤러 인스턴스에 대한 참조를 변수에 저장
          this.oModel = this.getOwnerComponent().getModel();
  
          var oModel,
            sText = "조회 기간",
            aData = [{ label: sText + "", valueState: "None" }];
          oModel = new JSONModel({
            modelData: aData,
          });
          this.getView().setModel(oModel);
          //MatHistorySet Json
          // this.oModel.read("/MatHistorySet", {
          //   success: function (oReturn) {
          //     console.log(oReturn);
          //     var oMatModel = new JSONModel();
          //     oMatModel.setData(oReturn);
          //     that.getView().setModel(oMatModel, "oMatModel");
          //   },
          //   error: function (error) {
          //     console.error("Failed to fetch data:", error);
          //   },
          // });
          //AutofillSet Json
              this.oModel.read("/AutofillSet", {
                success: function (oReturn) {
                  console.log(oReturn);
                  var oAutoModel = new JSONModel();
                  oAutoModel.setData(oReturn);
                  that.getView().setModel(oAutoModel, "oAutoModel");
                },
                error: function (error) {
                  console.error("Failed to fetch data:", error);
                },
              });
              
        },
  
        getMathisdata: function(){
          var aFilter = new Filter('Yearmonth', 'EQ', )
          this.oModel.read("/MatHistorySet", {
            success: function (oReturn) {
              console.log(oReturn);
              var oMatModel = new JSONModel();
              oMatModel.setData(oReturn);
              that.getView().setModel(oMatModel, "oMatModel");
            },
            error: function (error) {
              console.error("Failed to fetch data:", error);
            },
          });
        },
  
        onDateChange: function (oEvent) {
          // var oDateRange = this.byId("idDaterange");
          // var aFilters = [];
          // var sYear = oDateRange.getValue().slice(3,7);
          // var sMonth =  oDateRange.getValue().slice(0,2);
          // var sYearMonth = sYear + sMonth;
          
          // if (oDateRange.getValue()){ 
          //      var oFilter = new Filter("Yearmonth", "EQ", sYearMonth);
          //  }else{
          //      var oFilter = new Filter("Yearmonth", "EQ", String(new Date().getFullYear())+(new Date().getMonth() + 1).toString().padStart(2, '0'));
          //  }
          //  aFilters.push(oFilter);
          //  debugger;

          //  this.oModel.read("/MatHistorySet", {
          //      filters: aFilters,
          //      success: function(oReturn) {
          //          debugger;
          //      }
          //  }); 

          // debugger;
        var oDateRange = this.byId("idDaterange");
        var aFilters = [];
        if (oDateRange.getValue()){ 
            var sFromYear = oDateRange.getValue().slice(3,7);
            var sFromMonth = oDateRange.getValue().slice(0,2);
            var sToYear = oDateRange.getValue().slice(13,17);
            var sToMonth = oDateRange.getValue().slice(10,12);
            var sFrom = sFromYear + sFromMonth;
            var sTo = sToYear + sToMonth;
            var oFilter = new Filter("Yearmonth", "BT", sFrom, sTo);
        }else{
            var oFilter = new Filter("Yearmonth", "EQ", String(new Date().getFullYear())+(new Date().getMonth() + 1).toString().padStart(2, '0'));
        }
         aFilters.push(oFilter);
        debugger;
         this.getOwnerComponent().getModel().read("/MatHistorySet", {
             filters: aFilters,
             success: function(oReturn) {
              var oMatModel = new JSONModel();
              oMatModel.setData(oReturn);
              this.getView().setModel(oMatModel, "oMatModel");
             }.bind(this)
         });
          
            
        },
        onUpdateFinished: function () {
          var oModel = this.getView().getModel("oMatModel");
          var aData = oModel.getProperty("/results");
          var iTotalSum = 0;
        
          for (var i = 0; i < aData.length; i++) {
            var iValue = parseFloat(aData[i].Matusnum);
            if (!isNaN(iValue)) {
              iTotalSum += iValue;
            }
          }
          // 모델에 합계 설정
          oModel.setProperty("/columnSum", iTotalSum);
        },
        calculateColumnSum: function () {
        
            var oModel = this.getView().getModel("oMatModel");
            var aData = oModel.getProperty("/results");
            var iColumnSum = 0;
          
            for (var i = 0; i < aData.length; i++) {
              var iValue = parseFloat(aData[i].Matusnum);
              if (!isNaN(iValue)) {
                iColumnSum += iValue;
              }
            }
            oModel.setProperty("/columnSum", iColumnSum);
        },
        onSearch: function () {
          
          let sValue = this.byId("idComboBox").getSelectedKey(); // type
          debugger;
          let oFilter = new Filter({  
            path: "Branch",
            operator: "EQ",
            value1: sValue,
          });
          if (sValue) {
            this.byId("idMaterial").getBinding("data").filter(oFilter);
          } //[필터객체1, 필터객체2]
          else {
            this.byId("idMaterial").getBinding("data").filter([]);
          }
          // var value = sValue
          // var oFilter2 = oFilter.aFilters;
          // oFilter2.push(new Filter("Branch", "EQ", value));
          // this.byId("idMaterial").getBinding("data").filter(oFilter2);
        }
      });
    }
  );