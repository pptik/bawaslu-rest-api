const ObjectId = require('mongodb').ObjectID;


exports.update=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let material = {
                title:query.Title,
                desc:query.Desc,
                type:parseInt(query.Type),
                files:query.Files
            };
            let updatedBy={
              date:new Date(),
                user_id:new ObjectId(query.UserID),
                username:query.Username
            };
            let database = require('../app').database;
            let materialColl = database.collection('materials');
          let result=await materialColl.findOneAndUpdate({_id:new ObjectId(query.MaterialID)},{$set:material,$push:{updated_at:updatedBy}},{returnOriginal:false});
            resolve(result)
        } catch (err) {
            reject(err)
        }
    })
};
exports.create=function(query) {
    return new Promise(async (resolve, reject) => {
        try {
            let material = {
                title:query.Title,
                desc:query.Desc,
                type:parseInt(query.Type),
                post_by:{
                    user_id:new ObjectId(query.UserID),
                    username:query.Username
                },
                files:query.Files,
                status:0,
                upvote : 0,
                downvote : 0,
                favorite : 0,
                comment:0,
                challenge:query.Challenge,
                challenge_detail:query.ChallengeDetail,
                tags:query.Tags,
                created_at: query.CreatedAt,
                updated_at:[]
            };
            let database = require('../app').database;
            let materialColl = database.collection('materials');
            let result = await materialColl.insertOne(material);
            resolve(result['ops'][0])
        } catch (err) {
            reject(err)
        }
    })
};
exports.getList=function(Skip) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let materialColl = database.collection('materials');
            let materials = await materialColl.find().skip(parseInt(Skip)).limit(10).toArray();
            resolve(materials);
        } catch (err) {
            reject(err)
        }
    })
};
exports.getListWithUserPicture=function(Skip) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let materialColl = database.collection('materials');
            materialColl.aggregate([
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
                        type:1,
                        post_by:1,
                        files:1,
                        upvote:1,
                        downvote:1,
                        favorite:1,
                        comment:1,
                        challenge:1,
                        challenge_detail:1,
                        tags:1,
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
exports.getAllList=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let materialColl = database.collection('materials');
            let materials = await materialColl.find().toArray();
            resolve(materials);
        } catch (err) {
            reject(err)
        }
    })
};
exports.setStatusAsDeleted=function(MaterialID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let materialsColl = database.collection('materials');
            await materialsColl.findOneAndUpdate({_id:new ObjectId(MaterialID)},{$set:{status:1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.getDetailMaterial=function(MaterialID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let materialsColl = database.collection('materials');
            let material =await materialsColl.findOne({_id:new ObjectId(MaterialID)});
            resolve(material)
        } catch (error) {
            reject(error)
        }
    })
};

exports.addUpvoteCountToMaterial=function(MaterialID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let materialsColl = database.collection('materials');
            await materialsColl.findOneAndUpdate({_id:new ObjectId(MaterialID)},{$inc:{"upvote":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractUpvoteCountToMaterial=function(MaterialID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let materialsColl = database.collection('materials');
            await materialsColl.findOneAndUpdate({_id:new ObjectId(MaterialID)},{$inc:{"upvote":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addDownvoteCountToMaterial=function(MaterialID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let materialsColl = database.collection('materials');
            await materialsColl.findOneAndUpdate({_id:new ObjectId(MaterialID)},{$inc:{"downvote":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractDownvoteCountToMaterial=function(MaterialID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let materialsColl = database.collection('materials');
            await materialsColl.findOneAndUpdate({_id:new ObjectId(MaterialID)},{$inc:{"downvote":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addFavoriteCountToMaterial=function(MaterialID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let materialsColl = database.collection('materials');
            await materialsColl.findOneAndUpdate({_id:new ObjectId(MaterialID)},{$inc:{"favorite":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractFavoriteCountToMaterial=function(MaterialID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let materialsColl = database.collection('materials');
            await materialsColl.findOneAndUpdate({_id:new ObjectId(MaterialID)},{$inc:{"favorite":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.addCommentCountToMaterial=function(MaterialID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let materialsColl = database.collection('materials');
            await materialsColl.findOneAndUpdate({_id:new ObjectId(MaterialID)},{$inc:{"comment":1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.subtractCommentCountToMaterial=function(MaterialID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let materialsColl = database.collection('materials');
            await materialsColl.findOneAndUpdate({_id:new ObjectId(MaterialID)},{$inc:{"comment":-1}});
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
};
exports.filterListByType=function(Skip,Type) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let materialColl = database.collection('materials');
            materialColl.aggregate([
                { $match : { status : 0,type:parseInt(Type) } },
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
                        type:1,
                        post_by:1,
                        files:1,
                        upvote:1,
                        downvote:1,
                        favorite:1,
                        comment:1,
                        challenge:1,
                        challenge_detail:1,
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
            let materialColl = database.collection('materials');
            materialColl.aggregate([
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
                        desc:1,
                        type:1,
                        post_by:1,
                        files:1,
                        upvote:1,
                        downvote:1,
                        favorite:1,
                        comment:1,
                        challenge:1,
                        challenge_detail:1,
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
            let materialColl = database.collection('materials');
            materialColl.aggregate([
                { $match : { status : 0}},
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
                        type:1,
                        post_by:1,
                        files:1,
                        upvote:1,
                        downvote:1,
                        favorite:1,
                        comment:1,
                        challenge:1,
                        challenge_detail:1,
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