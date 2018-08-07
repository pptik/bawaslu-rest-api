const ObjectId = require('mongodb').ObjectID;


exports.alltimeUsersCount=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users= await userColl.aggregate([
                {
                    $match:{
                        role:{ $not: {$size: 0} }
                    }
                },
                { $unwind: "$role" },
                {
                    $group: {
                        _id: '$role',
                        count: { $sum: 1 }
                    }
                },
                {
                    $match: {
                        count: { $gte: 2 }
                    }
                },
            ]).toArray();
            resolve(users);
        } catch (err) {
            reject(err)
        }
    })
};
exports.yearlyUsersCount=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users= await userColl.aggregate([
                {$project : {
                    month : {$month : "$created_at"},
                    year : {$year :  "$created_at"}
                }},
                {$group : {
                    _id : '$year',
                    count:{$sum:1}
                }}
            ]).toArray();
            resolve(users);
        } catch (err) {
            reject(err)
        }
    })
};
exports.monthlyUsersCount=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userColl = database.collection('users');
            let users= await userColl.aggregate([
                {$sort:{
                    created_at:-1
                }},
                {$project : {
                    month : {$month : "$created_at"},
                    year : {$year :  "$created_at"}
                }},
                {$group : {
                    _id :  {month : "$month" ,year : "$year" },
                    count:{$sum:1}
                }}
            ]).toArray();
            resolve(users);
        } catch (err) {
            reject(err)
        }
    })
};
exports.yearlyUsersActivityCount=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userActivityColl = database.collection('users_activity_logs');
            let userActivities= await userActivityColl.aggregate([
                {$sort:{
                    created_at:-1
                }},
                {$project : {
                    year : {$year :  "$created_at"},
                    content_code:1
                }},
                {$group : {
                    _id :  {year:"$year" },
                    count:{$sum:1}
                }}
            ]).toArray();
            resolve(userActivities);
        } catch (err) {
            reject(err)
        }
    })
};
exports.montlyUsersActivityCount=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userActivityColl = database.collection('users_activity_logs');
            let userActivities= await userActivityColl.aggregate([
                {$sort:{
                    created_at:-1
                }},
                {$project : {
                    month : {$month : "$created_at"},
                    year : {$year :  "$created_at"},
                    content_code:1
                }},
                {$group : {
                    _id :  {year:"$year",month : "$month" },
                    count:{$sum:1}
                }}
            ]).toArray();
            resolve(userActivities);
        } catch (err) {
            reject(err)
        }
    })
};
exports.alltimeUsersActivityCount=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userActivityColl = database.collection('users_activity_logs');
            let userActivities= await userActivityColl.aggregate([
                {
                    $match:{
                        content_code:{ $not: {$size: 0} }
                    }
                },
                { $unwind: "$content_code" },
                {
                    $group: {
                        _id: '$content_code',
                        count: { $sum: 1 }
                    }
                }
            ]).toArray();
            resolve(userActivities);
        } catch (err) {
            reject(err)
        }
    })
};
exports.userLeaderList=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let usersColl = database.collection('users');
            let users= await usersColl.aggregate([
                {
                    $match:{
                        role:1
                    }
                }
            ]).toArray();
            resolve(users);
        } catch (err) {
            reject(err)
        }
    })
};
exports.userRelawanList=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let usersColl = database.collection('users');
            let users= await usersColl.aggregate([
                {
                    $match:{
                        role:2
                    }
                }
            ]).toArray();
            resolve(users);
        } catch (err) {
            reject(err)
        }
    })
};
exports.searchUserRelawanList=function(SearchString) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let usersColl = database.collection('users');
            let users= await usersColl.aggregate([
                {
                    $match:{
                        role:2,$text:{$search:SearchString}
                    }
                }
            ]).toArray();
            resolve(users);
        } catch (err) {
            reject(err)
        }
    })
};

exports.searchUserLeaderList=function(SearchString) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let usersColl = database.collection('users');
            let users= await usersColl.aggregate([
                {
                    $match:{
                        role:1,$text:{$search:SearchString}
                    }
                }
            ]).toArray();
            resolve(users);
        } catch (err) {
            reject(err)
        }
    })
};
exports.searchUserActivityList=function(StartDate,EndDate) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let usersColl = database.collection('users_activity_logs');
            let users= await usersColl.aggregate([
                {
                    $match:{
                        created_at:{$gte:new Date(StartDate),$lt:new Date(EndDate)}
                    }
                }
            ]).toArray();
            resolve(users);
        } catch (err) {
            reject(err)
        }
    })
};
exports.countUserActivityList=function(StartDate,EndDate) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let usersColl = database.collection('users_activity_logs');
            let users= await usersColl.aggregate([
                {
                    $match:{
                        created_at:{$gte:new Date(StartDate),$lt:new Date(EndDate)}
                    }
                },
                {
                    $group: {
                        _id: '$content_code',
                        count: { $sum: 1 }
                    }
                }
            ]).toArray();
            resolve(users);
        } catch (err) {
            reject(err)
        }
    })
};
exports.searchUserByContentActivityList=function(StartDate,EndDate,ContentCode) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let usersColl = database.collection('users_activity_logs');
            let users= await usersColl.aggregate([
                {
                    $match:{
                        content_code:ContentCode,created_at:{$gte:new Date(StartDate),$lt:new Date(EndDate)}
                    }
                }
            ]).toArray();
            resolve(users);
        } catch (err) {
            reject(err)
        }
    })
};