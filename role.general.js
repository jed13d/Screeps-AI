const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

/**
 * The General Role contains all states (except combat).
 * It cycles through them based on predetermined prioriy.
 */
module.exports = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
            
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
                        creep.memory.state = Constants.WorkerStates.UPGRADING;
                    }// =====
                    break;
            // ==============================
                    
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
                    creep.memory.state = Constants.WorkerStates.HARVESTING;
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
                        creep.memory.state = Constants.WorkerStates.BUILDING;
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
    },// ==============================

};// ==============================