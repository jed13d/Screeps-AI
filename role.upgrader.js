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
                        // find the containers
                        var container = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_CONTAINER && 
                                structure.store.getUsedCapacity(RESOURCE_ENERGY) > creep.store.getFreeCapacity();
                            }
                        });

                        var wResult = creep.withdraw(source, RESOURCE_ENERGY);
                        if(wResult == OK || wResult == ERR_FULL) {
                            creep.memory.state = Constants.States.UPGRADING;
                        }// =====
                        
                    } else {
                        creep.memory.state = Constants.States.UPGRADING;
                    }// =====
                    break;
            // ==============================
                    
            // ----- IDLE -------------------
                default:
                case Constants.States.IDLE:
                    creep.memory.state = Constants.States.HARVESTING;
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