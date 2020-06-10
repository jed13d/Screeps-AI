const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

/**
 * The General Role contains all states (except combat).
 * It cycles through them based on predetermined prioriy.
 */
module.exports = {

    getMinTicksToLive(creep) {
        var partsWork = _.filter(creep.body, (bp) => bp.type == WORK).length;
        var harvestTikCost = creep.store.getCapacity(RESOURCE_ENERGY) / (partsWork * HARVEST_POWER);
        return (harvestTikCost + 50);
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
            
            switch(creep.memory.state) {
                
            // ----- BUILDING ---------------
                case Constants.States.BUILDING:
                    if(creep.room.memory.jobTargets[Constants.RoomTargets.MY_CONSTRUCTION_SITES].length > 0) {
                        var target = creep.pos.findClosestByRange(creep.room.memory.jobTargets[Constants.RoomTargets.MY_CONSTRUCTION_SITES]);
                        switch(creep.build(target)) {
                            default:
                            case OK:
                                if(creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                                    if(creep.ticksToLive < 100) creep.suicide();
                                    creep.memory.state = Constants.States.HARVESTING;
                                }// =====
                                break;
                            case ERR_INVALID_TARGET:
                                break;
                            case ERR_NOT_IN_RANGE:
                                creep.moveTo(target);
                                break;
                            case ERR_NOT_ENOUGH_RESOURCES:
                                if(creep.ticksToLive < 100) creep.suicide();
                                creep.memory.state = Constants.States.HARVESTING;
                                break;
                            case ERR_NO_BODYPART:
                                creep.suicide();
                                break;
                        }// =====
                    } else {
                        creep.memory.state = Constants.States.IDLE;
                    }// =====
                    break;
            // ==============================
                    
            // ----- HARVESTING -------------
                case Constants.States.HARVESTING:
                    if(creep.store.getFreeCapacity() > 0 && creep.room.memory.jobTargets[Constants.RoomTargets.ACTIVE_NRG].length > 0) {
                        var target = creep.pos.findClosestByPath(creep.room.memory.jobTargets[Constants.RoomTargets.ACTIVE_NRG]);
                        switch(creep.harvest(target)) {
                            default:
                            case OK:
                                break;
                            case ERR_NOT_IN_RANGE:
                                creep.moveTo(target);
                                break;
                            case ERR_TIRED:
                            case ERR_NOT_ENOUGH_RESOURCES:
                                break;
                            case ERR_NO_BODYPART:
                                creep.suicide();
                                break;
                        }// =====
                    } else {
                        creep.memory.state = Constants.States.IDLE;
                    }// =====
                    break;
            // ==============================
                    
            // ----- IDLE -------------------
                default:
                case Constants.States.IDLE:
                    if(creep.ticksToLive < 100) creep.suicide();
                    if(creep.store.getFreeCapacity() > 0) {
                        creep.memory.state = Constants.States.HARVESTING;
                    } else if(creep.room.memory.jobTargets[Constants.RoomTargets.STRUCTURES_TO_SUPPLY].length > 0) {
                        creep.memory.state = Constants.States.SUPPLYING;
                    } else if(creep.room.memory.jobTargets[Constants.RoomTargets.STRUCTURES_NEED_REPAIRS].length > 0) {
                        creep.memory.state = Constants.States.REPAIRING;
                    } else if(creep.room.memory.jobTargets[Constants.RoomTargets.MY_CONSTRUCTION_SITES].length > 0) {
                        creep.memory.state = Constants.States.BUILDING;
                    } else {
                        creep.memory.state = Constants.States.UPGRADING;
                    }// =====
                    break;
            // ==============================
                
            // ----- REPAIRING ---------------
                case Constants.States.REPAIRING:
                    var target = null;
                    if(creep.room.memory.jobTargets[Constants.RoomTargets.STRUCTURES_NEED_REPAIRS].length > 0) {
                        var target = creep.pos.findClosestByRange(creep.room.memory.jobTargets[Constants.RoomTargets.STRUCTURES_NEED_REPAIRS]);
                    } else if(creep.room.memory.jobTargets[Constants.RoomTargets.WALLS_NEED_BULKING].length > 0) {
                        var target = creep.pos.findClosestByRange(creep.room.memory.jobTargets[Constants.RoomTargets.STRUCTURES_NEED_REPAIRS]);
                    }// =====

                    if(target != null) {
                        switch(creep.repair(target)) {
                            default:
                            case OK:
                                if(creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                                    if(creep.ticksToLive < 100) creep.suicide();
                                    creep.memory.state = Constants.States.HARVESTING;
                                }// =====
                                break;
                            case ERR_INVALID_TARGET:
                                break;
                            case ERR_NOT_IN_RANGE:
                                creep.moveTo(target);
                                break;
                            case ERR_NOT_ENOUGH_RESOURCES:
                                if(creep.ticksToLive < 100) creep.suicide();
                                creep.memory.state = Constants.States.HARVESTING;
                                break;
                            case ERR_NO_BODYPART:
                                creep.suicide();
                                break;
                        }// =====
                    } else {
                        creep.memory.state = Constants.States.IDLE;
                    }// =====
                    break;
            // ==============================
                    
            // ----- SUPPLYING --------------
                case Constants.States.SUPPLYING:
                    var target = null;
                    var targets = creep.room.memory.jobTargets[Constants.RoomTargets.STRUCTURES_TO_SUPPLY];
                    if(targets.length > 0) {
                        target = creep.pos.findClosestByRange(_.filter(targets, (t) => t.structureType === STRUCTURE_SPAWN || t.structureType === STRUCTURE_EXTENSION));
                        if(target == null) {
                            target = creep.pos.findClosestByRange(targets);
                        }// =====
                    } else {
                        target == null;
                    }// =====
                    
                    if(target != null) {
                        switch(creep.transfer(target, RESOURCE_ENERGY)) {
                            default:
                            case OK:
                            case ERR_FULL:
                                if(creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                                    if(creep.ticksToLive < this.getMinTicksToLive(creep)) creep.suicide();
                                    creep.memory.state = Constants.States.HARVESTING;
                                }// =====
                                break;
                            case ERR_NOT_IN_RANGE:
                                creep.moveTo(target);
                                break;
                        }// =====
                    } else {
                        creep.memory.state = Constants.States.IDLE;
                    }// =====
                    break;
            // ==============================
                    
            // ----- UPGRADING --------------
                case Constants.States.UPGRADING:
                    switch(creep.upgradeController(creep.room.controller)) {
                        default:
                        case OK:
                            break;
                        case ERR_NOT_IN_RANGE:
                            creep.moveTo(creep.room.controller);
                            break;
                        case ERR_NOT_ENOUGH_RESOURCES:
                            if(creep.ticksToLive < 100) creep.suicide();
                            creep.memory.state = Constants.States.HARVESTING;
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