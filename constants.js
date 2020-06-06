
module.exports = {

    HarvesterActions: {
        HARVEST: 'harvest',
        PICKUP: 'pickup',
        WITHDRAW: 'withdraw',
    },
    
    Roles: {
        BUILD: 'build',
        GENERAL: 'general',
        LOCAL_ENERGY_HARVEST: 'harvest-local-energy',
        MELEE: 'melee',
        RANGE: 'range',
        UPGRADE: 'upgrade',
    },// ==============================

    RoomTargets: {
        ACTIVE_NRG: 'activeSources',
        DROPPED_NRG: 'droppedNrg',
        CONTAINERS_NEAR_CTLR: 'containersNearController',
        HOSTILES: 'hostiles',
        MY_CONSTRUCTION_SITES: 'myConstruction',
        RUINS_WITH_NRG: 'ruinsWithEnergy',
        STRUCTURES_NEED_REPAIRS: 'structuresNeedRepairs',
        STRUCTURES_TO_SUPPLY: 'structuresToSupply',
        WALLS_NEED_BULKING: 'wallsNeedBulking',
    },// ==============================

    States: {
        ATTACKING: 'attacking',
        BUILDING: 'building',
        HARVESTING: 'harvesting',
        HEALING: 'healing',
        IDLE: 'idle',
        REPAIRING: 'repairing',
        SUPPLYING: 'supplying',
        UPGRADING: 'upgrading',
    },// ==============================

    HARDSHIP_HARVESTERS_MIN: 2,
    
    DevOutput: function() {
        console.log("Developer Output.");
    },// ==============================

    HeaderOutput: function() {
        for(var i in Memory.creeps) {
            if(!Game.creeps[i]) {
                delete Memory.creeps[i];
            }// =====
        }// =====
        console.log("======================TICK", Game.time, "======================");
        console.log("CPU:", JSON.stringify(Game.cpu));
    },// ==============================
    
    /** @param (object) object to output string **/
    OutputObject: function(object) {
        console.log(JSON.stringify(object));
    },// ==============================

};// ==============================