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
            
            // creep.memory.state = Constants.States.TRAVELING;
            
            switch(creep.memory.state) {
                    
            // ----- CLAIMING ---------------
                case Constants.States.CLAIMING:
                    var target = creep.room.controller;
                    switch(creep.claimController(target)) {
                        default:
                            break;
                        case OK:
                            creep.memory.state = Constants.States.IDLE;
                            break;
                        case ERR_NOT_IN_RANGE:
                            creep.moveTo(target);
                            break;
                        case ERR_NO_BODYPART:
                            creep.suicide();
                            break;
                    }// =====
                    break;
            // ==============================
                    
            // ----- IDLE -------------------
                default:
                case Constants.States.IDLE:
                    if(Game.flags[Constants.FLAG_ROOM_TO_CLAM] != null) {
                        creep.memory.state = Constants.States.TRAVELING;
                    }// =====
                    break;
            // ==============================
                    
            // ----- TRAVELING --------------
                case Constants.States.TRAVELING:
                    var target = Game.flags[Constants.FLAG_ROOM_TO_CLAM];
                    if(creep.pos.inRangeTo(target, 3)) {
                        creep.memory.state = Constants.States.CLAIMING;
                    } else {
                        creep.moveTo(target);
                    }// =====
                    break;
            // ==============================

            }// =====
    },// =====
};// ==============================