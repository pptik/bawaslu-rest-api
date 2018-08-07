let moment 	= require('moment');
let dateFormat="DD/MM/YYYY H:m";

parseCreatedDateToString = (items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrResult = [];
            let maxCount = (items.length > 0) ? items.length-1 : 0;
            let countProccess=0;
            if(items.length > 0) {
                items.forEach(function (index) {
                    let newDate=moment(index.created_at);
                    newDate.locale('id');
                    index.created_at_string=newDate.format('LLLL');
                    arrResult.push(index);
                    if (countProccess===maxCount){
                        resolve(arrResult);
                    }
                    countProccess++;
                });
            }else resolve(arrResult);
        } catch (error) {
            reject(error)
        }
    })
};


module.exports = { parseCreatedDateToString };