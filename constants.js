
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
        BUILD: 'build',
        GENERAL: 'general',
        LOCAL_ENERGY_HARVEST: 'harvest-local-energy',
        MELEE: 'melee',
        RANGE: 'range',
        UPGRADE: 'upgrade',
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
        'build': {
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
                    role: 'build',
                    state: 'idle',
                    targetId: null,
                },
            },
        },
        'general': {
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
                    targetId: null,
                },
            },
        },
        'harvest-local-energy': {
            buildCosts: [300, 350, 400, 450, 500, 550],
            parts: {
                300: [WORK, CARRY, CARRY, CARRY, MOVE],
                350: [WORK, CARRY, CARRY, CARRY, CARRY, MOVE],
                400: [WORK, WORK, CARRY, CARRY, CARRY, MOVE],
                450: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE],
                500: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE],
                550: [WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE],
            },
            options: {
                memory: {
                    role: 'harvest-local-energy',
                    state: 'idle',
                    targetId: null,
                },
            },
        },
        'melee': {
            buildCosts: [300, 350, 400, 450, 500, 550],
            parts: {
                300: [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE],
                350: [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, MOVE, MOVE, MOVE],
                400: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE],
                450: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE],
                500: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE],
                550: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE],
            },
            options: {
                memory: {
                    role: 'melee',
                    state: 'idle',
                    targetId: null,
                },
            },
        },
        'range': {
            buildCosts: [300, 350, 400, 450, 500, 550],
            parts: {
                300: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, MOVE, MOVE],
                350: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, MOVE, MOVE, MOVE],
                400: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE],
                450: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE],
                500: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE],
                550: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE],
            },
            options: {
                memory: {
                    role: 'range',
                    state: 'idle',
                    targetId: null,
                },
            },
        },
        'upgrade': {
            buildCosts: [300, 350, 400, 450, 500, 550],
            parts: {
                300: [WORK, WORK, CARRY, MOVE],
                350: [WORK, WORK, CARRY, CARRY, MOVE],
                400: [WORK, WORK, WORK, CARRY, MOVE],
                450: [WORK, WORK, WORK, CARRY, CARRY, MOVE],
                500: [WORK, WORK, WORK, WORK, CARRY, MOVE],
                550: [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE],
            },
            options: {
                memory: {
                    role: 'upgrade',
                    state: 'idle',
                    targetId: null,
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