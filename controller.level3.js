const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

/**
 * Roads, 5 Containers, 1 Spawn, 10 Extensions (50 capacity), Ramparts (1M max hits), Walls, 1 Tower
 */
module.exports = {
    
    /** @param (roomObj) room object **/
    run: function(roomObj) {

        switch(roomObj.memory['state']) {
            
        // ------------------------------
            default:
                var NEXT_STATE = 'Building extractors';
                var PREV_STATE = '';

                roomObj.memory[LOOK_CREEPS][Constants.Roles.GENERAL]                = {max: 6};
                roomObj.memory['state'] = NEXT_STATE;
                break;
        // ==============================
            
        // ------------------------------
            case 'Building extractors':
                var NEXT_STATE = 'Waiting on extractors';
                var PREV_STATE = '';

                var mySites = roomObj.find(FIND_MY_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_EXTENSION}});
                var myStcrs = roomObj.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});

                var sitesPlaced = mySites.length + myStcrs.length;
                if(sitesPlaced != CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]) {
                    var spawnPos = roomObj.find(FIND_MY_SPAWNS)[0].pos;
                    var skip = 0;
                    for(var x = spawnPos.x + 1, y = spawnPos.y + 2; sitesPlaced < CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]; x++) {
                        if(skip == 2) {
                            skip = 0; continue;
                        }// =====
                        if(roomObj.createConstructionSite(x, y, STRUCTURE_EXTENSION) == OK) {
                            sitesPlaced++;
                
                            if(sitesPlaced == CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]) {
                                roomObj.memory['state'] = NEXT_STATE;
                                break;
                            }// =====

                            skip++;
                        } else {
                            skip = 0;
                        }// =====
                    }// =====
                } else {
                    roomObj.memory['state'] = NEXT_STATE;
                }// =====
                break;
        // ==============================
            
        // ------------------------------
            case 'Waiting on extractors':
                var NEXT_STATE = 'Build tower';
                var PREV_STATE = 'Building extractors';

                var mySites = roomObj.find(FIND_MY_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_EXTENSION}});
                var myStcrs = roomObj.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});

                if(mySites.length == 0 && myStcrs.length == CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]) {
                    roomObj.memory['state'] = NEXT_STATE;
                } else if((mySites.length + myStcrs.length) != CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]) {
                    roomObj.memory['state'] = PREV_STATE;
                }// =====
                break;
        // ==============================
            
        // ------------------------------
            case 'Build tower':
                var NEXT_STATE = '';
                var PREV_STATE = 'Waiting on extractors';

                break;
        // ==============================
            
        // ------------------------------
            case 'z':
                var NEXT_STATE = '';
                var PREV_STATE = '';

                break;
        // ==============================

        }// =====
    },// =====
};// ==============================