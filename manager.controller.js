const Constants = require('constants');

var devMessage = "Developer Test Message";
// console.log(devMessage);
// Constants.OutputObject();
// Constants.StringifyObject();

/**
 * Expected behavior:
 *      - Start construction of structures.
 */
module.exports = {
    
    /** @param (roomObj) room object **/
    run: function(roomObj) {
        
        /**
         * Initialize Room memory
         */
        if(_.isEmpty(roomObj.memory)) {
            roomObj.memory[STRUCTURE_EXTENSION] = {qty: 0};
        }// =====
        
        /**
         * For now, only 1 spawn in room, this will change
         */
        let spawnInRoom = _.filter(Game.spawns, (spawn) => spawn.room.name == roomObj.name)[0];
        
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
                
                console.log("Controller Level 1 Tactics");
                break;
                
            /**
             * Roads, 5 Containers, 1 Spawn, 5 Extensions (50 capacity), Ramparts (300K max hits), Walls
             */
            case 2:
                
                console.log("Controller Level 2 Tactics");
                // if x < 5
                if(roomObj.memory[STRUCTURE_EXTENSION].qty < CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]
                    && _.filter(Game.constructionSites, (site) => site.room.name === roomObj.name && site.structureType === STRUCTURE_EXTENSION).length < CONTROLLER_STRUCTURES[STRUCTURE_EXTENSION][roomObj.controller.level]) {
                    let rSpawnPos = _.filter(Game.spawns, (spawn) => spawn.room.name === roomObj.name)[0].pos;
                    for(let posx = rSpawnPos.x - 4; posx <= rSpawnPos.x + 4; posx += 2) {
                        let posy = rSpawnPos.y + 5;
                        let result = roomObj.createConstructionSite(posx, posy, STRUCTURE_EXTENSION);
                        if(result == 0) {
                            console.log("Created construction site", STRUCTURE_EXTENSION, posx, posy);
                            roomObj.memory[STRUCTURE_EXTENSION].qty += 1;
                            break;
                        } else if(result == -7) {
                            console.log("Bad location for craeting", STRUCTURE_EXTENSION, posx, posy);
                            continue;
                        } else {
                            console.log("Some estranged error creating extension construction site.");
                            console.log(devMessage);
                        }// =====
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