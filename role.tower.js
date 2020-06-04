const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

module.exports = {
    
    /** @param (roomObj) room object **/
    run: function(towerObj) {

        switch(towerObj.room.memory[STRUCTURE_TOWER][towerObj.id].state) {
            case Constants.TowerStates.ATTACKING:
                var hostileCreeps = towerObj.room.find(FIND_HOSTILE_CREEPS);
                if(hostileCreeps != null && hostileCreeps.length > 0) {
                    towerObj.attack(towerObj.pos.findClosestByPath(hostileCreeps));
                    towerObj.room.memory[STRUCTURE_TOWER][towerObj.id].state = Constants.TowerStates.ATTACKING;
                } else {
                    towerObj.room.memory[STRUCTURE_TOWER][towerObj.id].state = Constants.TowerStates.IDLE;
                }// =====
                break;
            case Constants.TowerStates.HEALING:
                break;
            default:
            case Constants.TowerStates.IDLE:
                var hostileCreeps = towerObj.room.find(FIND_HOSTILE_CREEPS);
                if(hostileCreeps != null && hostileCreeps.length > 0) {
                    towerObj.attack(towerObj.pos.findClosestByPath(hostileCreeps));
                    towerObj.room.memory[STRUCTURE_TOWER][towerObj.id].state = Constants.TowerStates.ATTACKING;
                }// =====
                break;
            case Constants.TowerStates.REPAIRING:
                break;
        }// =====

    }// ==============================

};// ==============================