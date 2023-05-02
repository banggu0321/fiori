sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast" 
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict"; 
        // 클로저변수 --> 전역변수 global 
        var test = 'hihi';

        return Controller.extend("zprojectteste1101.controller.Main", {
            iNumber : 20, //객체선언
            onInit: function () {
                this.test2 = 'hihi2'; //controller내 변수 global
                // this.iNumber = 20;

                var localVariable = 'local'; //local 변수

                function a(){}

                // this.byId("idInput1").setValue(10);
                // this.byId("idInput2").setValue('20');
                // this.byId("idSelect").setSelectedKey('multiply');
            },
            onButtonPress: function (oEvent) {

                //oEvent -> console에서 getSource/getParameters

                // test = 'hello' //클로저변수
                // thihs.test2 =  //Controller에 붙은 변수
                // this.iNumber =  //Controller에 붙은 변수2
                
                // debugger;
                // alert('버튼 이벤트 함수 실행!');
                let sValue1 = this.byId("idInput1").getValue(); //controller
                // let sValue2 = this.byId("idSelect").getSelectedKey(); 
                let sValue3 = this.byId("idInput2").getValue();

                alert(sValue1);
                // alert(`${sValue1} ${sValue2} ${sValue3}`);

                // sValue = 0;
                // this.byId("idInput1").setValue(sValue);

                this._setSum(10,20,30); //_ -> view, event X -> controller내에서만 사용
            },
            _setSum : function(a,b,c){
                return a + b + c;
            },
            onclick : function(){
                var oInput = this.byId("idCustomer");
                var oLabel = oInput.getLabels()[0]; //label 객체 모두, 그중 1번째 값

                // oLabel.getText();
                
                console.log(oLabel.getText());
            }
        });
    });
