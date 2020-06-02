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
                        var target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                        creep.memory.targetId = (target != null) ? target.id : null;

                        if(target != null) {
                            switch(creep.harvest(target)) {
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
                    if(creep.ticksToLive < 100) creep.suicide();
                    if(creep.store.getFreeCapacity() > 0) {
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
                    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_EXTENSION ||
                                        structure.structureType == STRUCTURE_SPAWN ||
                                        structure.structureType == STRUCTURE_TOWER ||
                                        structure.structureType == STRUCTURE_CONTAINER) && 
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                            }
                    });// =====
                    creep.memory.targetId = (target != null) ? target.id : null;
                    
                    if(target != null) {
                        switch(creep.transfer(target, RESOURCE_ENERGY)) {
                            default:
                            case OK:
                                if(creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                                    if(creep.ticksToLive < 100) creep.suicide();
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