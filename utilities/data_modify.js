let moment 	= require('moment');
let dateFormat="DD/MM/YYYY H:m";
const commentsModel=require('../models/comments_models');
const {colors}=require('../setup');

parseDataListMaterial = (items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrResult = [];
            let maxCount = (items.length > 0) ? items.length-1 : 0;
            let countProccess=0;
            let indexNumber=0;
            let dateNow=moment(new Date());
            dateNow.locale('id');
            if(items.length > 0) {
                items.forEach(function (index) {
                    index.index=indexNumber++;
                    let newDate=moment(index.created_at);
                    newDate.locale('id');
                    index.created_at_string=newDate.format('LLLL');
                   if(index.desc.length>100){
                       index.synopsis=index.desc.slice(0,index.desc.length/10);
                       index.loadmore=false;
                   }else {
                       index.synopsis=index.desc.slice(0,index.desc.length/10);
                       index.loadmore=true;
                   }
                    index.created_at_from_now=dateNow.to(newDate);
                    arrResult.push(index);
                    if (countProccess===maxCount){
                        arrResult.sort(function (a,b) {
                            return a.index - b.index;
                        });
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
parseDataListDashboard = (items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrResult = [];
            let maxCount = (items.length > 0) ? items.length-1 : 0;
            let countProccess=0;
            let indexNumber=0;
            let dateNow=moment(new Date());
            dateNow.locale('id');
            if(items.length > 0) {
                items.forEach(function (index) {
                    index.index=indexNumber++;
                    let newDate=moment(index.created_at);
                    newDate.locale('id');
                    index.created_at_string=newDate.format('LLLL');
                    index.synopsis=index.desc.slice(0,index.desc.length/10);
                    if(index.news_type===1||index.news_type===2){
                        index.synopsis=index.desc
                    }
                    index.loadmore=false;
                    index.created_at_from_now=dateNow.to(newDate);
                    arrResult.push(index);
                    if (countProccess===maxCount){
                        arrResult.sort(function (a,b) {
                           return a.index - b.index;
                        });
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
parseDataComments = (items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrResult = [];
            let maxCount = (items.length > 0) ? items.length-1 : 0;
            let countProccess=0;
            let indexNumber=0;
            let dateNow=moment(new Date());
            dateNow.locale('id');
            if(items.length > 0) {
                items.forEach(function (index) {
                    index.index=indexNumber++;
                    let newDate=moment(index.created_at);
                    newDate.locale('id');
                    index.created_at_string=newDate.format('LLLL');
                    index.created_at_from_now=dateNow.to(newDate);

                    arrResult.push(index);
                    if (countProccess===maxCount){
                        arrResult.sort(function (a,b) {
                           return a.index - b.index;
                        });
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
parseDataQuiz = (items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrResult = [];
            let maxCount = (items.length > 0) ? items.length-1 : 0;
            let countProccess=0;
            let indexNumber=0;
            let dateNow=moment(new Date());
            dateNow.locale('id');
            if(items.length > 0) {
                items.forEach(function (index) {
                    index.index=indexNumber++;
                    let newDate=moment(index.created_at);
                    newDate.locale('id');
                    index.created_at_string=newDate.format('LLLL');
                    index.created_at_from_now=dateNow.to(newDate);

                    arrResult.push(index);
                    if (countProccess===maxCount){
                        arrResult.sort(function (a,b) {
                           return a.index - b.index;
                        });
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

parseDataListForums = (items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrResult = [];
            let maxCount = (items.length > 0) ? items.length-1 : 0;
            let countProccess=0;
            let indexNumber=0;
            let dateNow=moment(new Date());
            dateNow.locale('id');
            if(items.length > 0) {
                items.forEach(function (index) {
                    index.index=indexNumber++;
                    let newDate=moment(index.created_at);
                    newDate.locale('id');
                    index.created_at_string=newDate.format('LLLL');
                    index.loadmore=false;
                    index.created_at_from_now=dateNow.to(newDate);
                    arrResult.push(index);
                    if (countProccess===maxCount){
                        arrResult.sort(function (a,b) {
                            return a.index - b.index;
                        });
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
parseDataForumsAnswer = (items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrResult = [];
            let maxCount = (items.length > 0) ? items.length-1 : 0;
            let countProccess=0;
            let indexNumber=0;
            let dateNow=moment(new Date());
            dateNow.locale('id');
            if(items.length > 0) {
                items.forEach(function (index) {
                    index.index=indexNumber++;
                    let newDate=moment(index.created_at);
                    newDate.locale('id');
                    index.created_at_string=newDate.format('LLLL');
                    index.created_at_from_now=dateNow.to(newDate);
                    if(index.level===0){
                        if(index.answer_content.length>100){
                            index.synopsis=index.answer_content.slice(0,index.answer_content.length/10);
                            index.loadmore=false;
                        }else {
                            index.synopsis="";
                            index.loadmore=true;
                        }
                    }else {
                        console.log()
                        if(index.comment.length>100){
                            index.synopsis=index.comment.slice(0,index.comment.length/10);
                            index.loadmore=false;
                        }else {
                            index.synopsis="";
                            index.loadmore=true;
                        }
                    }
                    arrResult.push(index);
                    if (countProccess===maxCount){
                        arrResult.sort(function (a,b) {
                            return a.index - b.index;
                        });
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
alltimeUsersReport = (items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrResult = [];
            let maxCount = (items.length > 0) ? items.length-1 : 0;
            let countProccess=0;
            let indexNumber=0;
            if(items.length > 0) {
                items.forEach(function (index) {
                    index.index=indexNumber++;
                    index.backgroundColor=colors[indexNumber];
                    switch (index._id){
                        case 0:
                            index.name="Administrator";
                            break;
                        case 1:
                            index.name="Team Leader";
                            break;
                        case 2:
                            index.name="Relawan";
                            break;
                        default:
                            index.name="Relawan";
                            break;
                    }
                    arrResult.push(index);
                    if (countProccess===maxCount){
                        arrResult.sort(function (a,b) {
                            return a.index - b.index;
                        });
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
monthlyUsersReport = (items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrResult = [];
            let maxCount = (items.length > 0) ? items.length-1 : 0;
            let countProccess=0;
            let indexNumber=0;
            let monthName=moment.localeData('id').months();
            if(items.length > 0) {
                items.forEach(function (index) {
                    index.index=indexNumber++;
                    index.backgroundColor=colors[indexNumber];
                    index.month=monthName[index._id.month];
                    arrResult.push(index);
                    if (countProccess===maxCount){
                        arrResult.sort(function (a,b) {
                            return a.index - b.index;
                        });
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
yearlyUsersReport = (items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrResult = [];
            let maxCount = (items.length > 0) ? items.length-1 : 0;
            let countProccess=0;
            let indexNumber=0;
            if(items.length > 0) {
                items.forEach(function (index) {
                    index.index=indexNumber++;
                    index.backgroundColor=colors[indexNumber];
                    arrResult.push(index);
                    if (countProccess===maxCount){
                        arrResult.sort(function (a,b) {
                            return a.index - b.index;
                        });
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

alltimeUsersActivityReport = (items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrResult = [];
            let maxCount = (items.length > 0) ? items.length-1 : 0;
            let countProccess=0;
            let indexNumber=0;
            if(items.length > 0) {
                items.forEach(function (index) {
                    index.index=indexNumber++;
                    index.backgroundColor=colors[indexNumber];
                    switch (index._id){
                        case 1:
                            index.name="Materi";
                            break;
                        case 2:
                            index.name="Berita";
                            break;
                        case 3:
                            index.name="Forum";
                            break;
                        case 4:
                            index.name="Komentar";
                            break;
                        default:
                            index.name="Etc";
                            break;
                    }
                    arrResult.push(index);
                    if (countProccess===maxCount){
                        arrResult.sort(function (a,b) {
                            return a.index - b.index;
                        });
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
yearlyUsersActivityReport = (items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrResult = [];
            let maxCount = (items.length > 0) ? items.length-1 : 0;
            let countProccess=0;
            let indexNumber=0;
            if(items.length > 0) {
                items.forEach(function (index) {
                    index.index=indexNumber++;
                    index.backgroundColor=colors[indexNumber];
                    arrResult.push(index);
                    if (countProccess===maxCount){
                        arrResult.sort(function (a,b) {
                            return a.index - b.index;
                        });
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

monthlyUsersActivityReport = (items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrResult = [];
            let maxCount = (items.length > 0) ? items.length-1 : 0;
            let countProccess=0;
            let indexNumber=0;
            let monthName=moment.localeData('id').months();
            if(items.length > 0) {
                items.forEach(function (index) {
                    index.index=indexNumber++;
                    index.backgroundColor=colors[indexNumber];
                    index.month=monthName[index._id.month];
                    arrResult.push(index);
                    if (countProccess===maxCount){
                        arrResult.sort(function (a,b) {
                            return a.index - b.index;
                        });
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
usersLeaderListReport = (items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrResult = [];
            let maxCount = (items.length > 0) ? items.length-1 : 0;
            let countProccess=0;
            let indexNumber=0;
            let dateNow=moment(new Date());
            dateNow.locale('id');
            if(items.length > 0) {
                items.forEach(function (index) {
                    index.index=indexNumber++;
                    let newDate=moment(index.created_at);
                    newDate.locale('id');
                    index.created_at_string=newDate.format('LL');
                    index.created_at_from_now=dateNow.to(newDate);
                    arrResult.push(index);
                    if (countProccess===maxCount){
                        arrResult.sort(function (a,b) {
                            return a.index - b.index;
                        });
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

usersLogActivityDataModify = (items) => {
    return new Promise(async (resolve, reject) => {
        try {
            let arrResult = [];
            let maxCount = (items.length > 0) ? items.length-1 : 0;
            let countProccess=0;
            let indexNumber=0;
            let dateNow=moment(new Date());
            dateNow.locale('id');
            if(items.length > 0) {
                items.forEach(function (index) {
                    index.index=indexNumber++;
                    let newDate=moment(index.created_at);
                    newDate.locale('id');
                    index.created_at_string=newDate.format('LL');
                    index.created_at_from_now=dateNow.to(newDate);
                    arrResult.push(index);
                    if (countProccess===maxCount){
                        arrResult.sort(function (a,b) {
                            return a.index - b.index;
                        });
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
module.exports = {usersLogActivityDataModify,usersLeaderListReport,monthlyUsersActivityReport,yearlyUsersActivityReport,alltimeUsersActivityReport,yearlyUsersReport,monthlyUsersReport,alltimeUsersReport,parseDataForumsAnswer, parseDataListMaterial,parseDataListDashboard,parseDataComments,parseDataQuiz,parseDataListForums };