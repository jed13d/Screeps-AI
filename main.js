const managerController = require('manager.controller');
const managerCreep = require('manager.creep');
const managerTower = require('manager.tower');
const jobUtils = require('job.utils');
const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

module.exports.loop = function () {
    Constants.HeaderOutput();
    
    for(var name in Game.rooms) {
        console.log("----------------------------------------");
        const startCpu = Game.cpu.getUsed();

        // load fresh targets lists into memory
        if(Game.rooms[name].controller.my && Game.rooms[name].find(FIND_MY_SPAWNS).length > 0) {
            jobUtils.loadRoomTargets(Game.rooms[name]);
            
            managerController.run(Game.rooms[name]);
            console.log("----------------------------------------");

            managerTower.run(Game.rooms[name]);
            // console.log("----------------------------------------");
        }// =====
            
        managerCreep.run(Game.rooms[name]);

        const elapsed = Game.cpu.getUsed() - startCpu;
        console.log("Room", name, "has used", elapsed, "CPU time");
    }// ==============================
    
    
}// ==============================