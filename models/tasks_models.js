const ObjectId = require('mongodb').ObjectID;

exports.create=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let task = {
                title:query.Title,
                desc:query.Desc,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                attachment:query.Attachment,
                created_at: new Date(),
                updated_at:[],
                type:1
            };
            let database = require('../app').database;
            let taskColl = database.collection('tasks');
            let result = await taskColl.insertOne(task);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.submitTaskAnswer=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let task = {
                task_id:new ObjectId(query.TaskID),
                title:query.Title,
                desc:query.Desc,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                attachment:query.Attachment,
                created_at: new Date(),
                updated_at:[],
                type:2
            };
            let database = require('../app').database;
            let taskColl = database.collection('tasks');
            let result = await taskColl.insertOne(task);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.checkUserSubmittedAnswer=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let taskColl = database.collection('tasks');
            let tasks = await taskColl.findOne({ task_id: new ObjectId(query.TaskID),'post_by.user_id': new ObjectId(query.UserID) });
            if (tasks) resolve(tasks);
            else resolve(false)
        } catch (err) {
            reject(err)
        }
    })
};
exports.updateTask=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let taskColl = database.collection('tasks');
            let taskQuery={
                title:query.Title,
                desc:query.Desc,
                attachment:query.Attachment
            };
            await taskColl.updateOne({ _id: new ObjectId(query.TaskID) }, {$set:taskQuery,$push:{updated_at:new Date()}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.updateSubmitedTaskAnswer=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let taskColl = database.collection('tasks');
            let taskQuery={
                title:query.Title,
                desc:query.Desc,
                attachment:query.Attachment
            };
            await taskColl.updateOne({ _id: new ObjectId(query.AnswerID) }, {$set:taskQuery,$push:{updated_at:new Date()}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};