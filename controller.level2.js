const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

/**
 * Roads, 5 Containers, 1 Spawn, 5 Extensions (50 capacity), Ramparts (300K max hits), Walls
 */
module.exports = {
    
    /** @param (roomObj) room object **/
    run: function(roomObj) {

        switch(roomObj.memory['state']) {

        // ------------------------------
            default:
                var NEXT_STATE = 'Build roads around spawn';
                var PREV_STATE = '';

                roomObj.memory[LOOK_CREEPS][Constants.Roles.BUILD]                  = {max: 2};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.GENERAL]                = {max: 0};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.LOCAL_ENERGY_HARVEST]   = {max: 3};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.MELEE]                  = {max: 0};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.RANGE]                  = {max: 0};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.UPGRADE]                = {max: 2};

                roomObj.memory['state'] = NEXT_STATE;
                break;
        // ==============================
            
        // ------------------------------
            case 'Build roads around spawn':
                var NEXT_STATE = 'Waiting on roads around spawn';
                var PREV_STATE = '';

                var spawnPos = roomObj.find(FIND_MY_SPAWNS)[0].pos;
                var iNumsx = [spawnPos.x-7, spawnPos.x-4, spawnPos.x, spawnPos.x+4, spawnPos.x+7];
                var iNumsy = [spawnPos.y-7, spawnPos.y-4, spawnPos.y, spawnPos.y+4, spawnPos.y+7];
                for(var x = spawnPos.x - 7; x <= spawnPos.x + 7; x++) {
                    for(var y = spawnPos.y - 7; y <= spawnPos.y + 7; y++) {
                        if((iNumsx.includes(x) || iNumsy.includes(y)) &&
                                !(iNumsx.includes(x) && iNumsy.includes(y))) {

                            roomObj.createConstructionSite(x, y, STRUCTURE_ROAD);
                        }// =====
                    }// =====
                }// =====

                roomObj.memory['state'] = NEXT_STATE;
                break;
        // ==============================
            
        // ------------------------------
            case 'Waiting on roads around spawn':
                var NEXT_STATE = 'Building extractors';
                var PREV_STATE = 'Build roads';

                var mySites = roomObj.find(FIND_MY_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_ROAD}});

                if(mySites.length == 0) {
                    roomObj.memory['state'] = NEXT_STATE;
                }// =====
                break;
        // ==============================
            
        // ------------------------------
            case 'Building extractors':
                var NEXT_STATE = 'Waiting on extractors';
                var PREV_STATE = '';

                var mySites = roomObj.find(FIND_MY_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_EXTENSION}});
                var myStcrs = roomObj.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}});

                var sitesPlaced = mySites.length + myStcrs.length;
                var iNumsx = [spawnPos.x-7, spawnPos.x-4, spawnPos.x, spawnPos.x+4, spawnPos.x+7];
                var iNumsy = [spawnPos.y-7, spawnPos.y-4, spawnPos.y, spawnPos.y+4, spawnPos.y+7];
                if(sitesPlaced != CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]) {
                    var spawnPos = roomObj.find(FIND_MY_SPAWNS)[0].pos;
                    for(var x = spawnPos.x - 6, y = spawnPos.y + 3; sitesPlaced < CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]; x++) {
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
            case 'Waiting on extractors':
                var NEXT_STATE = 'Building containers';
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
            case 'Building containers':
                var NEXT_STATE = 'Waiting on containers';
                var PREV_STATE = 'Waiting on extractors';

                var posiblePos = [
                    roomObj.getPositionAt((roomObj.controller.pos.x - 1), (roomObj.controller.pos.y - 1)),
                    roomObj.getPositionAt((roomObj.controller.pos.x - 1), (roomObj.controller.pos.y + 1)),
                    roomObj.getPositionAt((roomObj.controller.pos.x + 1), (roomObj.controller.pos.y - 1)),
                    roomObj.getPositionAt((roomObj.controller.pos.x + 1), (roomObj.controller.pos.y + 1)),
                    roomObj.getPositionAt((roomObj.controller.pos.x + 2), (roomObj.controller.pos.y)),
                    roomObj.getPositionAt((roomObj.controller.pos.x - 2), (roomObj.controller.pos.y)),
                    roomObj.getPositionAt((roomObj.controller.pos.x), (roomObj.controller.pos.y + 2)),
                    roomObj.getPositionAt((roomObj.controller.pos.x), (roomObj.controller.pos.y - 2)),
                ];// =====
                for(var posObj of posiblePos) {
                    if(roomObj.createConstructionSite(posObj, STRUCTURE_CONTAINER) == OK) {
                        break;
                    }// =====
                }// =====

                // var spawnPos = roomObj.find(FIND_MY_SPAWNS)[0].pos;
                // var sc = roomObj.getPositionAt((spawnPos.x + 1), (spawnPos.y - 1));
                // var sc_result = roomObj.createConstructionSite(sc, STRUCTURE_CONTAINER);

                roomObj.memory['state'] = NEXT_STATE;
                break;
        // ==============================
            
        // ------------------------------
            case 'Waiting on containers':
                var NEXT_STATE = 'Complete Controller Level 2';
                var PREV_STATE = 'Building Containers';

                var mySites = roomObj.find(FIND_MY_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_CONTAINER}});

                if(mySites.length == 0) {
                    roomObj.memory['state'] = NEXT_STATE;
                }// =====
                break;
        // ==============================
            
        // ------------------------------
            case 'Complete Controller Level 2':
                break;
        // ==============================

        }// =====
    },// =====
};// ==============================