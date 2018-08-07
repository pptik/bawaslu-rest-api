const ObjectId = require('mongodb').ObjectID;


exports.create=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let news = {
                title:query.Title,
                content:query.Content,
                desc:query.Desc,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                type:0,
                upvote : 0,
                downvote : 0,
                favorite : 0,
                comment:0,
                status:0,
                challenge:query.Challenge,
                challenge_detail: query.ChallengeDetail,
                created_at: new Date(),
                updated_at:[]
            };
            let database = require('../app').database;
            let newsColl = database.collection('news');
            let result = await newsColl.insertOne(news);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.createUsersActivitiesWithMedia=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let news = {
                content:query.Content,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                files:query.Files,
                type:1,
                upvote : 0,
                downvote : 0,
                favorite : 0,
                status:0,
                comment:0,
                challenge:query.Challenge,
                challenge_detail:query.ChallengeDetail,
                tags:query.Tags,
                created_at: query.CreatedAt,
                updated_at:[]
            };
            let database = require('../app').database;
            let newsColl = database.collection('news');
            let result = await newsColl.insertOne(news);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.createUsersActivitiesWithText=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let news = {
                content:query.Content,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                type:2,
                upvote : 0,
                downvote : 0,
                favorite : 0,
                status:0,
                comment:0,
                challenge:query.Challenge,
                challenge_detail:query.ChallengeDetail,
                tags:query.Tags,
                created_at: query.CreatedAt,
                updated_at:[]
            };
            let database = require('../app').database;
            let newsColl = database.collection('news');
            let result = await newsColl.insertOne(news);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.getNewsDetail=function(NewsID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let newsColl = database.collection('news');
            newsColl.aggregate([
                { $match : { _id:new ObjectId(NewsID)} },
                {
                    $lookup:{
                        from:"users",
                        localField:"post_by.user_id",
                        foreignField:"_id",
                        as:"user_detail"
                    }
                },
                {$unwind:"$user_detail"},
                {
                    $project:{
                        'user_detail.display_picture':1,
                        post_by:1,
                        title:1,
                        content:1,
                        desc:1,
                        type:1,
                        upvote : 1,
                        downvote : 1,
                        favorite : 1,
                        comment:1,
                        tags:1,
                        created_at: 1,
                        updated_at:1,
                        files:1,
                        challenge:1,
                        challenge_detail:1,
                    }
                }
            ]).toArray(function (err,results) {
                if(err)reject(err);
                else resolve(results[0]);
            });
        } catch (error) {
            reject(error)
        }
    })
};

exports.addUpvoteCountToNews=function(NewsID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let newsColl = database.collection('news');
            await newsColl.findOneAndUpdate({_id:new ObjectId(NewsID)},{$inc:{"upvote":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subUpvoteCountToNews=function(NewsID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let newsColl = database.collection('news');
            await newsColl.findOneAndUpdate({_id:new ObjectId(NewsID)},{$inc:{"upvote":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addDownvoteCountToNews=function(NewsID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let newsColl = database.collection('news');
            await newsColl.findOneAndUpdate({_id:new ObjectId(NewsID)},{$inc:{"downvote":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subDownvoteCountToNews=function(NewsID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let newsColl = database.collection('news');
            await newsColl.findOneAndUpdate({_id:new ObjectId(NewsID)},{$inc:{"upvote":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addFavoriteCountToNews=function(NewsID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let newsColl = database.collection('news');
            await newsColl.findOneAndUpdate({_id:new ObjectId(NewsID)},{$inc:{"favorite":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subFavoriteCountToNews=function(NewsID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let newsColl = database.collection('news');
            await newsColl.findOneAndUpdate({_id:new ObjectId(NewsID)},{$inc:{"favorite":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addCommentCountToNews=function(NewsID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let newsColl = database.collection('news');
            await newsColl.findOneAndUpdate({_id:new ObjectId(NewsID)},{$inc:{"comment":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subCommentCountToNews=function(NewsID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let newsColl = database.collection('news');
            await newsColl.findOneAndUpdate({_id:new ObjectId(NewsID)},{$inc:{"comment":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.getListWithUserPicture2=function(Skip) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let newsColl = database.collection('news');
            newsColl.aggregate([
                {
                    $lookup:{
                        from:"users",
                        localField:"post_by.user_id",
                        foreignField:"_id",
                        as:"user_detail"
                    }
                },
                {$unwind:"$user_detail"},
                {
                    $project:{
                        'user_detail.display_picture':1,
                        title:1,
                        content:1,
                        desc:1,
                        type:1,
                        post_by:1,
                        upvote:1,
                        downvote:1,
                        favorite:1,
                        comment:1,
                        challenge:1,
                        challenge_detail:1,
                        created_at:1,
                        updated_at:1,
                        status:1
                    }
                }
            ]).sort({created_at:-1}).skip(parseInt(Skip)).limit(5).toArray(function (err,results) {
                if(err)reject(err);
                else resolve(results);
            });
        } catch (err) {
            reject(err)
        }
    })
};
exports.aktivasiNews=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let news = {
                status:0
            };
            let updatedBy={
                date:new Date(),
                user_id:new ObjectId(query.UserID),
                username:query.Username
            };
            let database = require('../app').database;
            let newsColl = database.collection('news');
            let result=await newsColl.findOneAndUpdate({_id:new ObjectId(query.NewsID)},{$set:news,$push:{updated_at:updatedBy}},{returnOriginal:false});
            resolve(result.value)
        } catch (err) {
            reject(err)
        }
    })
};
exports.deaktivasiNews=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let news = {
                status:1
            };
            let updatedBy={
                date:new Date(),
                user_id:new ObjectId(query.UserID),
                username:query.Username
            };
            let database = require('../app').database;
            let newsColl = database.collection('news');
            let result=await newsColl.findOneAndUpdate({_id:new ObjectId(query.NewsID)},{$set:news,$push:{updated_at:updatedBy}},{returnOriginal:false});
            resolve(result.value)
        } catch (err) {
            reject(err)
        }
    })
};