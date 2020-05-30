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
            /**
             * Roads, 5 Containers
             */
            default:
            case 0:
                
                console.log("Controller Level 0 Tactics");
                break;
                
            /**
             * Roads, 5 Containers, 1 Spawn
             */
            case 1:
                
                if(JSON.stringify(roomObj.memory) === '{}' || roomObj.memory['complete'] == false) {
                    console.log("Controller Level 1 Tactics");

                    /**
                     * Initialize Memory
                     */
                    if(roomObj.memory['stage'] == undefined || roomObj.memory['stage'] < roomObj.controller.level) {
                        roomObj.memory[STRUCTURE_CONTROLLER] = {};
                        roomObj.memory[STRUCTURE_CONTROLLER][STRUCTURE_CONTAINER] = {'placed': false};
                        roomObj.memory[STRUCTURE_SPAWN] = {};
                        roomObj.memory[STRUCTURE_SPAWN][STRUCTURE_ROAD] = {'placed': false};
                        roomObj.memory[LOOK_CREEPS] = {};
                        roomObj.memory[LOOK_CREEPS][Constants.Roles.BUILD] = {max: 0};
                        roomObj.memory[LOOK_CREEPS][Constants.Roles.GENERAL] = {max: 6};
                        roomObj.memory[LOOK_CREEPS][Constants.Roles.LOCAL_ENERGY_HARVEST] = {max: 0};
                        roomObj.memory[LOOK_CREEPS][Constants.Roles.MELEE] = {max: 0};
                        roomObj.memory[LOOK_CREEPS][Constants.Roles.RANGE] = {max: 0};
                        roomObj.memory[LOOK_CREEPS][Constants.Roles.UPGRADE] = {max: 0};
                        roomObj.memory['stage'] = roomObj.controller.level;
                        roomObj.memory['complete'] = false;
                        
                        Constants.OutputObject(roomObj.memory);
                    }// =====

                    /**
                     * Build roads around Spawn
                     */
                    var startCpu = Game.cpu.getUsed();
                    let spawnPoints = [];
                    if(roomObj.memory[STRUCTURE_SPAWN][STRUCTURE_ROAD]['placed'] == false) {
                        let spawnPos = roomObj.find(FIND_MY_SPAWNS)[0].pos;
                        let x = spawnPos.x - 3;
                        let y = spawnPos.y - 3;
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

                        // build roads to source from one of the ends
                        spawnPoints = [
                            roomObj.getPositionAt((spawnPos.x), (spawnPos.y - 3)),
                            roomObj.getPositionAt((spawnPos.x), (spawnPos.y + 3)),
                            roomObj.getPositionAt((spawnPos.x - 3), (spawnPos.y)),
                            roomObj.getPositionAt((spawnPos.x + 3), (spawnPos.y)),
                        ];// =====
                        let source = spawnPos.findClosestByPath(FIND_SOURCES_ACTIVE);
                        let pathToRoad = source.pos.findPathTo(source.pos.findClosestByPath(spawnPoints), {ignoreCreeps: true, ignoreRoads: true});
                        for(var step of pathToRoad) {
                            roomObj.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                        }// =====

                        roomObj.memory[STRUCTURE_SPAWN][STRUCTURE_ROAD]['placed'] = true;
                    }// =====
                    var elapsed = Game.cpu.getUsed() - startCpu;
                    console.log("Setting up spawn level 1 has used", elapsed, "CPU time");

                    /**
                     * Build containers around controller.
                     * Build roads connecting containers.
                     * Build roads connecting closest source.
                     */
                    startCpu = Game.cpu.getUsed();
                    let ctlrContainers = [];
                    if(roomObj.memory[STRUCTURE_CONTROLLER][STRUCTURE_CONTAINER]['placed'] == false) {

                        let tl = roomObj.getPositionAt((roomObj.controller.pos.x - 1), (roomObj.controller.pos.y - 1));
                        let tl_result = roomObj.createConstructionSite(tl, STRUCTURE_CONTAINER);
                        if(tl_result == OK) {
                            roomObj.createConstructionSite(tl.x - 1, tl.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(tl.x + 1, tl.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(tl.x, tl.y + 1, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(tl.x, tl.y - 1, STRUCTURE_ROAD);
                            ctlrContainers.push(tl);
                        }// =====

                        let bl = roomObj.getPositionAt((roomObj.controller.pos.x - 1), (roomObj.controller.pos.y + 1));
                        let bl_result = roomObj.createConstructionSite(bl, STRUCTURE_CONTAINER);
                        if(bl_result == OK) {
                            roomObj.createConstructionSite(bl.x - 1, bl.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(bl.x + 1, bl.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(bl.x, bl.y + 1, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(bl.x, bl.y - 1, STRUCTURE_ROAD);
                            ctlrContainers.push(bl);
                        }// =====

                        let tr = roomObj.getPositionAt((roomObj.controller.pos.x + 1), (roomObj.controller.pos.y - 1));
                        let tr_result = roomObj.createConstructionSite(tr, STRUCTURE_CONTAINER);
                        if(tr_result == OK) {
                            roomObj.createConstructionSite(tr.x - 1, tr.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(tr.x + 1, tr.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(tr.x, tr.y + 1, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(tr.x, tr.y - 1, STRUCTURE_ROAD);
                            ctlrContainers.push(tr);
                        }// =====

                        let br = roomObj.getPositionAt((roomObj.controller.pos.x + 1), (roomObj.controller.pos.y + 1));
                        let br_result = roomObj.createConstructionSite(br, STRUCTURE_CONTAINER);
                        if(br_result == OK) {
                            roomObj.createConstructionSite(br.x - 1, br.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(br.x + 1, br.y, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(br.x, br.y + 1, STRUCTURE_ROAD);
                            roomObj.createConstructionSite(br.x, br.y - 1, STRUCTURE_ROAD);
                            ctlrContainers.push(br);
                        }// =====
                        
                        // build roads to source from one of the containers
                        let source = roomObj.controller.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                        let pathToRoad = source.pos.findPathTo(source.pos.findClosestByPath(ctlrContainers), {ignoreCreeps: true, ignoreRoads: true, range: 1});
                        for(var step of pathToRoad) {
                            roomObj.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                        }// =====
                        
                        roomObj.memory[STRUCTURE_CONTROLLER][STRUCTURE_CONTAINER]['placed'] = true;
                    }// =====
                    elapsed = Game.cpu.getUsed() - startCpu;
                    console.log("Setting up controller level 1 has used", elapsed, "CPU time");

                    /**
                     * Build roads connecting Spawn to Controller
                     */
                    var startCpu = Game.cpu.getUsed();
                    if(roomObj.memory[STRUCTURE_SPAWN][STRUCTURE_ROAD]['placed'] == true &&
                    roomObj.memory[STRUCTURE_CONTROLLER][STRUCTURE_CONTAINER]['placed'] == true) {

                        let spawnPos = roomObj.find(FIND_MY_SPAWNS)[0].pos;
                        let closestPoint = roomObj.controller.pos.findClosestByPath(spawnPoints);
                        let pathConnecting = closestPoint.findPathTo(closestPoint.findClosestByPath(ctlrContainers), {ignoreCreeps: true, ignoreRoads: true, range: 1});
                        for(var step of pathConnecting) {
                            roomObj.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
                        }// =====

                    }// =====
                    elapsed = Game.cpu.getUsed() - startCpu;
                    console.log("Connecting controller and spawn has used", elapsed, "CPU time");
                    
                    roomObj.memory['complete'] = true;
                } else {
                    console.log("Controller stage 1 complete. No more to do here.");
                }// =====
                break;
                
            /**
             * Roads, 5 Containers, 1 Spawn, 5 Extensions (50 capacity), Ramparts (300K max hits), Walls
             */
            case 2:
                
                if(roomObj.memory['stage'] < roomObj.controller.level) {
                    roomObj.memory[STRUCTURE_EXTENSION] = {qty: 0};
                    roomObj.memory[LOOK_CREEPS][Constants.Roles.BUILD] = {max: 2};
                    roomObj.memory[LOOK_CREEPS][Constants.Roles.GENERAL] = {max: 0};
                    roomObj.memory[LOOK_CREEPS][Constants.Roles.LOCAL_ENERGY_HARVEST] = {max: 3};
                    roomObj.memory[LOOK_CREEPS][Constants.Roles.MELEE] = {max: 0};
                    roomObj.memory[LOOK_CREEPS][Constants.Roles.RANGE] = {max: 0};
                    roomObj.memory[LOOK_CREEPS][Constants.Roles.UPGRADE] = {max: 4};
                    roomObj.memory['stage'] = roomObj.controller.level;
                    roomObj.memory['complete'] = false;
                }// =====
                
                
                console.log("Controller Level 2 Tactics");
                // if x < 5
                if(roomObj.memory[STRUCTURE_EXTENSION].qty < CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]) {
                    let spawnPos = roomObj.find(FIND_MY_SPAWNS)[0].pos;
                    for(let posx = spawnPos.x - 3, posy = spawnPos.y + 1; posx >= spawnPos.x + 5; posx += 2) {
                        let result = roomObj.createConstructionSite(posx, posy, STRUCTURE_EXTENSION);
                        if(result == 0) {
                            console.log("Created construction site", STRUCTURE_EXTENSION, posx, posy);
                            roomObj.memory[STRUCTURE_EXTENSION].qty += 1;
                            break;
                        }
                    }// =====
                }// =====
                break;
                
            /**
             * Roads, 5 Containers, 1 Spawn, 10 Extensions (50 capacity), Ramparts (1M max hits), Walls, 1 Tower
             */
            case 3:
                
                console.log("Controller Level 3 Tactics");
                break;
                
            /**
             * Roads, 5 Containers, 1 Spawn, 20 Extensions (50 capacity), Ramparts (3M max hits), Walls, 1 Tower, Storage
             */
            case 4:
                
                console.log("Controller Level 4 Tactics");
                break;
                
            /**
             * Roads, 5 Containers, 1 Spawn, 30 Extensions (50 capacity), Ramparts (10M max hits), Walls, 2 Towers, Storage, 2 Links
             */
            case 5:
                
                console.log("Controller Level 5 Tactics");
                break;
                
            /**
             * Roads, 5 Containers, 1 Spawn, 40 Extensions (50 capacity), Ramparts (30M max hits), Walls, 2 Towers, 
             * Storage, 3 Links, Extractor, 3 Labs, Terminal
             */
            case 6:
                
                console.log("Controller Level 6 Tactics");
                break;
                
            /**
             * Roads, 5 Containers, 2 Spawns, 50 Extensions (100 capacity), Ramparts (100M max hits), Walls, 3 Towers, 
             * Storage, 4 Links, Extractor, 6 Labs, Terminal
             */
            case 7:
                
                console.log("Controller Level 7 Tactics");
                break;
                
            /**
             * Roads, 5 Containers, 3 Spawns, 60 Extensions (200 capacity), Ramparts (300M max hits), Walls, 6 Towers, 
             * Storage, 6 Links, Extractor, 10 Labs, Terminal, Observer, Power Spawn
             */
            case 8:
                
                console.log("Controller Level 8 Tactics");
                break;
                
        }// =====
    }// ==============================

};// ==============================