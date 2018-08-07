const ObjectId = require('mongodb').ObjectID;
exports.create=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let forums = {
                title: query.Title,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                upvote:0,
                downvote:0,
                favorite:0,
                comment:0,
                status:0,
                challenge:query.Challenge,
                challenge_detail:query.ChallengeDetail,
                created_at: query.CreatedAt,
                updated_at:[],
                tags:query.Tags
            };
            let database = require('../app').database;
            let forumsColl = database.collection('forums');
            let result = await forumsColl.insertOne(forums);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.getListWithUserPicture=function(Skip) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumsColl = database.collection('forums');
            forumsColl.aggregate([
                { $match : { status : 0 } },
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
                        desc:1,
                        post_by:1,
                        content_code:1,
                        content_text:1,
                        activity_code:1,
                        activity_text:1,
                        content_id:1,
                        upvote:1,
                        downvote:1,
                        favorite:1,
                        comment:1,
                        challenge:1,
                        challenge_detail:1,
                        created_at:1,
                        updated_at:1,
                        news_type:1,
                        tags:1,
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
exports.getListWithUserPicture2=function(Skip) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumsColl = database.collection('forums');
            forumsColl.aggregate([
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
                        desc:1,
                        post_by:1,
                        content_code:1,
                        content_text:1,
                        activity_code:1,
                        activity_text:1,
                        content_id:1,
                        upvote:1,
                        downvote:1,
                        favorite:1,
                        comment:1,
                        challenge:1,
                        challenge_detail:1,
                        created_at:1,
                        updated_at:1,
                        news_type:1,
                        tags:1,
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
exports.searchListByTitleAndTag=function(SearchString) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumsColl = database.collection('forums');
            forumsColl.aggregate([
                { $match : { status : 0,$text:{$search:SearchString} } },
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
                        post_by:1,
                        upvote:1,
                        downvote:1,
                        favorite:1,
                        comment:1,
                        challenge:1,
                        challenge_detail:1,
                        status:1,
                        created_at:1,
                        tags:1,
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
exports.updateForum=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let forums = {
                title: query.Title,
                content: query.Content,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                tags:query.Tags
            };
            let database = require('../app').database;
            let forumsColl = database.collection('forums');
            await forumsColl.updateOne({_id:new ObjectId(query.UserID)},{$push: {updated_at: new Date()},$set:forums});
            resolve(true);
        } catch (err) {
            reject(err)
        }
    })
};
exports.getForumDetailByID=function(ForumID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumColl = database.collection('forums');
            forumColl.aggregate([
                {
                    $match:{
                        _id:new ObjectId(ForumID)
                    }
                },
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
                        desc:1,
                        post_by:1,
                        content_code:1,
                        content_text:1,
                        activity_code:1,
                        activity_text:1,
                        content_id:1,
                        upvote:1,
                        downvote:1,
                        favorite:1,
                        comment:1,
                        challenge:1,
                        challenge_detail:1,
                        created_at:1,
                        updated_at:1,
                        news_type:1,
                        tags:1,
                        status:1
                    }
                }
            ]).toArray(function (err,results) {
                if(err)reject(err);
                if(results.length>0){
                    resolve(results[0])
                }else resolve(results)
            });
        } catch (err) {
            reject(err)
        }
    })
};
exports.addUpvoteCountToForum=function(ForumID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumColl = database.collection('forums');
            await forumColl.findOneAndUpdate({_id:new ObjectId(ForumID)},{$inc:{"upvote":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractUpvoteCountToForum=function(ForumID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumColl = database.collection('forums');
            await forumColl.findOneAndUpdate({_id:new ObjectId(ForumID)},{$inc:{"upvote":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addDownvoteCountToForum=function(ForumID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumColl = database.collection('forums');
            await forumColl.findOneAndUpdate({_id:new ObjectId(ForumID)},{$inc:{"downvote":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractDownvoteCountToForum=function(ForumID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumColl = database.collection('forums');
            await forumColl.findOneAndUpdate({_id:new ObjectId(ForumID)},{$inc:{"downvote":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addFavoriteCountToForum=function(ForumID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumColl = database.collection('forums');
            await forumColl.findOneAndUpdate({_id:new ObjectId(ForumID)},{$inc:{"favorite":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractFavoriteCountToForum=function(ForumID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumColl = database.collection('forums');
            await forumColl.findOneAndUpdate({_id:new ObjectId(ForumID)},{$inc:{"favorite":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.createAnswer=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let answer = {
                forum_id: new ObjectId(query.ForumID),
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                answer_content:query.Answer,
                upvote:0,
                downvote:0,
                favorite:0,
                status:0,
                selected:false,
                created_at: new Date(),
                updated_at:[],
                level:0
            };
            let database = require('../app').database;
            let answerColl = database.collection('forum_answers');
            let result = await answerColl.insertOne(answer);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.replyAnswer=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let answerReply = {
                comment:query.Answer,
                answer_id:new ObjectId(query.AnswerID),
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
            let answerColl = database.collection('forum_answers');
            let result = await answerColl.insertOne(answerReply);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.createSubAnswer=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let answer = {
                answer_id: new ObjectId(query.AnswerID),
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                answer_content:query.Answer,
                upvote:0,
                downvote:0,
                favorite:0,
                created_at: new Date(),
                updated_at:[],
                level:1
            };
            let database = require('../app').database;
            let answerColl = database.collection('forum_answers');
            let result = await answerColl.insertOne(answer);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.addUpvoteCountToForumAnswer=function(AnswerID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumAnswerColl = database.collection('forum_answers');
            await forumAnswerColl.findOneAndUpdate({_id:new ObjectId(AnswerID)},{$inc:{"upvote":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractUpvoteCountToForumAnswer=function(AnswerID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumAnswerColl = database.collection('forum_answers');
            await forumAnswerColl.findOneAndUpdate({_id:new ObjectId(AnswerID)},{$inc:{"upvote":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addDownvoteCountToForumAnswer=function(AnswerID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumAnswerColl = database.collection('forum_answers');
            await forumAnswerColl.findOneAndUpdate({_id:new ObjectId(AnswerID)},{$inc:{"downvote":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractDownvoteCountToForumAnswer=function(AnswerID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumAnswerColl = database.collection('forum_answers');
            await forumAnswerColl.findOneAndUpdate({_id:new ObjectId(AnswerID)},{$inc:{"downvote":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addFavouriteCountToForumAnswer=function(AnswerID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumAnswerColl = database.collection('forum_answers');
            await forumAnswerColl.findOneAndUpdate({_id:new ObjectId(AnswerID)},{$inc:{"Favourite":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractFavouriteCountToForumAnswer=function(AnswerID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumAnswerColl = database.collection('forum_answers');
            await forumAnswerColl.findOneAndUpdate({_id:new ObjectId(AnswerID)},{$inc:{"Favourite":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.updateForumAnswer=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let answer = {
                answer_content:query.Answer
            };
            let database = require('../app').database;
            let answerColl = database.collection('forum_answers');
            await answerColl.updateOne({_id:new ObjectId(query.AnswerID)},{$push: {updated_at: new Date()},$set:answer});
            resolve(true);
        } catch (err) {
            reject(err)
        }
    })
};
exports.getAnswersByForumID=function(ForumID,Skip) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let answerColl = database.collection('forum_answers');
            let answerDetail= await answerColl.aggregate([
                {
                    $match:{
                        forum_id:new ObjectId(ForumID)
                    }
                },
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
                        forum_id:1,
                        post_by:1,
                        answer_content:1,
                        upvote:1,
                        downvote:1,
                        favorite:1,
                        challenge:1,
                        challenge_detail:1,
                        status:1,
                        selected:1,
                        created_at:1,
                        updated_at:1,
                        level:1,
                    }
                },
                {$sort:{
                    upvote:-1
                }}
            ]).skip(parseInt(Skip)).limit(5).toArray();
            resolve(answerDetail);
        } catch (err) {
            reject(err)
        }
    })
};

exports.aktivasiForum=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let forum = {
                status:0
            };
            let updatedBy={
                date:new Date(),
                user_id:new ObjectId(query.UserID),
                username:query.Username
            };
            let database = require('../app').database;
            let forumColl = database.collection('forums');
            let result=await forumColl.findOneAndUpdate({_id:new ObjectId(query.ForumID)},{$set:forum,$push:{updated_at:updatedBy}},{returnOriginal:false});
            resolve(result.value)
        } catch (err) {
            reject(err)
        }
    })
};
exports.deaktivasiForum=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let forum = {
                status:1
            };
            let updatedBy={
                date:new Date(),
                user_id:new ObjectId(query.UserID),
                username:query.Username
            };
            let database = require('../app').database;
            let forumColl = database.collection('forums');
            let result=await forumColl.findOneAndUpdate({_id:new ObjectId(query.ForumID)},{$set:forum,$push:{updated_at:updatedBy}},{returnOriginal:false});
            resolve(result.value)
        } catch (err) {
            reject(err)
        }
    })
};
exports.addCommentCountToForum=function(ForumID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumColl = database.collection('forums');
            await forumColl.findOneAndUpdate({_id:new ObjectId(ForumID)},{$inc:{"comment":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.listAnswerByForumID=function(ForumID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let answerColl = database.collection('forum_answers');
            answerColl.aggregate([
                { $match : { status : 0,forum_id:new ObjectId(ForumID) } },
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
                        forum_id:1,
                        post_by:1,
                        answer_content:1,
                        upvote:1,
                        downvote:1,
                        favorite:1,
                        challenge:1,
                        challenge_detail:1,
                        status:1,
                        selected:1,
                        created_at:1,
                        updated_at:1,
                        level:1
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

exports.listCommentAnswerByAnswerID=function(AnswerID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let answerColl = database.collection('forum_answers');
            answerColl.aggregate([
                { $match : { status : 0,answer_id:new ObjectId(AnswerID) } },
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
                        comment:1,
                        answer_id:1,
                        post_by:1,
                        answer_content:1,
                        upvote:1,
                        downvote:1,
                        favorite:1,
                        challenge:1,
                        challenge_detail:1,
                        status:1,
                        selected:1,
                        created_at:1,
                        updated_at:1,
                        level:1
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
exports.selectAcceptedAnswer=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let answer = {
                selected:true
            };
            let updatedBy={
                date:new Date(),
                user_id:new ObjectId(query.UserID),
                username:query.Username
            };
            let database = require('../app').database;
            let forumAnswerColl = database.collection('forum_answers');
            let result=await forumAnswerColl.findOneAndUpdate({_id:new ObjectId(query.AnswerID)},{$set:answer,$push:{updated_at:updatedBy}},{returnOriginal:false});
            resolve(result.value)
        } catch (err) {
            reject(err)
        }
    })
};
exports.unselectAcceptedAnswer=function(AnswerID) {
    return new Promise(async (resolve, reject) => {
        try {
            let answer = {
                selected:false
            };
            let database = require('../app').database;
            let forumAnswerColl = database.collection('forum_answers');
            let result=await forumAnswerColl.findOneAndUpdate({_id:new ObjectId(AnswerID)},{$set:answer},{returnOriginal:false});
            resolve(result.value)
        } catch (err) {
            reject(err)
        }
    })
};
exports.checkAcceptedAnswer=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let forumAnswerColl = database.collection('forum_answers');
            let answer =await forumAnswerColl.findOne({forum_id:new ObjectId(query.ForumID),selected:true});
            if(answer)resolve(answer);
            else resolve(false);
        } catch (error) {
            reject(error)
        }
    })
};