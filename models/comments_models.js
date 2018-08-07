const ObjectId = require('mongodb').ObjectID;



exports.create=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let comment = {
                comment:query.Comment,
                content_id:new ObjectId(query.ContentID),
                level:0,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                status:0,
                upvote : 0,
                downvote : 0,
                favorite : 0,
                created_at: new Date(),
                updated_at:[]
            };
            let database = require('../app').database;
            let commentColl = database.collection('comments');
            let result = await commentColl.insertOne(comment);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.reply=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let comment = {
                comment:query.Comment,
                comment_id:new ObjectId(query.CommentID),
                level:1,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                status:0,
                upvote : 0,
                downvote : 0,
                favorite : 0,
                created_at: new Date(),
                updated_at:[]
            };
            let database = require('../app').database;
            let commentColl = database.collection('comments');
            let result = await commentColl.insertOne(comment);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};

exports.listCommentByID=function(CommentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let commentColl = database.collection('comments');
            commentColl.aggregate([
                { $match : { status : 0,content_id:new ObjectId(CommentID) } },
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
                        content:1,
                        comment_id:1,
                        level:1,
                        post_by:1,
                        status:1,
                        files:1,
                        upvote:1,
                        downvote:1,
                        favorite:1,
                        comment:1,
                        created_at:1,
                        updated_at:1
                    }
                }
            ]).sort({created_at:-1}).toArray(function (err,results) {
                if(err)reject(err);
                else resolve(results);
            });
        } catch (err) {
            reject(err)
        }
    })
};
exports.getReplyList=function(CommentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let commentColl = database.collection('comments');
            commentColl.aggregate([
                { $match : { status : 0,comment_id:new ObjectId(CommentID) } },
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
                        content:1,
                        comment_id:1,
                        level:1,
                        post_by:1,
                        status:1,
                        files:1,
                        upvote:1,
                        downvote:1,
                        favorite:1,
                        comment:1,
                        created_at:1,
                        updated_at:1
                    }
                }
            ]).sort({created_at:-1}).toArray(function (err,results) {
                if(err)reject(err);
                else resolve(results);
            });
        } catch (err) {
            reject(err)
        }
    })
};

exports.addUpvoteCountToComments=function(CommentsID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let commentsColl = database.collection('comments');
            await commentsColl.findOneAndUpdate({_id:new ObjectId(CommentsID)},{$inc:{"upvote":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subUpvoteCountToComments=function(CommentsID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let commentsColl = database.collection('comments');
            await commentsColl.findOneAndUpdate({_id:new ObjectId(CommentsID)},{$inc:{"upvote":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addDownvoteCountToComments=function(CommentsID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let commentsColl = database.collection('comments');
            await commentsColl.findOneAndUpdate({_id:new ObjectId(CommentsID)},{$inc:{"downvote":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subDownvoteCountToComments=function(CommentsID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let commentsColl = database.collection('comments');
            await commentsColl.findOneAndUpdate({_id:new ObjectId(CommentsID)},{$inc:{"downvote":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.getDetailCommentAndUserDetail=function(ContentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let commentsColl = database.collection('comments');
            commentsColl.aggregate([
                { $match : {_id:new ObjectId(ContentID)} },
                {
                    $lookup:{
                        from:"users",
                        localField:"post_by.user_id",
                        foreignField:"_id",
                        as:"user_detail"
                    }
                },
                {$unwind:"$user_detail"}
            ]).toArray(function (err,results) {
                if(err)reject(err);
                else resolve(results[0]);
            });
        } catch (err) {
            reject(err)
        }
    })
};