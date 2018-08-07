const ObjectId = require('mongodb').ObjectID;

exports.checkClassCode=function(Code) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let classColl = database.collection('classes');
            let classes = await classColl.find({ code: Code }).toArray();
            if (classes.length > 0) resolve(true);
            else resolve(false)
        } catch (err) {
            reject(err)
        }
    })
};
exports.create=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let classParam = {
                name:query.ClassName,
                code:query.ClassCode,
                desc:query.Desc,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                created_at: new Date(),
                updated_at:[],
                verified: true,
                participant:[]
            };
            let database = require('../app').database;
            let classColl = database.collection('classes');
            let result = await classColl.insertOne(classParam);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.checkClassByClassCode=function(ClassCode) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let classColl = database.collection('classes');
            let classes = await classColl.find({ code: ClassCode }).toArray();
            if(classes.length>0){
                resolve(true);
            }else {
                resolve(false);
            }
        } catch (err) {
            reject(err)
        }
    })
};
exports.getClassList=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let classColl = database.collection('classes');
            let classes = await classColl.find().toArray();
            resolve(classes);
        } catch (err) {
            reject(err)
        }
    })
};
exports.findClassByClassCode=function(ClassCode) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let classColl = database.collection('classes');
            let classDetail = await classColl.findOne({ code: ClassCode });
            resolve(classDetail);
        } catch (err) {
            reject(err)
        }
    })
};
exports.findClassByID=function(ClassID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let classColl = database.collection('classes');
            let classDetail = await classColl.findOne({ _id:new ObjectId(ClassID) });
            resolve(classDetail);
        } catch (err) {
            reject(err)
        }
    })
};
exports.checkParticipantInClass=(query)=>{
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let classColl = database.collection('classes');
            let classes = await classColl.find(
                { code: query.ClassCode,
                    participant:{
                    $elemMatch:{
                        participant_id:new ObjectId(query.UserID)
                    }
                }}).toArray();
            if(classes.length>0){
                resolve(true);
            }else {
                resolve(false);
            }
        } catch (err) {
            reject(err)
        }
    })
};
exports.participantJoinClass=(query)=>{
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let classColl = database.collection('classes');
            let classParticipantQuery={
                participant_id:new ObjectId(query.UserID),
                participant_username:query.Username,
                class_poin:0
            };
            await classColl.updateOne({code:query.ClassCode},{$push: {participant:classParticipantQuery}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};