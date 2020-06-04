
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
    
    TowerStates: {
        ATTACKING: 'attacking',
        HEALING: 'healing',
        IDLE: 'idle',
        REPAIRING: 'repairing',
    },// ==============================
    
    WorkerStates: {
        ATTACKING: 'attacking',
        BUILDING: 'building',
        HARVESTING: 'harvesting',
        IDLE: 'idle',
        REPAIRING: 'repairing',
        SUPPLYING: 'supplying',
        UPGRADING: 'upgrading',
    },// ==============================
    
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