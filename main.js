const controllerManager = require('controller.manager');
const creepManager = require('creep.manager');
const Constants = require('constants');

var devMessage = "Developer Test Message";
// console.log(devMessage);
// Constants.OutputObject();
// Constants.StringifyObject();

module.exports.loop = function () {
    Constants.HeaderOutput();
    
    for(var name in Game.rooms) {
        const startCpu = Game.cpu.getUsed();
        console.log("Room:", Constants.StringifyObject(Game.rooms[name]));;
        
        controllerManager.run(Game.rooms[name]);
        
        creepManager.run(Game.rooms[name]);
        
        const elapsed = Game.cpu.getUsed() - startCpu;
        console.log("Room", name, "has used" ,elapsed, "CPU time");
    }// ==============================
    
    
}// ==============================