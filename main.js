const managerController = require('manager.controller');
const managerCreep = require('manager.creep');
const Constants = require('constants');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

module.exports.loop = function () {
    Constants.HeaderOutput();
    
    for(var name in Game.rooms) {
        const startCpu = Game.cpu.getUsed();
        console.log("Room:", JSON.stringify(Game.rooms[name]));

        // for(var src of Game.rooms[name].find(FIND_SOURCES)) {
        //     console.log("Source at:", src.pos, "- Energy:", src.energy, "/", src.energyCapacity, "- Regen in:", src.ticksToRegeneration);
        // }// ===
        
        managerController.run(Game.rooms[name]);
        
        managerCreep.run(Game.rooms[name]);

        // var sitesCount = Game.rooms[name].find(FIND_MY_CONSTRUCTION_SITES).length;
        // if(sitesCount > 0) console.log("Construction sites remaining:", sitesCount);
        
        const elapsed = Game.cpu.getUsed() - startCpu;
        console.log("Room", name, "has used", elapsed, "CPU time");
    }// ==============================
    
    
}// ==============================