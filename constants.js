
module.exports = {
    
    States: {
        ATTACKING: 'attacking',
        BUILDING: 'building',
        HARVESTING: 'harvesting',
        IDLE: 'idle',
        SUPPLYING: 'supplying',
        UPGRADING: 'upgrading',
    },// ==============================
    
    Roles: {
        GENERAL: 'general',
    },// ==============================
    
    /*BODYPART_COST: {
        TOUGH:          10,
        CARRY:          50,
        MOVE:           50,
        ATTACK:         80,
        WORK:           100,
        RANGED_ATTACK:  150,
        HEAL:           250,
        CLAIM:          600
    },*/
    
    Workers: {
        'general': {
            max: 10,
            buildCosts: [300, 350, 400, 450, 500, 550],
            parts: {
                300: [WORK, WORK, CARRY, MOVE],
                350: [WORK, WORK, CARRY, MOVE, MOVE],
                400: [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
                450: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
                500: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
                550: [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE],
            },
            options: {
                memory: {
                    role: 'general',
                    state: 'idle',
                },
            },
        },
        'melee': {
            max: 10,
            buildCosts: [300, 350, 400, 450, 500, 550],
            parts: {
                300: [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE],
            },
            options: {
                memory: {
                    role: 'melee',
                    state: 'idle',
                },
            },
        },
    },// ==============================

    DevOutput: function() {
        console.log("Developer Output.");
    },// ==============================

    HeaderOutput: function() {
        console.log("======================TICK", Game.time, "======================");
        console.log("CPU:", this.StringifyObject(Game.cpu));
    },// ==============================
    
    /** @param (object) object to output string **/
    OutputObject: function(object) {
        console.log(JSON.stringify(object));
    },// ==============================
    
    /** @param (object) object to output string **/
    StringifyObject: function(object) {
        return JSON.stringify(object);
    },// ==============================

};// ==============================