const roleBuilder = require('role.builder');
const roleGeneral = require('role.general');
const roleLNHarvester = require('role.local.energy.harvester');
const roleUpgrader = require('role.upgrader');
const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

module.exports = {
    
    /** @param (roomObj) room object **/
    run: function(roomObj) {
        
        let allCreepsInRoom = roomObj.find(FIND_MY_CREEPS);
        // console.log("Number of workers:", allCreepsInRoom.length);

        // Manual Override
        // ------------------------------
        // roomObj.memory[LOOK_CREEPS][Constants.Roles.BUILD]                  = {max: 2};
        // roomObj.memory[LOOK_CREEPS][Constants.Roles.GENERAL]                = {max: 0};
        // roomObj.memory[LOOK_CREEPS][Constants.Roles.LOCAL_ENERGY_HARVEST]   = {max: 6};
        // roomObj.memory[LOOK_CREEPS][Constants.Roles.MELEE]                  = {max: 0};
        // roomObj.memory[LOOK_CREEPS][Constants.Roles.RANGE]                  = {max: 0};
        // roomObj.memory[LOOK_CREEPS][Constants.Roles.UPGRADE]                = {max: 2};
        
        /**
         * Spawn workers, only if energy is at max capacity
         * Hopefully, by order of appearance in Constants.Workers{}
         */
        if(roomObj.energyAvailable === roomObj.energyCapacityAvailable) {
            for(let workerRole in Constants.Roles) {
                let roleTitle = Constants.Roles[workerRole];
                
                    /*BODYPART_COST: {
                        TOUGH:          10,
                        CARRY:          50,
                        MOVE:           50,
                        ATTACK:         80,
                        WORK:           100,
                        RANGED_ATTACK:  150,
                        HEAL:           250,
                        CLAIM:          600
                    },*/

                /**
                 * Build first needed worker found. Then, report the spawning.
                 */ 
                if(_.filter(allCreepsInRoom, (creep) => creep.memory.role === roleTitle).length < roomObj.memory[LOOK_CREEPS][roleTitle].max) {
                    let workerName = roleTitle +'_'+ Game.time;
                    let spawn = roomObj.find(FIND_MY_SPAWNS)[0];
                    
                    // build algorithms based on role     MAX_CREEP_SIZE
                    var parts = [];
                    var nrgAvail = roomObj.energyCapacityAvailable;
                    var options = {memory: {role: roleTitle, state: Constants.WorkerStates.IDLE, targetId: null}}
                    switch(roleTitle) {
                        case Constants.Roles.BUILD:
                        default:
                        case Constants.Roles.GENERAL:
                            var numWork = Math.floor((nrgAvail - (BODYPART_COST[CARRY] + BODYPART_COST[MOVE])) / (BODYPART_COST[WORK] + BODYPART_COST[MOVE]));
                            var numMoves = 1;
                            for(var n = 0; n < numWork && ((parts.length + numMoves + 1) < (MAX_CREEP_SIZE - 1)); n++) {
                                parts.push(WORK);
                                numMoves++;
                            }// =====
                            parts.push(CARRY);
                            for(numMoves; numMoves > 0; numMoves--) {
                                parts.push(MOVE);
                            }// =====
                            // Constants.OutputObject(parts);
                            break;
                        case Constants.Roles.LOCAL_ENERGY_HARVEST:
                            var numCarry = Math.floor((nrgAvail - (BODYPART_COST[WORK] + BODYPART_COST[MOVE])) / (BODYPART_COST[CARRY] + BODYPART_COST[MOVE]));
                            var numMoves = 1;
                            parts.push(WORK);
                            for(var n = 0; n < numCarry && ((parts.length + numMoves + 1) < (MAX_CREEP_SIZE - 1)); n++) {
                                parts.push(CARRY);
                                numMoves++;
                            }// =====
                            for(var n = 0; n < numMoves; n++) {
                                parts.push(MOVE);
                            }// =====
                            // Constants.OutputObject(parts);
                            break;
                        case Constants.Roles.MELEE:
                            break;
                        case Constants.Roles.RANGE:
                            break;
                        case Constants.Roles.UPGRADE:
                            var numWork = Math.floor((nrgAvail - (BODYPART_COST[CARRY] + BODYPART_COST[MOVE])) / (BODYPART_COST[WORK]));
                            for(var n = 0; n < numWork && ((parts.length + 2) < (MAX_CREEP_SIZE - 1)); n++) {
                                parts.push(WORK);
                            }// =====
                            parts.push(CARRY);
                            parts.push(MOVE);
                            // Constants.OutputObject(parts);
                            break;
                    }// =====
                    
                    // attempt to spawn
                    if(spawn.spawnCreep(parts, workerName, options) == OK) break;

                }// ===== if
                
            }// ===== for
        }// ===== if

        /**
         * Find sources for harvester (done once here so each harvester doesn't do this)
         */
        var harvestingSources;
        var harvesterAction = null;
        // look for dropped resources
        harvestingSources = roomObj.find(FIND_DROPPED_RESOURCES);
        harvesterAction = (harvestingSources.length > 0) ? Constants.HarvesterActions.PICKUP : null;
        // look for ruins with resources
        if(harvesterAction == null) {
            harvestingSources = roomObj.find(FIND_RUINS, {filter: (ruin) => {return ruin.store.getUsedCapacity(RESOURCE_ENERGY) > 0;}});
            harvesterAction = (harvestingSources.length > 0) ? Constants.HarvesterActions.WITHDRAW : null;
        }// =====
        // look for active sources
        if(harvesterAction == null) {
            harvestingSources = roomObj.find(FIND_SOURCES_ACTIVE);
            harvesterAction = (harvestingSources.length > 0) ? Constants.HarvesterActions.HARVEST : null;
        }// =====
        console.log(harvesterAction);

        /**
         * Orders for creeps based on role.
         * - roleBuilder
         * - roleGeneral
         * - roleLNHarvester
         * - roleUpgrader
         */
        for(let worker of allCreepsInRoom) {

            console.log(worker, ":", worker.ticksToLive, ":", JSON.stringify(worker.memory));

            switch(worker.memory.role) {
                case Constants.Roles.BUILD:
                    roleBuilder.run(worker);
                    break;
                default:
                case Constants.Roles.GENERAL:
                    roleGeneral.run(worker);
                    break;
                case Constants.Roles.LOCAL_ENERGY_HARVEST:
                    roleLNHarvester.run(worker, harvestingSources, harvesterAction);
                    break;
                case Constants.Roles.UPGRADE:
                    roleUpgrader.run(worker);
                    break;
            }// ===== switch
        }// ===== for

    },// ==============================

};// ==============================