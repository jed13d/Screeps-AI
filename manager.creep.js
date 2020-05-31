const roleBuilder = require('role.builder');
const roleGeneral = require('role.general');
const roleLNHarvester = require('role.local.energy.harvester');
const roleUpgrader = require('role.upgrader');
const Constants = require('constants');

var devMessage = "Developer Test Message";
// console.log(devMessage);
// Constants.OutputObject();
// Constants.StringifyObject();

module.exports = {
    
    /** @param (roomObj) room object **/
    run: function(roomObj) {
        
        let allCreepsInRoom = roomObj.find(FIND_MY_CREEPS);
        console.log("Number of workers:", allCreepsInRoom.length);
        
        /**
         * Spawn workers, only if energy is at max capacity
         * Hopefully, by order of appearance in Constants.Workers{}
         */
        if(roomObj.energyAvailable === roomObj.energyCapacityAvailable) {
            for(let workerRole in Constants.Roles) {
                let roleTitle = Constants.Roles[workerRole];
                
                /**
                 * Build first needed worker found. Then, report the spawning.
                 */ 
                if(_.filter(allCreepsInRoom, (creep) => creep.memory.role === roleTitle).length < roomObj.memory[LOOK_CREEPS][roleTitle].max) {
                    let workerName = roleTitle + Game.time;
                    let rSpawn = roomObj.find(FIND_MY_SPAWNS)[0];
                    
                    // used for choosing largest creep build option
                    let nrgToUse = 0;
                    for(let cost of Constants.Workers[roleTitle].buildCosts) {
                        if(cost > nrgToUse && roomObj.energyCapacityAvailable >= cost) {
                            nrgToUse = cost;
                        }// =====
                    };// =====
                    
                    // attempt to spawn
                    rSpawn.spawnCreep(
                        Constants.Workers[roleTitle].parts[nrgToUse],
                        workerName,
                        Constants.Workers[roleTitle].options
                    );
                }// ===== if
                
            }// ===== for
        }// ===== if

        /**
         * Orders for creeps based on role.
         * - roleBuilder
         * - roleGeneral
         * - roleLNHarvester
         * - roleUpgrader
         */
        for(let worker of allCreepsInRoom) {

            console.log(worker, ":", Constants.StringifyObject(worker.memory));

            switch(worker.memory.role) {
                case Constants.Roles.BUILD:
                    roleBuilder.run(worker);
                    break;
                default:
                case Constants.Roles.GENERAL:
                    roleGeneral.run(worker);
                    break;
                case Constants.Roles.LOCAL_ENERGY_HARVEST:
                    roleLNHarvester.run(worker);
                    break;
                case Constants.Roles.UPGRADE:
                    roleUpgrader.run(worker);
                    break;
            }// ===== switch
        }// ===== for
        
    
    },// ==============================

};// ==============================