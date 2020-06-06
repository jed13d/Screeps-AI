const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

module.exports = {

    loadRoomActiveEnergy(roomObj) {
        roomObj.memory.jobTargets[Constants.RoomTargets.ACTIVE_NRG] = roomObj.find(FIND_SOURCES_ACTIVE);
    },// ==============================

    loadRoomContainersNearControllerWithEnergy(roomObj) {
        roomObj.memory.jobTargets[Constants.RoomTargets.CONTAINERS_NEAR_CTLR] = roomObj.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER && 
                structure.pos.inRangeTo(roomObj.controller, 3) &&
                structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        });// =====
    },// ==============================

    loadRoomDroppedEnergy(roomObj) {
        roomObj.memory.jobTargets[Constants.RoomTargets.DROPPED_NRG] = roomObj.find(FIND_DROPPED_RESOURCES);
    },// ==============================

    loadRoomHostileCreeps(roomObj) {
        roomObj.memory.jobTargets[Constants.RoomTargets.HOSTILES] = roomObj.find(FIND_HOSTILE_CREEPS);
    },// ==============================

    loadRoomMyConstructionSites(roomObj) {
        roomObj.memory.jobTargets[Constants.RoomTargets.MY_CONSTRUCTION_SITES] = roomObj.find(FIND_MY_CONSTRUCTION_SITES);
    },// ==============================

    loadRoomRuinsWithEnergy(roomObj) {
        roomObj.memory.jobTargets[Constants.RoomTargets.RUINS_WITH_NRG] = roomObj.find(FIND_RUINS, {filter: (ruin) => {return ruin.store.getUsedCapacity(RESOURCE_ENERGY) > 0;}});
    },// ==============================

    loadRoomStructuresNeedingRepair(roomObj) {
        roomObj.memory.jobTargets[Constants.RoomTargets.STRUCTURES_NEED_REPAIRS] = roomObj.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType != STRUCTURE_WALL && 
                structure.hits < structure.hitsMax;
            }});// =====
    },// ==============================

    loadRoomStructuresToSupply(roomObj) {
        roomObj.memory.jobTargets[Constants.RoomTargets.STRUCTURES_TO_SUPPLY] = roomObj.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_CONTAINER) && 
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
    });// =====
    },// ==============================

    loadRoomWallsToBulk(roomObj) {
        var hitsFalsePlateau = 10000;
        roomObj.memory.jobTargets[Constants.RoomTargets.WALLS_NEED_BULKING] = roomObj.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_WALL &&
                structure.hits < hitsFalsePlateau;  // structure.hitsMax (300 mil)
            }// =====
        });// =====
    },// ==============================

    loadRoomTargets: function(roomObj) {
        this.loadRoomActiveEnergy(roomObj);
        this.loadRoomContainersNearControllerWithEnergy(roomObj);
        this.loadRoomDroppedEnergy(roomObj);
        this.loadRoomHostileCreeps(roomObj);
        this.loadRoomMyConstructionSites(roomObj);
        this.loadRoomRuinsWithEnergy(roomObj);
        this.loadRoomStructuresNeedingRepair(roomObj);
        this.loadRoomStructuresToSupply(roomObj);
        this.loadRoomWallsToBulk(roomObj);
    },// ==============================

};// ==============================