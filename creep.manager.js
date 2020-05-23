const roleGeneral = require('role.general');
const Constants = require('constants');

var devMessage = "Developer Test Message";
// console.log(devMessage);
// Constants.OutputObject();
// Constants.StringifyObject();

module.exports = {
    
    /** @param (roomObj) room object **/
    run: function(roomObj) {
        
        let allCreepsInRoom = _.filter(Game.creeps, (creep) => creep.room.name === roomObj.name);
        console.log("Number of workers:", allCreepsInRoom.length);
        
        /**
         * Spawn workers, only if energy is at max capacity
         * Hopefully, by order of appearance in Constants.Workers{}
         */
        if(roomObj.energyAvailable === roomObj.energyCapacityAvailable) {
            for(let workerRole in Constants.Roles) {
                let roleTitle = Constants.Roles[workerRole];
                
                /**
                 * Build first needed worker found. Then, report the spawning.
                 */ 
                if(_.filter(allCreepsInRoom, (creep) => creep.memory.role === roleTitle).length < Constants.Workers[roleTitle].max) {
                    let workerName = roleTitle + Game.time;
                    let rSpawn = _.filter(Game.spawns, (spawn) => spawn.room.name === roomObj.name)[0];
                    
                    // used for choosing largest creep build option
                    let nrgToUse = 0;
                    for(let cost of Constants.Workers[roleTitle].buildCosts) {
                        if(cost > nrgToUse && roomObj.energyCapacityAvailable >= cost) {
                            nrgToUse = cost;
                        }// =====
                    };// =====
                    
                    console.log("Energy to use in spawning:", nrgToUse);
                    // attempt to spawn
                    let result = rSpawn.spawnCreep(
                        Constants.Workers[roleTitle].parts[nrgToUse],
                        workerName,
                        Constants.Workers[roleTitle].options
                    );
                    
                    // upon success
                    if(result === 0) {
                        roomObj.visual.text('🛠️' + workerName, rSpawn.pos.x +1, rSpawn.pos.y, {align: 'left', opacity: 0.8});
                        break;
                    } else {
                        console.log("Spawn error:", result);
                    }// ===== if
                }// ===== if
                
            }// ===== for
        }// ===== if
        
        /**
         * Orders for creeps based on role.
         */
        for(let worker of allCreepsInRoom) {
            switch(worker.memory.role) {
                default:
                case Constants.Roles.GENERAL:
                    roleGeneral.run(worker);
                    break;
            }// ===== switch
        }// ===== for
        
    
    },// ==============================

};// ==============================