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
                Constants.OutputObject(roomObj.memory);
                if(JSON.stringify(roomObj.memory) === '{}' || roomObj.memory['complete'] == false) {
                    console.log("Controller Level 1 Tactics");

                    /**
                     * Initialize Memory
                     */
                    if(roomObj.memory['stage'] == undefined || roomObj.memory['stage'] < roomObj.controller.level) {
                        console.log(devMessage);
                        roomObj.memory[STRUCTURE_CONTROLLER] = {};
                        roomObj.memory[STRUCTURE_CONTROLLER][STRUCTURE_CONTAINER] = {'placed': false};
                        roomObj.memory[STRUCTURE_SPAWN] = {};
                        roomObj.memory[STRUCTURE_SPAWN][STRUCTURE_ROAD] = {'placed': false};
                        roomObj.memory[LOOK_CREEPS] = {};
                        roomObj.memory[LOOK_CREEPS][Constants.Roles.GENERAL] = {max: 10};
                        roomObj.memory['stage'] = roomObj.controller.level;
                        roomObj.memory['complete'] = false;
                    }// =====

                    /**
                     * Build roads around Spawn
                     */
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
                        roomObj.memory[STRUCTURE_SPAWN][STRUCTURE_ROAD]['placed'] = true;
                    }// =====

                    /**
                     * Build containers around controller. Build roads connecting containers.
                     */
                    if(roomObj.memory[STRUCTURE_CONTROLLER][STRUCTURE_CONTAINER]['placed'] == false) {
                        let tl = roomObj.getPositionAt((roomObj.controller.pos.x - 1), (roomObj.controller.pos.y - 1));
                        let tl_result = roomObj.createConstructionSite(tl, STRUCTURE_CONTAINER);
                        let bl = roomObj.getPositionAt((roomObj.controller.pos.x - 1), (roomObj.controller.pos.y + 1));
                        let bl_result = roomObj.createConstructionSite(bl, STRUCTURE_CONTAINER);
                        let tr = roomObj.getPositionAt((roomObj.controller.pos.x + 1), (roomObj.controller.pos.y - 1));
                        let tr_result = roomObj.createConstructionSite(tr, STRUCTURE_CONTAINER);
                        let br = roomObj.getPositionAt((roomObj.controller.pos.x + 1), (roomObj.controller.pos.y + 1));
                        let br_result = roomObj.createConstructionSite(br, STRUCTURE_CONTAINER);
                        
                        // TOP
                        if(tl_result == OK && tr_result == OK) {
                            for(let y = tl.y, x = tl.x + 1; x < tr.x; x++) {
                                roomObj.createConstructionSite(x, y, STRUCTURE_ROAD);
                            }// =====
                        }// =====
                        
                        // LEFT
                        if(tl_result == OK && bl_result == OK) {
                            for(let y = tl.y + 1, x = tl.x; y < bl.y; y++) {
                                roomObj.createConstructionSite(x, y, STRUCTURE_ROAD);
                            }// =====
                        }// =====
                        
                        // RIGHT
                        if(br_result == OK && tr_result == OK) {
                            for(let y = tr.y + 1, x = tr.x; y < br.y; y++) {
                                roomObj.createConstructionSite(x, y, STRUCTURE_ROAD);
                            }// =====
                        }// =====
                        
                        // BOTTOM
                        if(br_result == OK && bl_result == OK) {
                            for(let y = bl.y, x = bl.x + 1; x < br.x; x++) {
                                roomObj.createConstructionSite(x, y, STRUCTURE_ROAD);
                            }// =====
                        }// =====
                        roomObj.memory[STRUCTURE_CONTROLLER][STRUCTURE_CONTAINER]['placed'] = true;
                    }// =====
                    
                    
                    roomObj.memory['complete'] = true;
                }// =====
                break;
                
            /**
             * Roads, 5 Containers, 1 Spawn, 5 Extensions (50 capacity), Ramparts (300K max hits), Walls
             */
            case 2:
                
                if(roomObj.memory['stage'] < roomObj.controller.level) {
                    roomObj.memory[STRUCTURE_EXTENSION] = {qty: 0};
                    roomObj.memory['stage'] = roomObj.controller.level;
                    roomObj.memory['complete'] = false;
                }// =====
                
                
                console.log("Controller Level 2 Tactics");
                // if x < 5
                if(roomObj.memory[STRUCTURE_EXTENSION].qty < CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]) {
                    let spawnPos = roomObj.find(FIND_MY_SPAWNS)[0].pos;
                    for(let posx = rSpawnPos.x - 5; posx <= rSpawnPos.x + 5; posx += 2) {
                        let posy = rSpawnPos.y + 1;
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