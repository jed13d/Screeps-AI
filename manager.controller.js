const Constants = require('constants');

var devMessage = "Developer Test Message";
// console.log(devMessage);
// Constants.OutputObject();
// Constants.StringifyObject();

module.exports = {
    
    /** @param (roomObj) room object **/
    run: function(roomObj) {
        
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

                console.log("Controller Level:", roomObj.controller.level, "State:", roomObj.memory['state']);
                break;
        // ==============================
            
        // ------------------------------
            /**
             * Roads, 5 Containers, 1 Spawn
             */
            case 1:

                console.log("Controller Level:", roomObj.controller.level, "State:", roomObj.memory['state']);
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

                        var spawnPos = roomObj.find(FIND_MY_SPAWNS)[0].pos;
                        var x = spawnPos.x - 3;
                        var y = spawnPos.y - 3;
                        for(x; x < spawnPos.x + 4; x++) {
                            if(x != spawnPos.x) {
                                roomObj.createConstructionSite(x, spawnPos.y, STRUCTURE_ROAD);
                            } else {
                                for(y; y < spawnPos.y + 4; y++) {
                                    if(y == spawnPos.y) continue;
                                    roomObj.createConstructionSite(x, y, STRUCTURE_ROAD);
                                }// =====
                            }// =====
                        }// =====

                        var points = [
                            roomObj.getPositionAt(spawnPos.x - 3, spawnPos.y),
                            roomObj.getPositionAt(spawnPos.x + 3, spawnPos.y),
                            roomObj.getPositionAt(spawnPos.x, spawnPos.y - 3),
                            roomObj.getPositionAt(spawnPos.x, spawnPos.y + 3),
                        ];
                        var source = spawnPos.findClosestByPath(FIND_SOURCES_ACTIVE);
                        var pathToRoad = source.pos.findPathTo(source.pos.findClosestByPath(points), {ignoreCreeps: true, ignoreRoads: true});
                        for(var step of pathToRoad) {
                            roomObj.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                        }// =====

                        roomObj.memory['state'] = NEXT_STATE;
                        break;
                // ==============================
                    
                // ------------------------------
                    case 'Complete Controller Level 1':
                        break;
                // ==============================

                }// =====
                break;
        // ==============================
            
        // ------------------------------
            /**
             * Roads, 5 Containers, 1 Spawn, 5 Extensions (50 capacity), Ramparts (300K max hits), Walls
             */
            case 2:

                console.log("Controller Level:", roomObj.controller.level, "State:", roomObj.memory['state']);
                switch(roomObj.memory['state']) {

                // ------------------------------
                    default:
                        var NEXT_STATE = 'Building extractors near spawn';
                        var PREV_STATE = '';

                        roomObj.memory[LOOK_CREEPS][Constants.Roles.GENERAL]                = {max: 6};
                        roomObj.memory['state'] = NEXT_STATE;
                        break;
                // ==============================
                    
                // ------------------------------
                    case 'Building extractors near spawn':
                        var NEXT_STATE = 'Waiting on extractors to be built';
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
                    case 'Waiting on extractors to be built':
                        var NEXT_STATE = 'Building Container(s) around Controller and Spawn';
                        var PREV_STATE = 'Building extractors near spawn';

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
                    case 'Building Container(s) around Controller and Spawn':
                        var NEXT_STATE = 'Waiting on containers to be built';
                        var PREV_STATE = 'Waiting on extractors to be built';

                        var tl = roomObj.getPositionAt((roomObj.controller.pos.x - 1), (roomObj.controller.pos.y - 1));
                        var tl_result = roomObj.createConstructionSite(tl, STRUCTURE_CONTAINER);
                        if(tl_result == OK) {
                            roomObj.createConstructionSite(tl.x - 1, tl.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(tl.x + 1, tl.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(tl.x, tl.y + 1, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(tl.x, tl.y - 1, STRUCTURE_ROAD);
                        }// =====

                        var bl = roomObj.getPositionAt((roomObj.controller.pos.x - 1), (roomObj.controller.pos.y + 1));
                        var bl_result = roomObj.createConstructionSite(bl, STRUCTURE_CONTAINER);
                        if(bl_result == OK) {
                            roomObj.createConstructionSite(bl.x - 1, bl.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(bl.x + 1, bl.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(bl.x, bl.y + 1, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(bl.x, bl.y - 1, STRUCTURE_ROAD);
                        }// =====

                        var tr = roomObj.getPositionAt((roomObj.controller.pos.x + 1), (roomObj.controller.pos.y - 1));
                        var tr_result = roomObj.createConstructionSite(tr, STRUCTURE_CONTAINER);
                        if(tr_result == OK) {
                            roomObj.createConstructionSite(tr.x - 1, tr.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(tr.x + 1, tr.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(tr.x, tr.y + 1, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(tr.x, tr.y - 1, STRUCTURE_ROAD);
                        }// =====

                        var br = roomObj.getPositionAt((roomObj.controller.pos.x + 1), (roomObj.controller.pos.y + 1));
                        var br_result = roomObj.createConstructionSite(br, STRUCTURE_CONTAINER);
                        if(br_result == OK) {
                            roomObj.createConstructionSite(br.x - 1, br.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(br.x + 1, br.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(br.x, br.y + 1, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(br.x, br.y - 1, STRUCTURE_ROAD);
                        }// =====

                        var spawnPos = roomObj.find(FIND_MY_SPAWNS)[0].pos;
                        var sc = roomObj.getPositionAt((spawnPos.x + 1), (spawnPos.y - 1));
                        var sc_result = roomObj.createConstructionSite(sc, STRUCTURE_CONTAINER);

                        roomObj.memory['state'] = NEXT_STATE;
                        break;
                // ==============================
                    
                // ------------------------------
                    case 'Waiting on containers to be built':
                        var NEXT_STATE = 'Build roads to connect controller to spawn and to source.';
                        var PREV_STATE = 'Building Container(s) around Controller and Spawn';

                        var mySites = roomObj.find(FIND_MY_CONSTRUCTION_SITES, {filter: {structureType: STRUCTURE_CONTAINER}});
                        var myStcrs = roomObj.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_CONTAINER}});

                        if(mySites.length == 0 && myStcrs.length >= 2) {
                            roomObj.memory[LOOK_CREEPS][Constants.Roles.UPGRADE]                = {max: 4};
                            roomObj.memory[LOOK_CREEPS][Constants.Roles.LOCAL_ENERGY_HARVEST]   = {max: 3};
                            roomObj.memory[LOOK_CREEPS][Constants.Roles.BUILD]                  = {max: 2};
                            roomObj.memory[LOOK_CREEPS][Constants.Roles.GENERAL]                = {max: 0};
                            roomObj.memory['state'] = NEXT_STATE;
                        }// =====
                        break;
                // ==============================
                    
                // ------------------------------
                    case 'Build roads to connect controller to spawn and to source.':
                        var NEXT_STATE = 'Waiting on connector roads to be built.';
                        var PREV_STATE = 'Waiting on containers to be built';

                        var cntrs = roomObj.find(FIND_MY_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_CONTAINER && structure.pos.inRangeTo(roomObj.controller.pos, 2));
                        }})
                        var source = roomObj.controller.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                        var pathToRoad = source.pos.findPathTo(source.pos.findClosestByPath(cntrs), {ignoreCreeps: true, ignoreRoads: true});
                        for(var step of pathToRoad) {
                            roomObj.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                        }// =====

                        var spawnPos = roomObj.find(FIND_MY_SPAWNS)[0].pos;
                        var points = [
                            roomObj.getPositionAt(spawnPos.x - 3, spawnPos.y),
                            roomObj.getPositionAt(spawnPos.x + 3, spawnPos.y),
                            roomObj.getPositionAt(spawnPos.x, spawnPos.y - 3),
                            roomObj.getPositionAt(spawnPos.x, spawnPos.y + 3),
                        ];
                        var closestPoint = roomObj.controller.pos.findClosestByPath(points);
                        var pathConnecting = closestPoint.findPathTo(closestPoint.findClosestByPath(cntrs), {ignoreCreeps: true, ignoreRoads: true});
                        for(var step of pathConnecting) {
                            roomObj.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                        }// =====

                        roomObj.memory['state'] = NEXT_STATE;
                        break;
                // ==============================
                    
                // ------------------------------
                    case 'Waiting on connector roads to be built.':
                        var NEXT_STATE = 'Complete Controller Level 2';
                        var PREV_STATE = 'Build roads to connect controller to spawn and to source.';

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
                break;
        // ==============================
            
        // ------------------------------
            /**
             * Roads, 5 Containers, 1 Spawn, 10 Extensions (50 capacity), Ramparts (1M max hits), Walls, 1 Tower
             */
            case 3:

                console.log("Controller Level:", roomObj.controller.level, "State:", roomObj.memory['state']);
                switch(roomObj.memory['state']) {
                    
                // ------------------------------
                    default:
                        break;
                // ==============================
                    
                // ------------------------------
                    case 'a':
                        var NEXT_STATE = '';
                        var PREV_STATE = '';

                        break;
                // ==============================
                    
                // ------------------------------
                    case 'b':
                        var NEXT_STATE = '';
                        var PREV_STATE = '';

                        break;
                // ==============================
                }// =====
                break;
        // ==============================
            
        // ------------------------------
            /**
             * Roads, 5 Containers, 1 Spawn, 20 Extensions (50 capacity), Ramparts (3M max hits), Walls, 1 Tower, Storage
             */
            case 4:

                console.log("Controller Level:", roomObj.controller.level, "State:", roomObj.memory['state']);
                switch(roomObj.memory['state']) {
                    
                // ------------------------------
                    default:
                        break;
                // ==============================
                    
                // ------------------------------
                    case 'a':
                        var NEXT_STATE = '';
                        var PREV_STATE = '';

                        break;
                // ==============================
                    
                // ------------------------------
                    case 'b':
                        var NEXT_STATE = '';
                        var PREV_STATE = '';

                        break;
                // ==============================
                }// =====
                break;
        // ==============================
            
        // ------------------------------
            /**
             * Roads, 5 Containers, 1 Spawn, 30 Extensions (50 capacity), Ramparts (10M max hits), Walls, 2 Towers, Storage, 2 Links
             */
            case 5:

                console.log("Controller Level:", roomObj.controller.level, "State:", roomObj.memory['state']);
                switch(roomObj.memory['state']) {
                    
                // ------------------------------
                    default:
                        break;
                // ==============================
                    
                // ------------------------------
                    case 'a':
                        var NEXT_STATE = '';
                        var PREV_STATE = '';

                        break;
                // ==============================
                    
                // ------------------------------
                    case 'b':
                        var NEXT_STATE = '';
                        var PREV_STATE = '';

                        break;
                // ==============================
                }// =====
                break;
        // ==============================
            
        // ------------------------------
            /**
             * Roads, 5 Containers, 1 Spawn, 40 Extensions (50 capacity), Ramparts (30M max hits), Walls, 2 Towers, 
             * Storage, 3 Links, Extractor, 3 Labs, Terminal
             */
            case 6:

                console.log("Controller Level:", roomObj.controller.level, "State:", roomObj.memory['state']);
                switch(roomObj.memory['state']) {
                    
                // ------------------------------
                    default:
                        break;
                // ==============================
                    
                // ------------------------------
                    case 'a':
                        var NEXT_STATE = '';
                        var PREV_STATE = '';

                        break;
                // ==============================
                    
                // ------------------------------
                    case 'b':
                        var NEXT_STATE = '';
                        var PREV_STATE = '';

                        break;
                // ==============================
                }// =====
                break;
        // ==============================
            
        // ------------------------------
            /**
             * Roads, 5 Containers, 2 Spawns, 50 Extensions (100 capacity), Ramparts (100M max hits), Walls, 3 Towers, 
             * Storage, 4 Links, Extractor, 6 Labs, Terminal
             */
            case 7:

                console.log("Controller Level:", roomObj.controller.level, "State:", roomObj.memory['state']);
                switch(roomObj.memory['state']) {
                    
                // ------------------------------
                    default:
                        break;
                // ==============================
                    
                // ------------------------------
                    case 'a':
                        var NEXT_STATE = '';
                        var PREV_STATE = '';

                        break;
                // ==============================
                    
                // ------------------------------
                    case 'b':
                        var NEXT_STATE = '';
                        var PREV_STATE = '';

                        break;
                // ==============================
                }// =====
                break;
        // ==============================
            
        // ------------------------------
            /**
             * Roads, 5 Containers, 3 Spawns, 60 Extensions (200 capacity), Ramparts (300M max hits), Walls, 6 Towers, 
             * Storage, 6 Links, Extractor, 10 Labs, Terminal, Observer, Power Spawn
             */
            case 8:

                console.log("Controller Level:", roomObj.controller.level, "State:", roomObj.memory['state']);
                switch(roomObj.memory['state']) {
                    
                // ------------------------------
                    default:
                        break;
                // ==============================
                    
                // ------------------------------
                    case 'a':
                        var NEXT_STATE = '';
                        var PREV_STATE = '';

                        break;
                // ==============================
                    
                // ------------------------------
                    case 'b':
                        var NEXT_STATE = '';
                        var PREV_STATE = '';

                        break;
                // ==============================
                }// =====
                break;
        // ==============================

        }// =====
    }// ==============================

};// ==============================