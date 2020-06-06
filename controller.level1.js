const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

/**
 * Roads, 5 Containers, 1 Spawn
 */
module.exports = {
    
    /** @param (roomObj) room object **/
    run: function(roomObj) {

        switch(roomObj.memory['state']) {

        // ------------------------------
            default:
                var NEXT_STATE = 'Complete Controller Level 1';
                var PREV_STATE = '';

                roomObj.memory[LOOK_CREEPS] = {};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.BUILD]                  = {max: 0};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.GENERAL]                = {max: 0};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.LOCAL_ENERGY_HARVEST]   = {max: 3};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.MELEE]                  = {max: 0};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.RANGE]                  = {max: 0};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.UPGRADE]                = {max: 2};
                roomObj.memory['warState'] = Constants.States.IDLE;
                roomObj.memory['jobTargets'] = {};

                roomObj.memory['state'] = NEXT_STATE;
                break;
        // ==============================
            
        // ------------------------------
            case 'Complete Controller Level 1':
                break;
        // ==============================

        }// =====
    },// =====
};// ==============================