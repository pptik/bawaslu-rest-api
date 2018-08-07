const ObjectId = require('mongodb').ObjectID;

exports.create=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let activity = {
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                content_code: query.ContentCode,
                content_text: query.ContentText,
                activity_code:query.ActivityCode,
                activity_text:query.ActivityText,
                title:query.Title,
                desc:query.Desc,
                status:0,
                content_id:new ObjectId(query.ContentID),
                created_at: new Date()
            };
            let database = require('../app').database;
            let userActivityLogColl = database.collection('users_activity_logs');
            let result = await userActivityLogColl.insertOne(activity);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.checkUserLogActivity=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumActivityColl = database.collection('users_activity_logs');
            let activity = await forumActivityColl.find({ content_id:new ObjectId(query.ContentID),
                "post_by.user_id":new ObjectId(query.UserID),
                content_code:parseInt(query.ContentCode),
                activity_code:parseInt(query.ActivityCode),
                status:0
            }).toArray();
            if (activity.length > 0) resolve(true);
            else resolve(false)
        } catch (err) {
            reject(err)
        }
    })
};
exports.checkUserLogActivity2=function(query,ActivityCode) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumActivityColl = database.collection('users_activity_logs');
            let activity = await forumActivityColl.findOne({ content_id:new ObjectId(query.ContentID),
                "post_by.user_id":new ObjectId(query.UserID),
                content_code:parseInt(query.ContentCode),
                activity_code:parseInt(ActivityCode),
                status:0
            });
            if (activity) resolve(activity);
            else resolve(false)
        } catch (err) {
            reject(err)
        }
    })
};
exports.deleteUserLogActivity=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userActivityColl = database.collection('users_activity_logs');
            await userActivityColl.deleteOne({ content_id:new ObjectId(query.ContentID), user_id:new ObjectId(query.UserID),
                content_code:parseInt(query.ContentType),
                activity_code:parseInt(query.ActivityCode)
            });
            resolve(false)
        } catch (err) {
            reject(err)
        }
    })
};

exports.setStatusAsDeletedByID=function(LogID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let userActivityColl = database.collection('users_activity_logs');
            await userActivityColl.findOneAndUpdate({_id:new ObjectId(LogID)},{$set:{status:1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.getUserLogActivity=function(UserID,ContentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumActivityColl = database.collection('users_activity_logs');
            let activity = await forumActivityColl.find({ content_id:new ObjectId(ContentID),
                "post_by.user_id":new ObjectId(UserID),
                status:0
            }).toArray();
            resolve(activity);
        } catch (err) {
            reject(err)
        }
    })
};
exports.getAllLogActivityByUserID=function(UserID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumActivityColl = database.collection('users_activity_logs');
            let activity = await forumActivityColl.find({
                "post_by.user_id":new ObjectId(UserID),
                status:0
            }).sort({created_at:-1}).toArray();
            resolve(activity);
        } catch (err) {
            reject(err)
        }
    })
};
exports.getLimitLogActivityByUserID=function(UserID,Skip) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumActivityColl = database.collection('users_activity_logs');
            let activity = await forumActivityColl.find({
                "post_by.user_id":new ObjectId(UserID),
                status:0
            }).sort({created_at:-1}).skip(parseInt(Skip)).toArray();
            resolve(activity);
        } catch (err) {
            reject(err)
        }
    })
};