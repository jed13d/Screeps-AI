const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

module.exports = {

    getMinTicksToLive(creep) {
        var partsWork = _.filter(creep.body, (bp) => bp.type == WORK).length;
        var harvestTikCost = creep.store.getCapacity(RESOURCE_ENERGY) / (partsWork * HARVEST_POWER);
        console.log("Suicide ticks: "+ (harvestTikCost + 50));
        return (harvestTikCost + 50);
    },
    
    /** @param {Creep} creep **/
    run: function(creep, sources, action) {
            // console.log(creep, ":", JSON.stringify(creep.body));
            // console.log(creep, ":", JSON.stringify(creep.memory));
            // console.log(creep, ":", creep.memory.state, "\n\t:", JSON.stringify(creep));

            switch(creep.memory.state) {
                    
            // ----- HARVESTING -------------
                case Constants.WorkerStates.HARVESTING:
                    if(creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        var target = creep.pos.findClosestByPath(sources);
                        var actionResult;

                        switch(action) {
                            default:
                            case Constants.HarvesterActions.HARVEST:
                                actionResult = creep.harvest(target);
                                break;
                            case Constants.HarvesterActions.PICKUP:
                                actionResult = creep.pickup(target);
                                break;
                            case Constants.HarvesterActions.WITHDRAW:
                                actionResult = creep.withdraw(target, RESOURCE_ENERGY);
                                break;
                        }
                        creep.memory.targetId = (target != null) ? target.id : null;

                        if(target != null) {
                            switch(actionResult) {
                                default:
                                case OK:
                                    break;
                                case ERR_NOT_IN_RANGE:
                                    creep.moveTo(target);
                                    break;
                                case ERR_TIRED:
                                case ERR_NOT_ENOUGH_RESOURCES:
                                    creep.memory.targetId = null;
                                    break;
                                case ERR_NO_BODYPART:
                                    creep.suicide();
                                    break;
                            }// =====
                        } else {
                            creep.memory.targetId = null;
                            creep.memory.state = Constants.WorkerStates.IDLE;
                        }// =====
                    } else {
                        creep.memory.targetId = null;
                        creep.memory.state = Constants.WorkerStates.SUPPLYING;
                    }// =====
                    break;
            // ==============================
                    
            // ----- IDLE -------------------
                default:
                case Constants.WorkerStates.IDLE:
                    if(creep.ticksToLive < this.getMinTicksToLive(creep)) creep.suicide();
                    if(creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        creep.memory.state = Constants.WorkerStates.HARVESTING;
                    } else {
                        var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return (structure.structureType == STRUCTURE_EXTENSION ||
                                            structure.structureType == STRUCTURE_SPAWN ||
                                            structure.structureType == STRUCTURE_TOWER ||
                                            structure.structureType == STRUCTURE_CONTAINER) && 
                                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                                }
                        });// =====
                        if(target != null) {
                            creep.memory.targetId = target.id;
                            creep.memory.state = Constants.WorkerStates.SUPPLYING;
                        }// =====
                    }// =====
                    break;
            // ==============================
                    
            // ----- SUPPLYING --------------
                case Constants.WorkerStates.SUPPLYING:
                    var targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_EXTENSION ||
                                        structure.structureType == STRUCTURE_SPAWN ||
                                        structure.structureType == STRUCTURE_TOWER ||
                                        structure.structureType == STRUCTURE_CONTAINER) && 
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                            }
                    });// =====
                    // === give priority to spawns and extensions;
                    if(targets != null) {
                        var target = creep.pos.findClosestByPath(_.filter(targets, (t) => t.structureType === STRUCTURE_SPAWN || t.structureType === STRUCTURE_EXTENSION));
                        if(target == null) {
                            target = creep.pos.findClosestByPath(targets);
                        }// =====
                    } else {
                        target == null;
                    }// =====
                    creep.memory.targetId = (target != null) ? target.id : null;
                    
                    if(target != null) {
                        switch(creep.transfer(target, RESOURCE_ENERGY)) {
                            default:
                            case OK:
                                if(creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                                    if(creep.ticksToLive < this.getMinTicksToLive(creep)) creep.suicide();
                                    creep.memory.targetId = null;
                                    creep.memory.state = Constants.WorkerStates.HARVESTING;
                                }// =====
                                break;
                            case ERR_NOT_IN_RANGE:
                                creep.moveTo(target);
                                break;
                            case ERR_FULL:
                                creep.memory.targetId = null;
                                break;
                        }// =====
                    } else {
                        creep.memory.targetId = null;
                        creep.memory.state = Constants.WorkerStates.IDLE;
                    }// =====
                    break;
            // ==============================

            }// =====
    }// =====
};// ==============================