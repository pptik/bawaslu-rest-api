const ObjectId = require('mongodb').ObjectID;

exports.create=function(query,Tag) {
    return new Promise(async (resolve, reject) => {
        try {
            let tag = {
                tag:Tag,
                count:0,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                created_at: new Date()
            };
            let database = require('../app').database;
            let tagColl = database.collection('tags');
            let result = await tagColl.insertOne(tag);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.checkTag=function(tag) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let tagColl = database.collection('tags');
            let result = await tagColl.find({tag:tag}).toArray();
            if (result.length>0)resolve(true);
            else resolve (false);
        } catch (err) {
            reject(err)
        }
    })
};
exports.addCountToTags=function(tag) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumAnswerColl = database.collection('tags');
            await forumAnswerColl.findOneAndUpdate({tag:tag},{$inc:{"count":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};