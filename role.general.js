const Constants = require('constants');

var devMessage = "Developer Test Message";
// console.log(devMessage);
// Constants.OutputObject();
// Constants.StringifyObject();

module.exports = {
    
    /** @param {Creep} creep **/
    run: function(creep) {
            console.log(creep, ":", Constants.StringifyObject(creep.body));
            // console.log(creep, ":", Constants.StringifyObject(creep.memory));
            // console.log(creep, ":", creep.memory.state, "\n\t:", Constants.StringifyObject(creep));
            
            
            switch(creep.memory.state) {
                
            // ----- BUILDING ---------------
                case Constants.States.BUILDING:
                    /**
                     * If there are construction sites, build, otherwise, upgrade
                     */
                    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if(targets.length) {
                        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {reusePath: 15, visualizePathStyle: {stroke: '#ffffff'}});
                        }// =====
                    } else {
                        creep.memory.state = Constants.States.UPGRADING;
                        creep.say('⚡ upgrade');
                    }// =====
                    
                    /**
                     * If not carrying resources, harvest.
                     */
                    if(creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                        creep.memory.state = Constants.States.HARVESTING;
                        creep.say('🔄 harvest');
                    }// =====
                    break;
            // ==============================
                    
            // ----- HARVESTING -------------
                case Constants.States.HARVESTING:
                    if(creep.store.getFreeCapacity() > 0) {
                        var source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
                        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(source, {reusePath: 15, visualizePathStyle: {stroke: '#ffaa00'}});
                        }// =====
                    } else {
                        creep.memory.state = Constants.States.SUPPLYING;
                        creep.say('⚡ supply');
                    }// =====
                    break;
            // ==============================
                    
            // ----- IDLE -------------------
                default:
                case Constants.States.IDLE:
                    creep.memory.state = Constants.States.HARVESTING;
                    creep.say('🔄 harvest');
                    break;
            // ==============================
                    
            // ----- SUPPLYING --------------
                case Constants.States.SUPPLYING:
                    var targets = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_EXTENSION ||
                                        structure.structureType == STRUCTURE_SPAWN ||
                                        structure.structureType == STRUCTURE_TOWER ||
                                        structure.structureType == STRUCTURE_CONTAINER) && 
                                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                            }
                    });// =====
                    if(targets.length > 0) {
                        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {reusePath: 15, visualizePathStyle: {stroke: '#ffffff'}});
                        }// =====
                    } else {
                        creep.memory.state = Constants.States.BUILDING;
                        creep.say('🚧 build');
                    }// =====
                    
                    /**
                     * If not carrying resources, harvest.
                     */
                    if(creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                        creep.memory.state = Constants.States.HARVESTING;
                        creep.say('🔄 harvest');
                    }// =====
                    break;
            // ==============================
                    
            // ----- UPGRADING --------------
                case Constants.States.UPGRADING:
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {reusePath: 15, visualizePathStyle: {stroke: '#ffffff'}});
                    }// =====
                    
                    /**
                     * If not carrying resources, harvest.
                     */
                    if(creep.store.getFreeCapacity() == creep.store.getCapacity()) {
                        creep.memory.state = Constants.States.HARVESTING;
                        creep.say('🔄 harvest');
                    }// =====
                    break;
            // ==============================
            
            }// =====
    },// ==============================

};// ==============================