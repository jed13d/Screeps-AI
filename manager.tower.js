const Constants = require('constants');
const roleTower = require('role.tower');

// Constants.DevOutput();
// Constants.OutputObject();
// JSON.stringify();

module.exports = {
    
    /** @param (roomObj) room object **/
    run: function(roomObj) {

        for(var tower of roomObj.find(FIND_STRUCTURES, {filter: (structure) => {return (structure.structureType == STRUCTURE_TOWER);}})) {
            roleTower.run(tower)
        }// =====

    }// ==============================

};// ==============================