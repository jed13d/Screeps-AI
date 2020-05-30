const Constants = require('constants');

var devMessage = "Developer Test Message";
// console.log(devMessage);
// Constants.OutputObject();
// Constants.StringifyObject();

module.exports = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
            // console.log(creep, ":", Constants.StringifyObject(creep.body));
            // console.log(creep, ":", Constants.StringifyObject(creep.memory));
            // console.log(creep, ":", creep.memory.state, "\n\t:", Constants.StringifyObject(creep));
            
            
            switch(creep.memory.state) {
                    
            // ----- HARVESTING -------------
                case Constants.States.HARVESTING:
                    if(creep.store.getFreeCapacity() > 0) {
                        var target = (creep.memory.targetId != null) ? Game.getObjectById(creep.memory.targetId) : creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                        if(creep.memory.targetId == null && target != null) creep.memory.targetId = target.id;

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
                            creep.memory.state = Constants.States.IDLE;
                        }// =====
                    } else {
                        creep.memory.targetId = null;
                        creep.memory.state = Constants.States.SUPPLYING;
                    }// =====
                    break;
            // ==============================
                    
            // ----- IDLE -------------------
                default:
                case Constants.States.IDLE:
                    if(creep.store.getFreeCapacity() > 0) {
                        creep.memory.state = Constants.States.HARVESTING;
                    } else {
                        var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
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
                            creep.memory.state = Constants.States.SUPPLYING;
                        }// =====
                    }// =====
                    break;
            // ==============================
                    
            // ----- SUPPLYING --------------
                case Constants.States.SUPPLYING:
                    var target = (creep.memory.targetId != null) ? Game.getObjectById(creep.memory.targetId) : creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_EXTENSION ||
                                        structure.structureType == STRUCTURE_SPAWN ||
                                        structure.structureType == STRUCTURE_TOWER ||
                                        structure.structureType == STRUCTURE_CONTAINER) && 
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                            }
                    });// =====
                    if(creep.memory.targetId == null && target != null) creep.memory.targetId = target.id;
                    
                    if(target != null) {
                        switch(creep.transfer(target, RESOURCE_ENERGY)) {
                            default:
                            case OK:
                                if(creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                                    creep.memory.targetId = null;
                                    creep.memory.state = Constants.States.HARVESTING;
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
                        creep.memory.state = Constants.States.IDLE;
                    }// =====
                    break;
            // ==============================

            }// =====
    }// =====
};// ==============================