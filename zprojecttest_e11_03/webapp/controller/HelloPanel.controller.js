sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("zprojectteste1103.controller.HelloPanel", {
            onInit: function () {

            },
            onHelloPress:function(){
                // sap.ui.core.Fragment.load({
                //     name:"zprojectteste1103.view.fragment.HelloDialog", //경로
                //     type:"XML", //타입
                //     controler: this  
                // }.then(function(oDialog){
                //     debugger;
                //     oDialog.open(); 
                    
                // }));
                var oDialog = this.byId("helloDialog");

                if (oDialog){
                    oDialog.open();
                    return;                    
                }

                this.loadFragment({
                    name: "zprojectteste1103.view.fragment.HelloDialog" //경로
                }).then(function(oDialog){
                    oDialog.open();
                },this);
            },
            onClose:function(oEvent){
                var oDialog = oEvent.getSource().getParent(); //Dialog
                

                oDialog.close();
                // debugger;
            }
        });
    });
