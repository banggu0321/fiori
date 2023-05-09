sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"
    ],
    function(BaseController, JSONModel) {
      "use strict";
  
      return BaseController.extend("sap.btp.ux410solving.controller.Detail", {
        onInit() {
            this.getView().setModel(new JSONModel(),'DetailModel');
            
            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteDetail").attachPatternMatched(this._onPatternMatched, this);

        },
        _onPatternMatched : function(oEvent){
            
            var oArgu = oEvent.getParameter("arguments"); //이벤트 객체에 파라미터 정보가 있음

            // '/Order_Details(OrderID=10248,ProductID=72)' 를 sBindPath 변수에 담는다
            let sBindPath = this.getView().getModel().createKey("/Order_Details",{
                OrderID : oArgu.OrderID, //10248
                ProductID : oArgu.ProductID //72
            });
            
            this.getView().bindElement(sBindPath); //View에다가 해당 데이터 세팅
            //위 Binding 방법을 Element Binding 또는 Context Binding 이라고 부름


            // sBindPath = `/Order_Details(OrderID=${oArgu.OrderID},ProductID=${oArgu.ProductID})`;

            // this.getView().bindElement("/Order_Details(OrderID="+oArgu.OrderID+",ProductID="+oArgu.ProductID+")");
        }
      });
    }
  );
  