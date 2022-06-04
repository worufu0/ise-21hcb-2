

let totalNumOfClass = (classID) => {
    var obj = require('../datatable.json');
    
    return obj.data.filter(item => item['class'] === classID).length;
}

let totalNumOfPass = (classID) => {
    var obj = require('../datatable.json');
    
    return obj.data.filter(item => item['class'] === classID && (item['score1'] + item['score2'])/2 >= 5).length;
}
function handleRatePass(classID){
    var obj = require('../datatable.json');

    var total = totalNumOfClass(classID)
    var numStudentPass = totalNumOfPass(classID);

 
    return `${numStudentPass / total * 100}%` ;

}

function writeJSON(classID){
    var obj = require('../dataclass.json');
    obj.data['pass'] = 10;

    return obj;
}

function hello(){
    console.log(writeJSON('10A1'));
    
}








