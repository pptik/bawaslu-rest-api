const router = require('koa-router')();
const {requestResponse}=require('../setup');
const usersModel=require('../models/users_models');
const activityLogModel=require('../models/activity_logs_models');
const commentsModel=require('../models/comments_models');
const { checkToken } = require('../utilities/token_helper');
const {activities}=require('../setup');
const {parseDataComments}=require('../utilities/data_modify');
let moment 	= require('moment');
const {sorter}=require('../setup');
const {poins}=require('../setup');
const {distributePoins}=require('../utilities/calculate_poin');
const dashboardLogModel=require('../models/dashboard_logs_models');
const materialsModel=require('../models/materials_models');
const newsModel=require('../models/news_models');
const forumsModel=require('../models/forums_models');


router.post('/comments/create', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','Comment','ContentID','Type'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                let detailComment=await commentsModel.create(query);
                query.ContentCode=activities.create_comment.content_code;
                query.ContentText=activities.create_comment.content;
                query.ActivityCode=activities.create_comment.activity_code;
                query.ActivityText=activities.create_comment.activity_text;
                query.Desc=query.Comment;
                query.Title="Komentar ";
                activityLogModel.create(query);
                dashboardLogModel.addCommentCountToDashboardActivity(query.ContentID);
                switch (parseInt(query.Type)){
                    case 1:
                        materialsModel.addCommentCountToMaterial(query.ContentID);
                        break;
                    case 2:
                        newsModel.addCommentCountToNews(query.ContentID);
                        break;
                    case 3:
                        forumsModel.addCommentCountToForum(query.ContentID)
                        break;
                }
                result=Object.assign(requestResponse.common_success);
                result.results=detailComment
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/comments/reply', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','Comment','CommentID','ContentID','Type'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                let detailComment=await commentsModel.reply(query);

                query.ContentCode=activities.create_comment.content_code;
                query.ContentText=activities.create_comment.content;
                query.ActivityCode=activities.create_comment.activity_code;
                query.ActivityText="Membalas";
                query.Desc=query.Comment;
                query.Title="Komentar ";
                activityLogModel.create(query);
                switch (parseInt(query.Type)){
                    case 1:
                        materialsModel.addCommentCountToMaterial(query.ContentID);
                        break;
                    case 2:
                        newsModel.addCommentCountToNews(query.ContentID);
                        break;
                    case 3:
                        forumsModel.addCommentCountToForum(query.ContentID)
                        break;
                }
                result=Object.assign(requestResponse.common_success);
                result.results=detailComment
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/comments/list', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','ContentID'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                result=Object.assign(requestResponse.common_success);
                let comments=await commentsModel.listCommentByID(query.ContentID);
                comments=await parseDataComments(comments);

                let promises=comments.map(async comments=>{
                    let userActivity=await activityLogModel.getUserLogActivity(query.UserID,comments._id);
                    comments.upvoted=false;
                    comments.downvoted=false;
                    comments.favorited=false;
                    await userActivity.forEach(function (index) {
                        switch (parseInt(index.activity_code)){
                            case 2:
                                comments.upvoted=true;
                                break;
                            case 3:
                                comments.downvoted=true;
                                break;
                            case 4:
                                comments.favorited=true;
                                break;
                        }
                    });
                    let reply=await commentsModel.getReplyList(comments._id);
                    reply=await parseDataComments(reply);

                    let replies=reply.map(async reply=>{
                        let userActivity=await activityLogModel.getUserLogActivity(query.UserID,reply._id);
                        reply.upvoted=false;
                        reply.downvoted=false;
                        reply.favorited=false;
                        await userActivity.forEach(function (index) {
                            switch (parseInt(index.activity_code)){
                                case 2:
                                    reply.upvoted=true;
                                    break;
                                case 3:
                                    reply.downvoted=true;
                                    break;
                                case 4:
                                    reply.favorited=true;
                                    break;
                            }
                        });
                        return reply;
                    });
                    comments.reply=await Promise.all(replies);
                    return comments;

                });
                result.results=await Promise.all(promises);

            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});

router.post('/comments/upvote', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','CommentID','Comment'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                query.ContentID=query.CommentID;
                query.ContentCode=activities.upvote_comment.content_code;
                query.ActivityCode=activities.upvote_comment.activity_code;
                query.ContentText=activities.upvote_comment.content;
                query.ActivityText=activities.upvote_comment.activity_text;
                query.Title=query.Comment;
                query.Desc=activities.upvote_comment.desc;
                result=Object.assign(requestResponse.common_success);
                let userCommentActivityDetail=await activityLogModel.checkUserLogActivity2(query,2);
                if(userCommentActivityDetail){
                    await activityLogModel.setStatusAsDeletedByID(userCommentActivityDetail._id);
                    commentsModel.subUpvoteCountToComments(query.ContentID);
                    result.results={};
                }else {
                    let downvoteLog=await activityLogModel.checkUserLogActivity2(query,3);
                    if(downvoteLog){
                        activityLogModel.setStatusAsDeletedByID(downvoteLog._id);
                        commentsModel.subDownvoteCountToComments(query.ContentID);
                    }
                    await commentsModel.addUpvoteCountToComments(query.ContentID);
                    result.results=await activityLogModel.create(query);
                    distributePoins(query.ContentID,query.ActivityCode);
                }
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});
router.post('/comments/downvote', async (ctx) => {
    let query = Object.assign(ctx.request.body, ctx.request.header);
    if (checkBody(['access_token','CommentID','Comment'],query)) {
        try {
            let result;
            let user = await checkToken(query.access_token);
            if (user === false) result=Object.assign(requestResponse.token_invalid);
            else {
                query.UserID=user._id;
                query.Username=user.username;
                query.ContentID=query.CommentID;
                query.ContentCode=activities.downvote_comment.content_code;
                query.ActivityCode=activities.downvote_comment.activity_code;
                query.ContentText=activities.downvote_comment.content;
                query.ActivityText=activities.downvote_comment.activity_text;
                query.Title=query.Comment;
                query.Desc=activities.downvote_comment.desc;
                result=Object.assign(requestResponse.common_success);
                let userCommentActivityDetail=await activityLogModel.checkUserLogActivity2(query,3);
                if(userCommentActivityDetail){
                    await activityLogModel.setStatusAsDeletedByID(userCommentActivityDetail._id);
                    commentsModel.subDownvoteCountToComments(query.ContentID);
                    result.results={};
                }else {
                    let upvoteLog=await activityLogModel.checkUserLogActivity2(query,2);
                    if(upvoteLog){
                        activityLogModel.setStatusAsDeletedByID(upvoteLog._id);
                        commentsModel.subUpvoteCountToComments(query.ContentID);
                    }
                    await commentsModel.addDownvoteCountToComments(query.ContentID);
                    result.results=await activityLogModel.create(query);
                    distributePoins(query.ContentID,query.ActivityCode);
                }
            }
            ctx.body = result;
        } catch (error) {
            console.log("Error : ", error);
            ctx.body = Object.assign(requestResponse.common_error)
        }
    } else ctx.body = Object.assign(requestResponse.body_incomplte)
});

module.exports = router;