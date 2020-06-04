const managerController = require('manager.controller');
const managerCreep = require('manager.creep');
const managerTower = require('manager.tower');
const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

module.exports.loop = function () {
    Constants.HeaderOutput();
    
    for(var name in Game.rooms) {
        console.log("----------------------------------------");
        const startCpu = Game.cpu.getUsed();
        console.log("Room:", JSON.stringify(Game.rooms[name]));
        console.log("----------------------------------------");

        // for(var src of Game.rooms[name].find(FIND_SOURCES)) {
        //     console.log("Source at:", src.pos, "- Energy:", src.energy, "/", src.energyCapacity, "- Regen in:", src.ticksToRegeneration);
        // }// ===
        // console.log("----------------------------------------");

        managerTower.run(Game.rooms[name]);
        // console.log("----------------------------------------");
        // console.log(HARVEST_POWER);
        
        managerController.run(Game.rooms[name]);
        console.log("----------------------------------------");
        
        managerCreep.run(Game.rooms[name]);

        // var sitesCount = Game.rooms[name].find(FIND_MY_CONSTRUCTION_SITES).length;
        // if(sitesCount > 0) console.log("Construction sites remaining:", sitesCount);

        // var testArr = [];
        // testArr.push(MOVE);
        // testArr.push(CARRY);
        // for(var t = 0; t < 4; t++) {
        //     testArr.push(WORK);
        // };
        // Constants.OutputObject(testArr);
        
        const elapsed = Game.cpu.getUsed() - startCpu;
        console.log("Room", name, "has used", elapsed, "CPU time");
    }// ==============================
    
    
}// ==============================