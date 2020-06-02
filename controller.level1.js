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
                var NEXT_STATE = 'Build roads around Spawn';
                var PREV_STATE = '';

                roomObj.memory[LOOK_CREEPS] = {};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.BUILD]                  = {max: 0};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.GENERAL]                = {max: 3};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.LOCAL_ENERGY_HARVEST]   = {max: 0};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.MELEE]                  = {max: 0};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.RANGE]                  = {max: 0};
                roomObj.memory[LOOK_CREEPS][Constants.Roles.UPGRADE]                = {max: 0};

                roomObj.memory['state'] = NEXT_STATE;
                break;
        // ==============================
            
        // ------------------------------
            case 'Build roads around Spawn':
                var NEXT_STATE = 'Complete Controller Level 1';
                var PREV_STATE = '';

                // var spawnPos = roomObj.find(FIND_MY_SPAWNS)[0].pos;
                // var x = spawnPos.x - 3;
                // var y = spawnPos.y - 3;
                // for(x; x < spawnPos.x + 4; x++) {
                //     if(x != spawnPos.x) {
                //         roomObj.createConstructionSite(x, spawnPos.y, STRUCTURE_ROAD);
                //     } else {
                //         for(y; y < spawnPos.y + 4; y++) {
                //             if(y == spawnPos.y) continue;
                //             roomObj.createConstructionSite(x, y, STRUCTURE_ROAD);
                //         }// =====
                //     }// =====
                // }// =====

                // var points = [
                //     roomObj.getPositionAt(spawnPos.x - 3, spawnPos.y),
                //     roomObj.getPositionAt(spawnPos.x + 3, spawnPos.y),
                //     roomObj.getPositionAt(spawnPos.x, spawnPos.y - 3),
                //     roomObj.getPositionAt(spawnPos.x, spawnPos.y + 3),
                // ];
                // var source = spawnPos.findClosestByPath(FIND_SOURCES_ACTIVE);
                // var pathToRoad = source.pos.findPathTo(source.pos.findClosestByPath(points), {ignoreCreeps: true, ignoreRoads: true});
                // for(var step of pathToRoad) {
                //     roomObj.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                // }// =====

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