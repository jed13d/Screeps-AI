const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

/**
 * Roads, 5 Containers, 1 Spawn, 40 Extensions (50 capacity), Ramparts (30M max hits), Walls, 2 Towers, 
 * Storage, 3 Links, Extractor, 3 Labs, Terminal
 */
module.exports = {
    
    /** @param (roomObj) room object **/
    run: function(roomObj) {

        switch(roomObj.memory['state']) {
            
        // ------------------------------
            default:
                var NEXT_STATE = 'Building extensions';
                var PREV_STATE = '';
                
                roomObj.memory[LOOK_CREEPS][Constants.Roles.BUILD]                  = {max: 2};
                roomObj.memory['state'] = NEXT_STATE;
                break;
        // ==============================
            
        // ------------------------------
            case 'Building extensions':
                var NEXT_STATE = 'Waiting on extensions';
                var PREV_STATE = '';

                var mySites = roomObj.find(FIND_MY_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_EXTENSION}});
                var myStcrs = roomObj.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});
                var sitesPlaced = mySites.length + myStcrs.length;

                var spawnPos = roomObj.find(FIND_MY_SPAWNS)[0].pos;
                var iNumsx = [spawnPos.x-7, spawnPos.x-4, spawnPos.x, spawnPos.x+4, spawnPos.x+7];
                var iNumsy = [spawnPos.y-7, spawnPos.y-4, spawnPos.y, spawnPos.y+4, spawnPos.y+7];
                if(sitesPlaced != CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]) {
                    for(var x = spawnPos.x - 6, y = spawnPos.y - 5; sitesPlaced < CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]; x++) {
                        if(!iNumsx.includes(x) && !iNumsy.includes(y)) {
                            if(roomObj.createConstructionSite(x, y, STRUCTURE_EXTENSION) == OK) {
                                sitesPlaced++;
                            }// =====
                        }// =====
                    }// =====
                } else {
                    roomObj.memory['state'] = NEXT_STATE;
                }// =====
                break;
        // ==============================
            
        // ------------------------------
            case 'Waiting on extensions':
                var NEXT_STATE = 'Complete Controller Level 6';
                var PREV_STATE = 'Building extensions';

                var mySites = roomObj.find(FIND_MY_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_EXTENSION}});
                var myStcrs = roomObj.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});

                if(mySites.length == 0 && myStcrs.length == CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]) {
                    roomObj.memory['state'] = NEXT_STATE;
                    roomObj.memory[LOOK_CREEPS][Constants.Roles.BUILD]                  = {max: 1};
                } else if((mySites.length + myStcrs.length) != CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]) {
                    roomObj.memory['state'] = PREV_STATE;
                }// =====
                break;
        // ==============================
            
        // ------------------------------
            case 'a':
                var NEXT_STATE = '';
                var PREV_STATE = '';
                
                roomObj.memory['state'] = NEXT_STATE;
                break;
        // ==============================
            
        // ------------------------------
            case 'Complete Controller Level 6':
                var NEXT_STATE = '';
                var PREV_STATE = '';

                break;
        // ==============================
        }// =====
        
    },// =====
};// ==============================