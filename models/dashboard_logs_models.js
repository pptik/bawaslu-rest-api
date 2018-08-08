const ObjectId = require('mongodb').ObjectID;

exports.updateTitleAndDescMaterial=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let dashboardLog = {
                title:query.Title,
                desc:query.Desc
            };
            let updatedBy={
                date:new Date(),
                user_id:new ObjectId(query.UserID),
                username:query.Username
            };
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            let result=await dashboardActivityColl.findOneAndUpdate({content_id:new ObjectId(query.MaterialID)},{$set:dashboardLog,$push:{updated_at:updatedBy}},{returnOriginal:false});
            resolve(result)
        } catch (err) {
            reject(err)
        }
    })
};
exports.create=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let dashboardActivity = {
                title:query.Title,
                desc:query.Desc,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                content_code: query.ContentCode,
                content_text: query.ContentText,
                activity_code:query.ActivityCode,
                activity_text:query.ActivityText,
                content_id:new ObjectId(query.ContentID),
                status:0,
                upvote : 0,
                downvote : 0,
                favorite : 0,
                comment:0,
                created_at: new Date(),
                updated_at:[]
            };
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            let result = await dashboardActivityColl.insertOne(dashboardActivity);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.createNews=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let dashboardActivity = {
                title:query.Title,
                desc:query.Desc,
                challenge:query.Challenge,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                content_code: query.ContentCode,
                content_text: query.ContentText,
                activity_code:query.ActivityCode,
                activity_text:query.ActivityText,
                content_id:new ObjectId(query.ContentID),
                news_type:parseInt(query.NewsType),
                status:0,
                upvote : 0,
                downvote : 0,
                favorite : 0,
                comment:0,
                created_at: new Date(),
                updated_at:[]
            };
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            let result = await dashboardActivityColl.insertOne(dashboardActivity);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.createMediaNews=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let dashboardActivity = {
                title:query.Title,
                desc:query.Desc,
                challenge:query.Challenge,
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                content_code: query.ContentCode,
                content_text: query.ContentText,
                activity_code:query.ActivityCode,
                activity_text:query.ActivityText,
                content_id:new ObjectId(query.ContentID),
                news_type:parseInt(query.NewsType),
                files:query.Files,
                status:0,
                upvote : 0,
                downvote : 0,
                favorite : 0,
                comment:0,
                created_at: new Date(),
                updated_at:[]
            };
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            let result = await dashboardActivityColl.insertOne(dashboardActivity);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.addUpvoteCountToDashboarActivity=function(ContentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            await dashboardActivityColl.findOneAndUpdate({content_id:new ObjectId(ContentID)},{$inc:{"upvote":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractUpvoteCountToDashboarActivity=function(ContentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            await dashboardActivityColl.findOneAndUpdate({content_id:new ObjectId(ContentID)},{$inc:{"upvote":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addDownvoteCountToDashboarActivity=function(ContentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            await dashboardActivityColl.findOneAndUpdate({content_id:new ObjectId(ContentID)},{$inc:{"downvote":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractDownvoteCountToDashboardActivity=function(ContentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            await dashboardActivityColl.findOneAndUpdate({content_id:new ObjectId(ContentID)},{$inc:{"downvote":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addFavoriteCountToDashboardActivity=function(ContentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            await dashboardActivityColl.findOneAndUpdate({content_id:new ObjectId(ContentID)},{$inc:{"favorite":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractFavoriteCountToDashboardActivity=function(ContentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            await dashboardActivityColl.findOneAndUpdate({content_id:new ObjectId(ContentID)},{$inc:{"favorite":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addCommentCountToDashboardActivity=function(ContentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            await dashboardActivityColl.findOneAndUpdate({content_id:new ObjectId(ContentID)},{$inc:{"comment":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractCommentCountToDashboardActivity=function(ContentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            await dashboardActivityColl.findOneAndUpdate({content_id:new ObjectId(ContentID)},{$inc:{"comment":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.getList=function(Skip) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            let dashboardLog = await dashboardActivityColl.find().skip(parseInt(Skip)).limit(10).toArray();
            resolve(dashboardLog);
        } catch (err) {
            reject(err)
        }
    })
};

exports.getListWithUserPicture=function(Skip) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            dashboardActivityColl.aggregate([
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
                        challenge:1,
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
                        created_at:1,
                        updated_at:1,
                        news_type:1,
                        files:1
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
exports.setStatusAsDeleted=function(ContentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            await dashboardActivityColl.findOneAndUpdate({content_id:new ObjectId(ContentID)},{$set:{status:1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.setStatusAsActivated=function(ContentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            await dashboardActivityColl.findOneAndUpdate({content_id:new ObjectId(ContentID)},{$set:{status:0}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};

exports.filterListByContent=function(Skip,ContentCode) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            dashboardActivityColl.aggregate([
                { $match : { status : 0,content_code:parseInt(ContentCode) } },
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
                        challenge:1,
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
                        created_at:1,
                        updated_at:1
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
exports.searchListByTitle=function(Skip,SearchString) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            dashboardActivityColl.aggregate([
                { $match : { status : 0,$text:{$search:SearchString}} },
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
                        challenge:1,
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
                        created_at:1,
                        updated_at:1
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
exports.filterListSortBy=function(Skip,MySort) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            dashboardActivityColl.aggregate([
                { $match : { status : 0} },
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
                        challenge:1,
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
                        created_at:1,
                        updated_at:1
                    }
                }
            ]).sort(MySort).skip(parseInt(Skip)).limit(5).toArray(function (err,results) {
                if(err)reject(err);
                else resolve(results);
            });
        } catch (err) {
            reject(err)
        }
    })
};
exports.getDetailDashboardLog=function(ContentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            let dashboardLog =await dashboardActivityColl.findOne({content_id:new ObjectId(ContentID)});
            resolve(dashboardLog)
        } catch (error) {
            reject(error)
        }
    })
};

exports.getDetailDashboardLogAndUserDetail=function(ContentID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let dashboardActivityColl = database.collection('dashboard_log_activity');
            dashboardActivityColl.aggregate([
                { $match : { content_id:new ObjectId(ContentID)} },
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