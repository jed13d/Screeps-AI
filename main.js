const managerController = require('manager.controller');
const managerCreep = require('manager.creep');
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
        
        managerController.run(Game.rooms[name]);
        
        managerCreep.run(Game.rooms[name]);
        
        const elapsed = Game.cpu.getUsed() - startCpu;
        console.log("Room", name, "has used", elapsed, "CPU time");
    }// ==============================
    
    
}// ==============================