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
                var NEXT_STATE = 'Building extractors';
                var PREV_STATE = '';

                roomObj.memory[LOOK_CREEPS][Constants.Roles.GENERAL]                = {max: 3};
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
                    for(var x = spawnPos.x + 1, y = spawnPos.y + 1; sitesPlaced < CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]; x++) {
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

                // var posiblePos = [
                //     roomObj.getPositionAt((roomObj.controller.pos.x - 1), (roomObj.controller.pos.y - 1)),
                //     roomObj.getPositionAt((roomObj.controller.pos.x - 1), (roomObj.controller.pos.y + 1)),
                //     roomObj.getPositionAt((roomObj.controller.pos.x + 1), (roomObj.controller.pos.y - 1)),
                //     roomObj.getPositionAt((roomObj.controller.pos.x + 1), (roomObj.controller.pos.y + 1)),
                //     roomObj.getPositionAt((roomObj.controller.pos.x + 2), (roomObj.controller.pos.y)),
                //     roomObj.getPositionAt((roomObj.controller.pos.x - 2), (roomObj.controller.pos.y)),
                //     roomObj.getPositionAt((roomObj.controller.pos.x), (roomObj.controller.pos.y + 2)),
                //     roomObj.getPositionAt((roomObj.controller.pos.x), (roomObj.controller.pos.y - 2)),
                // ]
                
                var tl = roomObj.getPositionAt((roomObj.controller.pos.x - 1), (roomObj.controller.pos.y - 1));
                var tl_result = roomObj.createConstructionSite(tl, STRUCTURE_CONTAINER);
                // if(tl_result == OK) {
                //     roomObj.createConstructionSite(tl.x - 1, tl.y, STRUCTURE_ROAD);
                //     roomObj.createConstructionSite(tl.x + 1, tl.y, STRUCTURE_ROAD);
                //     roomObj.createConstructionSite(tl.x, tl.y + 1, STRUCTURE_ROAD);
                //     roomObj.createConstructionSite(tl.x, tl.y - 1, STRUCTURE_ROAD);
                // }// =====

                var bl = roomObj.getPositionAt((roomObj.controller.pos.x - 1), (roomObj.controller.pos.y + 1));
                var bl_result = roomObj.createConstructionSite(bl, STRUCTURE_CONTAINER);
                // if(bl_result == OK) {
                //     roomObj.createConstructionSite(bl.x - 1, bl.y, STRUCTURE_ROAD);
                //     roomObj.createConstructionSite(bl.x + 1, bl.y, STRUCTURE_ROAD);
                //     roomObj.createConstructionSite(bl.x, bl.y + 1, STRUCTURE_ROAD);
                //     roomObj.createConstructionSite(bl.x, bl.y - 1, STRUCTURE_ROAD);
                // }// =====

                var tr = roomObj.getPositionAt((roomObj.controller.pos.x + 1), (roomObj.controller.pos.y - 1));
                var tr_result = roomObj.createConstructionSite(tr, STRUCTURE_CONTAINER);
                // if(tr_result == OK) {
                //     roomObj.createConstructionSite(tr.x - 1, tr.y, STRUCTURE_ROAD);
                //     roomObj.createConstructionSite(tr.x + 1, tr.y, STRUCTURE_ROAD);
                //     roomObj.createConstructionSite(tr.x, tr.y + 1, STRUCTURE_ROAD);
                //     roomObj.createConstructionSite(tr.x, tr.y - 1, STRUCTURE_ROAD);
                // }// =====

                var br = roomObj.getPositionAt((roomObj.controller.pos.x + 1), (roomObj.controller.pos.y + 1));
                var br_result = roomObj.createConstructionSite(br, STRUCTURE_CONTAINER);
                // if(br_result == OK) {
                //     roomObj.createConstructionSite(br.x - 1, br.y, STRUCTURE_ROAD);
                //     roomObj.createConstructionSite(br.x + 1, br.y, STRUCTURE_ROAD);
                //     roomObj.createConstructionSite(br.x, br.y + 1, STRUCTURE_ROAD);
                //     roomObj.createConstructionSite(br.x, br.y - 1, STRUCTURE_ROAD);
                // }// =====

                var spawnPos = roomObj.find(FIND_MY_SPAWNS)[0].pos;
                var sc = roomObj.getPositionAt((spawnPos.x + 1), (spawnPos.y - 1));
                var sc_result = roomObj.createConstructionSite(sc, STRUCTURE_CONTAINER);

                roomObj.memory['state'] = NEXT_STATE;
                break;
        // ==============================
            
        // ------------------------------
            case 'Waiting on containers':
                var NEXT_STATE = 'Build roads';
                var PREV_STATE = 'Building Containers';

                var mySites = roomObj.find(FIND_MY_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_CONTAINER}});
                var myStcrs = roomObj.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});

                console.log("Sites:", mySites.length, "Containers:", myStcrs.length);
                if(mySites.length == 0 && myStcrs.length >= 2) {
                    roomObj.memory[LOOK_CREEPS][Constants.Roles.UPGRADE]                = {max: 2};
                    roomObj.memory[LOOK_CREEPS][Constants.Roles.LOCAL_ENERGY_HARVEST]   = {max: 4};
                    roomObj.memory[LOOK_CREEPS][Constants.Roles.BUILD]                  = {max: 0};
                    roomObj.memory[LOOK_CREEPS][Constants.Roles.GENERAL]                = {max: 4};
                    roomObj.memory['state'] = NEXT_STATE;
                }// =====
                break;
        // ==============================
            
        // ------------------------------
            case 'Build roads':
                var NEXT_STATE = 'Waiting on roads';
                var PREV_STATE = 'Waiting on containers';

                // var cntrs = roomObj.find(FIND_MY_STRUCTURES, {
                //     filter: (structure) => {
                //         return (structure.structureType == STRUCTURE_CONTAINER && structure.pos.inRangeTo(roomObj.controller.pos, 2));
                // }})
                // var source = roomObj.controller.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                // var pathToRoad = source.pos.findPathTo(source.pos.findClosestByPath(cntrs), {ignoreCreeps: true, ignoreRoads: true});
                // for(var step of pathToRoad) {
                //     roomObj.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                // }// =====

                // var spawnPos = roomObj.find(FIND_MY_SPAWNS)[0].pos;
                // var points = [
                //     roomObj.getPositionAt(spawnPos.x - 3, spawnPos.y),
                //     roomObj.getPositionAt(spawnPos.x + 3, spawnPos.y),
                //     roomObj.getPositionAt(spawnPos.x, spawnPos.y - 3),
                //     roomObj.getPositionAt(spawnPos.x, spawnPos.y + 3),
                // ];
                // var closestPoint = roomObj.controller.pos.findClosestByPath(points);
                // var pathConnecting = closestPoint.findPathTo(closestPoint.findClosestByPath(cntrs), {ignoreCreeps: true, ignoreRoads: true});
                // for(var step of pathConnecting) {
                //     roomObj.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                // }// =====

                roomObj.memory['state'] = NEXT_STATE;
                break;
        // ==============================
            
        // ------------------------------
            case 'Waiting on roads':
                var NEXT_STATE = 'Complete Controller Level 2';
                var PREV_STATE = 'Build roads';

                var mySites = roomObj.find(FIND_MY_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_ROAD}});

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