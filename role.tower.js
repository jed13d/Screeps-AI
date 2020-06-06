const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

module.exports = {
    
    /** @param (roomObj) room object **/
    run: function(towerObj) {

        switch(towerObj.room.memory[STRUCTURE_TOWER][towerObj.id].state) {
            case Constants.States.ATTACKING:
                if(towerObj.room.memory.jobTargets[Constants.RoomTargets.HOSTILES].length > 0) {
                    towerObj.attack(towerObj.pos.findClosestByRange(towerObj.room.memory.jobTargets[Constants.RoomTargets.HOSTILES]));
                    towerObj.room.memory[STRUCTURE_TOWER][towerObj.id].state = Constants.States.ATTACKING;
                } else {
                    towerObj.room.memory[STRUCTURE_TOWER][towerObj.id].state = Constants.States.IDLE;
                }// =====
                break;
            case Constants.States.HEALING:
                break;
            default:
            case Constants.States.IDLE:
                if(towerObj.room.memory.jobTargets[Constants.RoomTargets.HOSTILES].length > 0) {
                    towerObj.attack(towerObj.pos.findClosestByRange(towerObj.room.memory.jobTargets[Constants.RoomTargets.HOSTILES]));
                    towerObj.room.memory[STRUCTURE_TOWER][towerObj.id].state = Constants.States.ATTACKING;
                }// =====
                break;
            case Constants.States.REPAIRING:
                break;
        }// =====

    }// ==============================

};// ==============================