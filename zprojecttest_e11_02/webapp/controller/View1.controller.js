sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast, MessageBox) {
        "use strict";

        return Controller.extend("C05.zprojectteste1102.controller.View1", {
            onInit: function () {

            },
            SubmitEvent: function (oEvent2) {
                this.byId("idText").setText(this.byId("idInput").getValue());
                // this.byId("idText").setText(oEvent2.getSource().getValue());

                // console.log(oEvent2.getSource());
                // console.log(oEvent2.getSource().getValue()) ;

                // var sValue = this.byId("idInput").getValue();
                // this.byId("idText").setText(sValue);
            },
            onButtonPress: function () {
                let oSelect = this.byId("idSelect").getSelectedItem(),
                    iNum1 = Number(this.byId("idInput1").getValue()),
                    iNum2 = Number(this.byId("idInput2").getValue()),
                    result = 0;
                let sMsg = '';
                
                debugger;

                switch (oSelect.getKey()) {
                    case "plus":
                        result = iNum1 + iNum2;
                        break;
                    case "minus":
                        result = iNum1 - iNum2;
                        break;
                    case "multiply":
                        result = iNum1 * iNum2;
                        break;
                    case "devide":
                        result = iNum1 / iNum2;
                        break;
                    default:
                        break;
                }
                sMsg = `${iNum1} ${oSelect.getText()} ${iNum2} = ${result}`;

                // MessageToast.show(sMsg);
                MessageBox.show(sMsg, {
                    icon: MessageBox.Icon.INFORMATION,
                    title: "계산기 결과는???",
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    emphasizedAction: MessageBox.Action.YES,
                    onClose: function (oAction) {
                        / * do something * /
                        // alert(oAction);
                    } //param -> YES / NO값

                });
            }
        });
    });
