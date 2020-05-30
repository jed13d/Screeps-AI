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
                
            // ----- BUILDING ---------------
                case Constants.States.BUILDING:
                    /**
                     * If there are construction sites, build, otherwise, upgrade
                     */
                    var target = (creep.memory.targetId != null) ? Game.getObjectById(creep.memory.targetId) : creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                    if(creep.memory.targetId == null && target != null) creep.memory.targetId = target.id;

                    if(target != null) {
                        switch(creep.build(target)) {
                            default:
                            case OK:
                                if(creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                                    creep.memory.targetId = null;
                                    creep.memory.state = Constants.States.HARVESTING;
                                }// =====
                                break;
                            case ERR_INVALID_TARGET:
                                creep.memory.targetId = null;
                                break;
                            case ERR_NOT_IN_RANGE:
                                creep.moveTo(target);
                                break;
                            case ERR_NOT_ENOUGH_RESOURCES:
                                creep.memory.targetId = null;
                                creep.memory.state = Constants.States.HARVESTING;
                                break;
                            case ERR_NO_BODYPART:
                                creep.suicide();
                                break;
                        }// =====
                    } else {
                        creep.memory.targetId = null;
                        creep.memory.state = Constants.States.IDLE;
                    }// =====
            // ==============================
                    
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
                        creep.memory.state = Constants.States.BUILDING;
                    }// =====
                    break;
            // ==============================
                    
            // ----- IDLE -------------------
                default:
                case Constants.States.IDLE:
                    if(creep.store.getFreeCapacity() > 0) {
                        creep.memory.state = Constants.States.HARVESTING;
                    } else {
                        var target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
                        if(target != null) {
                            creep.memory.targetId = target.id;
                            creep.memory.state = Constants.States.BUILDING;
                        }// =====
                    }// =====
                    break;
            // ==============================

            }// =====
    }// =====
};// ==============================