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
                    } else if(creep.room.memory.jobTargets[Constants.RoomTargets.STRUCTURES_NEED_REPAIRS].length > 0) {
                        creep.memory.state = Constants.States.REPAIRING;
                    } else if(creep.room.memory.jobTargets[Constants.RoomTargets.MY_CONSTRUCTION_SITES].length > 0) {
                        creep.memory.state = Constants.States.BUILDING;
                    } else if(creep.room.memory.jobTargets[Constants.RoomTargets.WALLS_NEED_BULKING].length > 0) {
                        creep.memory.state = Constants.States.REPAIRING;
                    }// =====
                    break;
            // ==============================
                
            // ----- REPAIRING ---------------
                case Constants.States.REPAIRING:
                    var target = null;
                    if(creep.room.memory.jobTargets[Constants.RoomTargets.STRUCTURES_NEED_REPAIRS].length > 0) {
                        var target = creep.pos.findClosestByRange(creep.room.memory.jobTargets[Constants.RoomTargets.STRUCTURES_NEED_REPAIRS]);
                    } else if(creep.room.memory.jobTargets[Constants.RoomTargets.WALLS_NEED_BULKING].length > 0) {
                        var target = creep.pos.findClosestByRange(creep.room.memory.jobTargets[Constants.RoomTargets.WALLS_NEED_BULKING]);
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

            }// =====
    },// =====
};// ==============================