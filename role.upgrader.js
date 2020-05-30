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
                        // find the container
                        var target = (creep.memory.targetId != null) ? Game.getObjectById(creep.memory.targetId) : creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_CONTAINER && 
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity();
                            }
                        });// =====
                        if(creep.memory.targetId == null && target != null) creep.memory.targetId = target.id;

                        if(target != null) {
                            switch(creep.withdraw(target, RESOURCE_ENERGY)) {
                                default:
                                case ERR_FULL:
                                case OK:
                                    creep.memory.state = Constants.States.UPGRADING;
                                    break;
                            }// =====
                        } else {
                            creep.memory.state = Constants.States.IDLE;
                        }// =====
                    } else {
                        creep.memory.state = Constants.States.UPGRADING;
                    }// =====
                    break;
            // ==============================
                    
            // ----- IDLE -------------------
                default:
                case Constants.States.IDLE:
                    if(creep.store.getFreeCapacity() > 0) {
                        // find the container
                        var target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_CONTAINER && 
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity();
                            }
                        });// =====

                        if(target != null) {
                            creep.memory.targetId = target.id;
                            creep.memory.state = Constants.States.HARVESTING;
                        }// =====
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
                            creep.memory.state = Constants.States.HARVESTING;
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