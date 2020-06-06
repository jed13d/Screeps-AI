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
                case Constants.States.HARVESTING:
                    if(creep.store.getFreeCapacity() > 0) {
                        var target = null;
                        var action;
                        if(creep.room.memory.jobTargets[Constants.RoomTargets.CONTAINERS_NEAR_CTLR].length > 0) {
                            target = creep.pos.findClosestByRange(creep.room.memory.jobTargets[Constants.RoomTargets.CONTAINERS_NEAR_CTLR]);
                            action = Constants.HarvesterActions.WITHDRAW;
                        } else if(creep.room.memory.jobTargets[Constants.RoomTargets.ACTIVE_NRG].length > 0) {
                            target = creep.pos.findClosestByPath(creep.room.memory.jobTargets[Constants.RoomTargets.ACTIVE_NRG]);
                            action = Constants.HarvesterActions.HARVEST;
                        }// =====

                        if(target != null) {
                            var actionResult;
                            switch(action) {
                                default:
                                case Constants.HarvesterActions.HARVEST:
                                    actionResult = creep.harvest(target);
                                    break;
                                case Constants.HarvesterActions.WITHDRAW:
                                    actionResult = creep.withdraw(target, RESOURCE_ENERGY);
                                    break;
                            }// =====

                            switch(actionResult) {
                                default:
                                case ERR_FULL:
                                case OK:
                                    creep.memory.state = Constants.States.UPGRADING;
                                    break;
                                case ERR_NOT_IN_RANGE:
                                    creep.moveTo(target);
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
                    if(creep.ticksToLive < 100) creep.suicide();
                    if(creep.store.getFreeCapacity() > 0) {
                        creep.memory.state = Constants.States.HARVESTING;
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
    }// =====
};// ==============================