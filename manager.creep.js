const roleBuilder = require('role.builder');
const roleGeneral = require('role.general');
const roleLNHarvester = require('role.local.energy.harvester');
const roleUpgrader = require('role.upgrader');
const Constants = require('constants');
const jobUtils = require('job.utils');

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
        // roomObj.memory[LOOK_CREEPS][Constants.Roles.BUILD]                  = {max: 3};
        // roomObj.memory[LOOK_CREEPS][Constants.Roles.GENERAL]                = {max: 0};
        // roomObj.memory[LOOK_CREEPS][Constants.Roles.LOCAL_ENERGY_HARVEST]   = {max: 6};
        // roomObj.memory[LOOK_CREEPS][Constants.Roles.MELEE]                  = {max: 0};
        // roomObj.memory[LOOK_CREEPS][Constants.Roles.RANGE]                  = {max: 0};
        // roomObj.memory[LOOK_CREEPS][Constants.Roles.UPGRADE]                = {max: 2};
        
        /**
         * Spawn workers, only if energy is at max capacity
         * Hopefully, by order of appearance in Constants.Workers{}
         */
        if(roomObj.energyAvailable === roomObj.energyCapacityAvailable || (_.filter(allCreepsInRoom, (creep) => creep.memory.role === Constants.Roles.LOCAL_ENERGY_HARVEST).length <= Constants.HARDSHIP_HARVESTERS_MIN)) {
            for(let workerRole in Constants.Roles) {
                let roleTitle = Constants.Roles[workerRole];
                
                    /*BODYPART_COST: {
                        TOUGH:          10,     60,
                        CARRY:          50,     100,
                        MOVE:           50,
                        ATTACK:         80,     130,
                        WORK:           100,    150,
                        RANGED_ATTACK:  150,    200,
                        HEAL:           250,    300,
                        CLAIM:          600,    650,
                    },*/

                /**
                 * Build first needed worker found. Then, report the spawning.
                 */ 
                if(_.filter(allCreepsInRoom, (creep) => creep.memory.role === roleTitle).length < roomObj.memory[LOOK_CREEPS][roleTitle].max) {
                    let workerName = roleTitle +'_'+ Game.time;
                    let spawn = roomObj.find(FIND_MY_SPAWNS)[0];
                    
                    // build algorithms based on role     MAX_CREEP_SIZE
                    var parts = [];
                    var partsCtr = 0;
                    var numWork = 0
                    var numCarry = 0;
                    var numMoves = 0;
                    var nrgAvail = roomObj.energyCapacityAvailable;
                    var options = {memory: {role: roleTitle, state: Constants.States.IDLE}}
                    switch(roleTitle) {
                        case Constants.Roles.BUILD:
                        default:
                        case Constants.Roles.GENERAL:
                            var workCarryRatio = 2;
                            while(partsCtr < MAX_CREEP_SIZE && nrgAvail > ((BODYPART_COST[WORK] + BODYPART_COST[MOVE]) + (BODYPART_COST[CARRY] + BODYPART_COST[MOVE]))) {
                                if(nrgAvail > (BODYPART_COST[CARRY] + BODYPART_COST[MOVE])) {
                                    numCarry++;
                                    numMoves++;
                                    nrgAvail -= (BODYPART_COST[CARRY] + BODYPART_COST[MOVE]);
                                }// =====
                                for(var n = 0; n < workCarryRatio && nrgAvail > (BODYPART_COST[WORK] + BODYPART_COST[MOVE]); n++) {
                                    numWork++;
                                    numMoves++;
                                    nrgAvail -= (BODYPART_COST[WORK] + BODYPART_COST[MOVE]);
                                }// =====
                            }// =====
                            // Constants.OutputObject(parts);
                            break;
                        case Constants.Roles.LOCAL_ENERGY_HARVEST:
                            var carryWorkRatio = 3;
                            nrgAvail = (_.filter(allCreepsInRoom, (creep) => creep.memory.role === roleTitle).length > Constants.HARDSHIP_HARVESTERS_MIN) ? roomObj.energyCapacityAvailable : roomObj.energyAvailable;
                            while(partsCtr < MAX_CREEP_SIZE && nrgAvail > ((BODYPART_COST[WORK] + BODYPART_COST[MOVE]) + (BODYPART_COST[CARRY] + BODYPART_COST[MOVE]))) {
                                if(nrgAvail > (BODYPART_COST[WORK] + BODYPART_COST[MOVE])) {
                                    numWork++;
                                    numMoves++;
                                    nrgAvail -= (BODYPART_COST[WORK] + BODYPART_COST[MOVE]);
                                }// =====
                                for(var n = 0; n < carryWorkRatio && nrgAvail > (BODYPART_COST[CARRY] + BODYPART_COST[MOVE]); n++) {
                                    numCarry++;
                                    numMoves++;
                                    nrgAvail -= (BODYPART_COST[CARRY] + BODYPART_COST[MOVE]);
                                }// =====
                            }// =====
                            // Constants.OutputObject(parts);
                            break;
                        case Constants.Roles.MELEE:
                            break;
                        case Constants.Roles.RANGE:
                            break;
                        case Constants.Roles.UPGRADE:
                            numWork = Math.floor((nrgAvail - (BODYPART_COST[CARRY] + BODYPART_COST[MOVE])) / (BODYPART_COST[WORK]));
                            numCarry = 1;
                            numMoves = 1;
                            // Constants.OutputObject(parts);
                            break;
                    }// =====
                    
                    for(var n = 0; n < numWork; n++) {
                        parts.push(WORK);
                    }// =====
                    for(var n = 0; n < numCarry; n++) {
                        parts.push(CARRY);
                    }// =====
                    for(var n = 0; n < numMoves; n++) {
                        parts.push(MOVE);
                    }// =====

                    // attempt to spawn
                    if(spawn.spawnCreep(parts, workerName, options) == OK) break;

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
                    roleLNHarvester.run(worker);
                    break;
                case Constants.Roles.UPGRADE:
                    roleUpgrader.run(worker);
                    break;
            }// ===== switch
        }// ===== for

    },// ==============================

};// ==============================