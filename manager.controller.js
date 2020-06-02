const Constants = require('constants');
const CtlrLevel1 = require('controller.level1');
const CtlrLevel2 = require('controller.level2');
const CtlrLevel3 = require('controller.level3');
const CtlrLevel4 = require('controller.level4');
const CtlrLevel5 = require('controller.level5');
const CtlrLevel6 = require('controller.level6');
const CtlrLevel7 = require('controller.level7');
const CtlrLevel8 = require('controller.level8');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

module.exports = {
    
    /** @param (roomObj) room object **/
    run: function(roomObj) {
        
        console.log("- Controller Level:", roomObj.controller.level, "State:", roomObj.memory['state']);

        /**
         * The '8' states of the controller
         */ 
        switch(roomObj.controller.level) {

        // ------------------------------
            /**
             * Roads, 5 Containers
             */
            default:
            case 0:
                break;
        // ==============================
            
        // ------------------------------
            case 1:
                CtlrLevel1.run(roomObj);
                break;
        // ==============================
            
        // ------------------------------
            case 2:
                CtlrLevel2.run(roomObj);
                break;
        // ==============================
            
        // ------------------------------
            case 3:
                CtlrLevel3.run(roomObj);
                break;
        // ==============================
            
        // ------------------------------
            case 4:
                CtlrLevel4.run(roomObj);
                break;
        // ==============================
            
        // ------------------------------
            case 5:
                CtlrLevel5.run(roomObj);
                break;
        // ==============================
            
        // ------------------------------
            case 6:
                CtlrLevel6.run(roomObj);
                break;
        // ==============================
            
        // ------------------------------
            case 7:
                CtlrLevel7.run(roomObj);
                break;
        // ==============================
            
        // ------------------------------
            case 8:
                CtlrLevel8.run(roomObj);
                break;
        // ==============================

        }// =====
    }// ==============================

};// ==============================