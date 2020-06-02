const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

module.exports = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
            // console.log(creep, ":", JSON.stringify(creep.body));
            // console.log(creep, ":", JSON.stringify(creep.memory));
            // console.log(creep, ":", creep.memory.state, "\n\t:", JSON.stringify(creep));
            
            
            switch(creep.memory.state) {
                    
            // ----- HARVESTING -------------
                case Constants.WorkerStates.HARVESTING:
                    if(creep.store.getFreeCapacity() > 0) {
                        // find the container
                        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_CONTAINER && 
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity();
                            }
                        });// =====
                        if(target == null) target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                        creep.memory.targetId = (target != null) ? target.id : null;

                        if(target != null) {
                            switch(creep.withdraw(target, RESOURCE_ENERGY)) {
                                default:
                                case ERR_FULL:
                                case OK:
                                    creep.memory.state = Constants.WorkerStates.UPGRADING;
                                    break;
                                case ERR_NOT_IN_RANGE:
                                    creep.moveTo(target);
                                    break;
                            }// =====
                        } else {
                            creep.memory.state = Constants.WorkerStates.IDLE;
                        }// =====
                    } else {
                        creep.memory.state = Constants.WorkerStates.UPGRADING;
                    }// =====
                    break;
            // ==============================
                    
            // ----- IDLE -------------------
                default:
                case Constants.WorkerStates.IDLE:
                    if(creep.ticksToLive < 100) creep.suicide();
                    if(creep.store.getFreeCapacity() > 0) {
                        // find the container
                        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_CONTAINER && 
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity();
                            }
                        });// =====

                        if(target != null) {
                            creep.memory.targetId = target.id;
                            creep.memory.state = Constants.WorkerStates.HARVESTING;
                        }// =====
                    }// =====
                    break;
            // ==============================
                    
            // ----- UPGRADING --------------
                case Constants.WorkerStates.UPGRADING:
                    switch(creep.upgradeController(creep.room.controller)) {
                        default:
                        case OK:
                            break;
                        case ERR_NOT_IN_RANGE:
                            creep.moveTo(creep.room.controller);
                            break;
                        case ERR_NOT_ENOUGH_RESOURCES:
                            if(creep.ticksToLive < 100) creep.suicide();
                            creep.memory.state = Constants.WorkerStates.HARVESTING;
                            break;
                        case ERR_NO_BODYPART:
                            creep.suicide();
                            break;
                    }// =====
                    break;
            // ==============================

            }// =====
    }// =====
};// ==============================