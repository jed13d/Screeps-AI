const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

module.exports = {

    getMinTicksToLive(creep) {
        var partsWork = _.filter(creep.body, (bp) => bp.type == WORK).length;
        var harvestTikCost = creep.store.getCapacity(RESOURCE_ENERGY) / (partsWork * HARVEST_POWER);
        return (harvestTikCost + 50);
    },
    
    /** @param {Creep} creep **/
    run: function(creep) {
            // console.log(creep, ":", JSON.stringify(creep.body));
            // console.log(creep, ":", JSON.stringify(creep.memory));
            // console.log(creep, ":", creep.memory.state, "\n\t:", JSON.stringify(creep));

            // console.log(sources.length);

            switch(creep.memory.state) {
                    
            // ----- HARVESTING -------------
                case Constants.States.HARVESTING:
                    if(creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        var target = null;
                        var action;
                        if(creep.room.memory.jobTargets[Constants.RoomTargets.DROPPED_NRG].length > 0) {
                            target = creep.pos.findClosestByPath(creep.room.memory.jobTargets[Constants.RoomTargets.DROPPED_NRG]);
                            action = Constants.HarvesterActions.PICKUP;
                        } else if(creep.room.memory.jobTargets[Constants.RoomTargets.RUINS_WITH_NRG].length > 0) {
                            target = creep.pos.findClosestByRange(creep.room.memory.jobTargets[Constants.RoomTargets.RUINS_WITH_NRG]);
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
                                case Constants.HarvesterActions.PICKUP:
                                    actionResult = creep.pickup(target);
                                    break;
                                case Constants.HarvesterActions.WITHDRAW:
                                    actionResult = creep.withdraw(target, RESOURCE_ENERGY);
                                    break;
                            }// =====

                            switch(actionResult) {
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
                    } else {
                        creep.memory.state = Constants.States.SUPPLYING;
                    }// =====
                    break;
            // ==============================
                    
            // ----- IDLE -------------------
                default:
                case Constants.States.IDLE:
                    if(creep.ticksToLive < this.getMinTicksToLive(creep)) creep.suicide();
                    if(creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                        creep.memory.state = Constants.States.HARVESTING;
                    } else if(creep.room.memory.jobTargets[Constants.RoomTargets.STRUCTURES_TO_SUPPLY].length > 0) {
                        creep.memory.state = Constants.States.SUPPLYING;
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

            }// =====
    }// =====
};// ==============================