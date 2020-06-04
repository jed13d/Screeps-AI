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
                
            // ----- BUILDING ---------------
                case Constants.WorkerStates.BUILDING:
                    /**
                     * If there are construction sites, build, otherwise, upgrade
                     */
                    var target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                    creep.memory.targetId = (target != null) ? target.id : null;

                    if(target != null) {
                        switch(creep.build(target)) {
                            default:
                            case OK:
                                if(creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                                    if(creep.ticksToLive < 100) creep.suicide();
                                    creep.memory.targetId = null;
                                    creep.memory.state = Constants.WorkerStates.HARVESTING;
                                }// =====
                                break;
                            case ERR_INVALID_TARGET:
                                creep.memory.targetId = null;
                                break;
                            case ERR_NOT_IN_RANGE:
                                creep.moveTo(target);
                                break;
                            case ERR_NOT_ENOUGH_RESOURCES:
                                if(creep.ticksToLive < 100) creep.suicide();
                                creep.memory.targetId = null;
                                creep.memory.state = Constants.WorkerStates.HARVESTING;
                                break;
                            case ERR_NO_BODYPART:
                                creep.suicide();
                                break;
                        }// =====
                    } else {
                        creep.memory.targetId = null;
                        creep.memory.state = Constants.WorkerStates.REPAIRING;
                    }// =====
            // ==============================
                    
            // ----- HARVESTING -------------
                case Constants.WorkerStates.HARVESTING:
                    if(creep.store.getFreeCapacity() > 0) {
                        // find the container
                        var tgtIsCntr = true;
                        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_CONTAINER &&
                                !structure.pos.inRangeTo(creep.room.controller, 5) &&
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity();
                            }
                        });// =====
                        // fallback to source
                        if(target == null) {
                            target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                            tgtIsCntr = false;
                        }
                        creep.memory.targetId = (target != null) ? target.id : null;

                        if(target != null) {
                            switch((tgtIsCntr) ? creep.withdraw(target, RESOURCE_ENERGY) : creep.harvest(target)) {
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
                        creep.memory.state = Constants.WorkerStates.BUILDING;
                    }// =====
                    break;
            // ==============================
                    
            // ----- IDLE -------------------
                default:
                case Constants.WorkerStates.IDLE:
                    if(creep.ticksToLive < 100) creep.suicide();
                    if(creep.store.getFreeCapacity() > 0) {
                        // find the container
                        var tgtIsCntr = true;
                        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_CONTAINER &&
                                !structure.pos.inRangeTo(creep.room.controller, 5) &&
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity();
                            }
                        });// =====
                        // fallback to source
                        if(target == null) {
                            target = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                            tgtIsCntr = false;
                        }// =====

                        if(target != null) {
                            creep.memory.targetId = target.id;
                            creep.memory.state = Constants.WorkerStates.HARVESTING;
                        }// =====
                    } else {
                        var target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                        if(target != null) {
                            creep.memory.targetId = target.id;
                            creep.memory.state = Constants.WorkerStates.BUILDING;
                        }// =====
                    }// =====
                    break;
            // ==============================
                
            // ----- REPAIRING ---------------
                case Constants.WorkerStates.REPAIRING:
                    /**
                     * If there are construction sites, build, otherwise, upgrade
                     */
                    var target = creep.pos.findClosestByRange(creep.room.find(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return structure.structureType == STRUCTURE_CONTAINER && 
                            structure.hits < structure.hitsMax;
                        }}));// =====
                    creep.memory.targetId = (target != null) ? target.id : null;

                    if(target != null && creep.memory.targetId != null) {
                        switch(creep.repair(target)) {
                            default:
                            case OK:
                                if(creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                                    if(creep.ticksToLive < 100) creep.suicide();
                                    creep.memory.targetId = null;
                                    creep.memory.state = Constants.WorkerStates.HARVESTING;
                                }// =====
                                break;
                            case ERR_INVALID_TARGET:
                                creep.memory.targetId = null;
                                break;
                            case ERR_NOT_IN_RANGE:
                                creep.moveTo(target);
                                break;
                            case ERR_NOT_ENOUGH_RESOURCES:
                                if(creep.ticksToLive < 100) creep.suicide();
                                creep.memory.targetId = null;
                                creep.memory.state = Constants.WorkerStates.HARVESTING;
                                break;
                            case ERR_NO_BODYPART:
                                creep.suicide();
                                break;
                        }// =====
                    } else {
                        creep.memory.targetId = null;
                        creep.memory.state = Constants.WorkerStates.IDLE;
                    }// =====
            // ==============================

            }// =====
    },// =====
};// ==============================